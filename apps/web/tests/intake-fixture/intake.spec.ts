import { expect, test } from "@playwright/test";

// Component-level browser test: controlled HTTP responses, not an auth/API integration test.
test("first project retry, duplicate prevention, switching and reload explain unsaved file", async ({ page }) => {
  const projects: { id: string; name: string }[] = [];
  let workspaces = 0, attempts = 0;
  const keys: string[] = [];
  await page.route("**/api/workspaces/personal", async route => {
    workspaces++;
    await route.fulfill({ json: { id: "workspace" }, status: 201 });
  });
  await page.route("**/api/projects**", async route => {
    const request = route.request();
    if (request.url().includes("/assets")) return route.fulfill({ json: [] });
    if (request.method() === "GET") return route.fulfill({ json: projects });
    attempts++;
    keys.push(request.headers()["idempotency-key"]);
    if (attempts === 1) return route.fulfill({ status: 503 });
    const body = request.postDataJSON();
    const project = { id: `project-${projects.length + 1}`, name: body.name };
    projects.push(project);
    return route.fulfill({ status: 201, json: project });
  });
  await page.goto("/");
  await page.getByLabel("Describe the room").fill("Retain this brief");
  await page.getByText("Create project", { exact: true }).click();
  await page.getByLabel("Project name").fill("Living room");
  await page.getByRole("button", { name: "Create project and continue" }).click();
  await expect(page.locator('p[role="status"]')).toContainText("Could not create");
  await expect(page.getByLabel("Describe the room")).toHaveValue("Retain this brief");
  await page.getByRole("button", { name: "Create project and continue" }).dblclick();
  await expect(page.locator('p[role="status"]')).toContainText("Project created");
  expect(attempts).toBe(2);
  expect(keys[0]).toBe(keys[1]);
  expect(workspaces).toBe(2); // idempotent workspace endpoint called on retry
  await expect(page.getByLabel("Choose or drop an image")).toBeFocused();
  await page.getByLabel("Choose or drop an image").setInputFiles({ name: "synthetic.png", mimeType: "image/png", buffer: Buffer.from("synthetic fixture") });
  await page.getByLabel("Project name").fill("Second room");
  await page.getByRole("button", { name: "Create project and continue" }).click();
  await expect(page.getByText("synthetic.png")).toBeVisible();
  await page.getByRole("radio", { name: "Living room" }).check();
  await expect(page.getByText("synthetic.png")).toBeVisible();
  await expect(page.getByLabel("Describe the room")).toHaveValue("Retain this brief");
  await expect(page.getByLabel("Room setting")).toHaveValue("Warm");
  await page.reload();
  await expect(page.getByText("synthetic.png")).toHaveCount(0);
  await expect(page.getByLabel("Choose or drop an image")).toHaveValue("");
  await expect(page.locator('p[role="status"]')).toContainText("Choose it again");
});

test("saved project image is cleared when switching to a different project", async ({ page }) => {
  await page.route("**/api/projects**", async route => {
    const url = route.request().url();
    if (url.includes("/project-a/assets")) return route.fulfill({ json: [{ id: "asset-a", mimeType: "image/png", createdAt: "2026-01-01" }] });
    if (url.includes("/project-b/assets")) return route.fulfill({ json: [] });
    return route.fulfill({ json: [{ id: "project-a", name: "First" }, { id: "project-b", name: "Second" }] });
  });
  await page.route("**/api/assets/**", route => route.fulfill({ status: 404 }));
  await page.goto("/");
  await page.getByRole("radio", { name: "Image 1" }).check();
  await expect(page.getByTestId("preview")).toContainText("asset-a");
  await page.getByRole("radio", { name: "Second" }).check();
  await expect(page.getByTestId("preview")).toBeEmpty();
  await expect(page.getByTestId("selection")).toContainText('"sourceAssetId":""');
});

test("delayed creation prevents duplicates; locale switch retains draft and client navigation requests reselection", async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  let posts = 0;
  const projects: { id: string; name: string }[] = [];
  await page.route("**/api/workspaces/personal", route => route.fulfill({ status: 201, json: { id: "workspace" } }));
  await page.route("**/api/projects**", async route => {
    if (route.request().url().includes("/assets")) return route.fulfill({ json: [] });
    if (route.request().method() === "GET") return route.fulfill({ json: projects });
    posts++;
    await gate;
    projects.push({ id: "project-a", name: "Living room" });
    return route.fulfill({ status: 201, json: projects[0] });
  });
  await page.goto("/");
  await page.getByLabel("Describe the room").fill("Retain draft");
  await page.getByLabel("Room setting").fill("Oak");
  await page.getByText("Create project", { exact: true }).click();
  await page.getByLabel("Project name").fill("Living room");
  const create = page.getByRole("button", { name: "Create project and continue" });
  await create.click();
  await expect(page.getByRole("button", { name: "Creating…" })).toBeDisabled();
  await expect.poll(() => posts).toBe(1);
  release();
  await expect(page.getByText("Project created. Choose an image.")).toBeVisible();
  await page.getByLabel("Choose or drop an image").setInputFiles({ name: "synthetic.png", mimeType: "image/png", buffer: Buffer.from("fixture") });
  await page.getByRole("button", { name: "Switch language" }).click();
  await expect(page.getByText("synthetic.png")).toBeVisible();
  await expect(page.getByLabel("Describe the room")).toHaveValue("Retain draft");
  await expect(page.getByLabel("Room setting")).toHaveValue("Oak");
  await expect(page.getByRole("radio", { name: "Living room" })).toBeChecked();
  await page.getByRole("link", { name: "Other page" }).click();
  await expect(page.getByRole("heading", { name: "Other fixture page" })).toBeVisible();
  await page.goBack();
  await expect(page.getByText("Your unsaved image was not retained. Choose it again.")).toBeVisible();
  await expect(page.getByText("synthetic.png")).toHaveCount(0);
  await expect(page.getByLabel("Describe the room")).toHaveValue("");
  await expect(page.getByLabel("Room setting")).toHaveValue("Warm");
  await expect(page.getByRole("radio", { name: "Living room" })).toBeChecked();
});

test("project creation and switching cannot race an in-flight upload", async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/api/projects**", async route => {
    const request = route.request();
    if (request.url().includes("/assets") && request.method() === "POST") {
      await gate;
      return route.fulfill({ json: { assetId: "asset-a" }, status: 201 });
    }
    if (request.url().includes("/assets")) return route.fulfill({ json: [] });
    return route.fulfill({ json: [{ id: "project-a", name: "First" }, { id: "project-b", name: "Second" }] });
  });
  await page.goto("/");
  await page.getByText("Create project", { exact: true }).click();
  await page.getByLabel("Project name").fill("Third");
  await page.getByLabel("Choose or drop an image").setInputFiles({ name: "draft.png", mimeType: "image/png", buffer: Buffer.from("fixture") });
  await page.getByRole("button", { name: "Upload image" }).click();
  await expect(page.getByRole("button", { name: "Uploading…" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Create project and continue" })).toBeDisabled();
  await expect(page.getByRole("radio", { name: "Second" })).toBeDisabled();
  release();
  await expect(page.getByText("Saved privately.")).toBeVisible();
  await expect(page.getByTestId("selection")).toContainText('"projectId":"project-a"');
  await expect(page.getByTestId("selection")).toContainText('"sourceAssetId":"asset-a"');
});

test("a delayed previous-project image list cannot replace the selected project's images", async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/api/projects**", async route => {
    const url = route.request().url();
    if (url.includes("/project-a/assets")) {
      await gate;
      return route.fulfill({ json: [{ id: "asset-a", mimeType: "image/png", createdAt: "2026-01-01" }] });
    }
    if (url.includes("/project-b/assets")) return route.fulfill({ json: [{ id: "asset-b", mimeType: "image/png", createdAt: "2026-01-01" }] });
    return route.fulfill({ json: [{ id: "project-a", name: "First" }, { id: "project-b", name: "Second" }] });
  });
  await page.route("**/api/assets/**", route => route.fulfill({ status: 404 }));
  const firstRequest = page.waitForRequest("**/api/projects/project-a/assets");
  await page.goto("/");
  await firstRequest;
  await page.getByRole("radio", { name: "Second" }).check();
  await page.getByRole("radio", { name: "Image 1" }).check();
  await expect(page.getByTestId("selection")).toContainText('"sourceAssetId":"asset-b"');
  const staleResponse = page.waitForResponse("**/api/projects/project-a/assets");
  release();
  await staleResponse;
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  await expect(page.getByTestId("selection")).toContainText('"projectId":"project-b"');
  await expect(page.getByTestId("selection")).toContainText('"sourceAssetId":"asset-b"');
});

test("actual Editor warns after reload and navigation when unsaved text and choices reset", async ({ page }) => {
  await page.route("**/api/projects**", route => route.fulfill({ json: [] }));
  await page.goto("/editor");
  await page.locator("#prompt").fill("Private synthetic brief");
  await page.getByRole("radio", { name: "Japandi" }).check();
  const stored = await page.evaluate(() => JSON.stringify(sessionStorage));
  expect(stored).not.toContain("Private synthetic brief");
  await page.reload();
  await expect(page.getByRole("status").filter({ hasText: "previous unsaved description and settings" })).toBeVisible();
  await expect(page.locator("#prompt")).toHaveValue("");
  await expect(page.getByRole("radio", { name: "Japandi" })).not.toBeChecked();
  await page.locator("#prompt").fill("Another private fixture");
  await page.getByRole("link", { name: "Other fixture page" }).click();
  await expect(page.getByRole("heading", { name: "Other fixture page" })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("status").filter({ hasText: "previous unsaved description and settings" })).toBeVisible();
  await expect(page.locator("#prompt")).toHaveValue("");
});

test("actual Editor retains tool, locale, brief, style and source through create failure and retry", async ({ page }) => {
  const projects = [{ id: "first", name: "Existing" }];
  let creations = 0;
  await page.route("**/api/workspaces/personal", route => route.fulfill({ status: 201, json: { id: "workspace" } }));
  await page.route("**/api/projects**", async route => {
    if (route.request().url().includes("/assets")) return route.fulfill({ json: [] });
    if (route.request().method() === "GET") return route.fulfill({ json: projects });
    creations++;
    if (creations === 1) return route.fulfill({ status: 503 });
    projects.push({ id: "second", name: "New room" });
    return route.fulfill({ status: 201, json: projects[1] });
  });
  await page.goto("/editor");
  await expect(page.locator(".studio-tool-switcher summary")).toContainText("Room Reimagination");
  await page.locator("#prompt").fill("Keep the oak shelving");
  await page.getByRole("radio", { name: "Japandi" }).check();
  await page.getByLabel("Choose or drop an image").setInputFiles({ name: "source.png", mimeType: "image/png", buffer: Buffer.from("synthetic") });
  await page.getByText("Create project", { exact: true }).click();
  await page.getByLabel("Project name").fill("New room");
  await page.getByRole("button", { name: "Create project and continue" }).click();
  await expect(page.getByText("Could not create the project. Try again.")).toBeVisible();
  await page.getByRole("button", { name: "Create project and continue" }).click();
  await expect(page.getByText("Project created. Choose an image.")).toBeVisible();
  await expect(page.getByRole("radio", { name: "New room" })).toBeChecked();
  await expect(page.locator("#prompt")).toHaveValue("Keep the oak shelving");
  await expect(page.getByRole("radio", { name: "Japandi" })).toBeChecked();
  await expect(page.getByText("source.png")).toBeVisible();
  await page.getByRole("radio", { name: "Existing" }).check();
  await expect(page.locator("#prompt")).toHaveValue("Keep the oak shelving");
  await expect(page.getByRole("radio", { name: "Japandi" })).toBeChecked();
  await expect(page.getByText("source.png")).toBeVisible();
  await page.getByRole("radio", { name: "New room" }).check();
  await page.getByRole("button", { name: "Switch fixture locale" }).click();
  await expect(page.locator(".studio-tool-switcher summary")).toContainText("Room Reimagination");
  await expect(page.locator("#prompt")).toHaveValue("Keep the oak shelving");
  await expect(page.getByRole("radio", { name: "Japandi" })).toBeChecked();
  await expect(page.getByText("source.png")).toBeVisible();
  await expect(page.getByRole("radio", { name: "New room" })).toBeChecked();
});
