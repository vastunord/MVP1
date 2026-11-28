import { expect, test } from "@playwright/test";

test("restored project images do not replace a newly selected local image", async ({ page }) => {
  await page.route("**/api/**", async (route) => {
    const url = route.request().url();
    if (url.includes("/api/assets/")) return route.fulfill({ status: 404 });
    if (url.includes("/assets")) return route.fulfill({ json: [{ id: "saved-image", mimeType: "image/png", createdAt: "2026-01-01" }] });
    return route.fulfill({ json: [{ id: "project-a", name: "First" }, { id: "project-b", name: "Second" }] });
  });
  await page.goto("/maya");
  await page.getByRole("radio", { name: "Second" }).check();
  await page.getByRole("group", { name: "Saved images" }).getByRole("radio", { name: "Image 1" }).check();
  await page.getByRole("radio", { name: "First" }).check();
  await page.getByLabel("Choose or drop an image").setInputFiles({ name: "local.png", mimeType: "image/png", buffer: Buffer.from("synthetic fixture") });
  await page.getByRole("radio", { name: "Second" }).check();
  await expect(page.getByText("local.png")).toBeVisible();
  await expect(page.getByRole("group", { name: "Saved images" }).getByRole("radio", { name: "Image 1" })).not.toBeChecked();
});

test("late project image results cannot restore an image into another project", async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  let requested!: () => void;
  const pending = new Promise<void>((resolve) => { requested = resolve; });
  await page.route("**/api/**", async (route) => {
    const url = route.request().url();
    if (url.includes("/api/assets/")) return route.fulfill({ status: 404 });
    if (url.includes("project-a/assets")) { requested(); await gate; return route.fulfill({ json: [{ id: "old-image", mimeType: "image/png", createdAt: "2026-01-01" }] }); }
    if (url.includes("project-b/assets")) return route.fulfill({ json: [{ id: "new-image", mimeType: "image/png", createdAt: "2026-01-01" }] });
    return route.fulfill({ json: [{ id: "project-a", name: "First" }, { id: "project-b", name: "Second" }] });
  });
  await page.goto("/maya");
  await pending;
  await page.getByRole("radio", { name: "Second" }).check();
  await expect(page.getByRole("group", { name: "Saved images" }).locator("img")).toHaveAttribute("src", /new-image/);
  release();
  await expect(page.getByRole("group", { name: "Saved images" }).locator("img")).toHaveAttribute("src", /new-image/);
});

test("Maya restores only currently authorized project images and references", async ({ page }) => {
  let deleted = false;
  let writes = 0;
  await page.route("**/api/**", async (route) => {
    if (route.request().method() !== "GET") writes++;
    const url = route.request().url();
    if (url.includes("/api/assets/")) return route.fulfill({ status: 404 });
    if (url.includes("/assets")) return route.fulfill({ json: deleted ? [{ id: "reference", mimeType: "image/png", createdAt: "2026-01-01" }] : [{ id: "source", mimeType: "image/png", createdAt: "2026-01-01" }, { id: "reference", mimeType: "image/png", createdAt: "2026-01-01" }] });
    return route.fulfill({ json: [{ id: "project-a", name: "First" }] });
  });
  await page.goto("/maya");
  await page.getByRole("group", { name: "Saved images" }).getByRole("radio", { name: "Image 1" }).check();
  await page.getByText("Reference images", { exact: true }).click();
  await page.getByRole("group", { name: "First reference" }).getByRole("radio", { name: "Image 1" }).check();
  await page.reload();
  await expect(page.getByRole("group", { name: "Saved images" }).getByRole("radio", { name: "Image 1" })).toBeChecked();
  await page.getByText("Reference images", { exact: true }).click();
  await expect(page.getByRole("group", { name: "First reference" }).getByRole("radio", { name: "Image 1" })).toBeChecked();
  await page.getByRole("button", { name: "Switch account" }).click();
  await expect(page.getByRole("group", { name: "Saved images" }).getByRole("radio", { name: "Image 1" })).not.toBeChecked();
  await page.getByRole("button", { name: "Switch account" }).click();
  await expect(page.getByRole("group", { name: "Saved images" }).getByRole("radio", { name: "Image 1" })).toBeChecked();
  deleted = true;
  await page.reload();
  await expect(page.getByText("A previously selected image is no longer available. Choose another.")).toBeVisible();
  await expect(page.getByRole("group", { name: "Saved images" }).getByRole("radio", { name: "Image 1" })).not.toBeChecked();
  expect(writes).toBe(0);
});

test("same-route account switch clears private project names, local sources and the previous brief", async ({ page }) => {
  let owner = "A";
  await page.route("**/api/projects", route => route.fulfill({ json: [{ id: "project-" + owner, name: "Private workspace " + owner }] }));
  await page.route("**/api/projects/*/assets", route => route.fulfill({ json: [] }));
  await page.goto("/maya");
  await expect(page.getByRole("radio", { name: "Private workspace A" })).toBeChecked();
  await page.locator("#prompt").fill("Owner A private brief");
  await page.getByLabel("Choose or drop an image").setInputFiles({ name: "private-a.png", mimeType: "image/png", buffer: Buffer.from("fixture") });
  await expect(page.getByText("private-a.png")).toBeVisible();
  owner = "B";
  await page.getByRole("button", { name: "Switch account" }).click();
  await expect(page.getByRole("radio", { name: "Private workspace B" })).toBeChecked();
  await expect(page.getByRole("radio", { name: "Private workspace A" })).toHaveCount(0);
  await expect(page.getByText("private-a.png")).toHaveCount(0);
  await expect(page.getByText(/Your unsaved image was not retained/)).toHaveCount(0);
  await expect(page.getByLabel("Choose or drop an image")).toHaveValue("");
  await expect(page.locator("#prompt")).toHaveValue("");
});

test("Maya draft restores per account, project and tool without uploading or submitting", async ({ page }) => {
  let writes = 0;
  await page.route("**/api/**", async (route) => {
    if (route.request().method() !== "GET") writes++;
    if (route.request().url().includes("/assets")) return route.fulfill({ json: [] });
    return route.fulfill({ json: [{ id: "project-a", name: "First" }, { id: "project-b", name: "Second" }] });
  });
  await page.goto("/maya");
  const prompt = page.locator("#prompt");
  await expect(page.getByRole("radio", { name: "First" })).toBeChecked();
  await prompt.fill("Project A draft");
  await page.getByRole("radio", { name: "Second" }).check();
  await expect(prompt).toHaveValue("");
  await prompt.fill("Project B draft");
  await page.getByRole("radio", { name: "First" }).check();
  await expect(prompt).toHaveValue("Project A draft");
  await page.getByRole("radio", { name: "Second" }).check();
  await expect(prompt).toHaveValue("Project B draft");
  await page.getByRole("button", { name: "Switch tool" }).click();
  await page.getByRole("button", { name: "Switch tool" }).click();
  await page.getByRole("radio", { name: "Second" }).check();
  await expect(page.locator("#prompt")).toHaveValue("Project B draft");
  await page.reload();
  await page.getByRole("radio", { name: "Second" }).check();
  await expect(page.locator("#prompt")).toHaveValue("Project B draft");
  await page.getByRole("button", { name: "Switch account" }).click();
  await expect(page.locator("#prompt")).toHaveValue("");
  expect(writes).toBe(0);
});

// Component-level browser test: controlled HTTP responses, not an auth/API integration test.
test("Studio return survives sign-in errors and recovery links, then opens the intended screen", async ({ page }) => {
  let attempts = 0;
  await page.route("**/api/auth/sign-in/email", async route => {
    attempts++;
    await route.fulfill(attempts === 1
      ? { status: 401, json: { code: "INVALID_EMAIL_OR_PASSWORD", message: "Invalid test credentials" } }
      : { json: { redirect: false } });
  });
  await page.goto("/login?returnTo=%2Fapp%2Flibrary");
  await expect(page.getByRole("link", { name: "Forgot password?" })).toHaveAttribute("href", "/en/forgot-password?returnTo=%2Fapp%2Flibrary");
  await expect(page.getByRole("link", { name: "Create account" })).toHaveAttribute("href", "/en/signup?returnTo=%2Fapp%2Flibrary");
  await page.getByLabel("Email", { exact: true }).fill("visitor@example.invalid");
  await page.getByLabel("Password", { exact: true }).fill("fixture-only");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.locator(".auth-panel").getByRole("alert")).toHaveText("Invalid test credentials");
  const successfulLogin = page.waitForResponse(response => response.url().endsWith("/api/auth/sign-in/email") && response.status() === 200);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await successfulLogin;
  await page.waitForURL("**/app/library");
  await expect(page.getByRole("heading", { name: "Room Reimagination" })).toBeVisible();
});

test("first visit can skip naming and retry into the Studio library", async ({ page }) => {
  let requests = 0;
  await page.route("**/api/workspaces/personal", async route => {
    expect(route.request().postDataJSON()).toEqual({ name: "My workspace" });
    requests++;
    await route.fulfill({ status: requests === 1 ? 503 : 201, json: {} });
  });
  await page.goto("/onboarding");
  const skip = page.getByRole("button", { name: "Skip naming and open Studio" });
  await skip.click();
  await expect(page.locator(".auth-panel").getByRole("alert")).toHaveText("Studio could not be set up.");
  await skip.click();
  await expect(page).toHaveURL(/\/app\/library$/);
  await expect(page.getByRole("link").filter({ hasText: "Room Reimagination" }).first()).toBeVisible();
  expect(requests).toBe(2);
});

test("start without a named project and upload to the returned private workspace", async ({ page }) => {
  let uploaded = false;
  const keys: string[] = [];
  await page.route("**/api/workspaces/independent", async route => {
    keys.push(route.request().headers()["idempotency-key"]);
    expect(route.request().postDataJSON()).toEqual({ locale: "en" });
    if (keys.length === 1) return route.fulfill({ status: 503 });
    return route.fulfill({ status: 201, json: { id: "independent-a", name: "Untitled workspace" } });
  });
  await page.route("**/api/projects", route => {
    expect(route.request().method()).toBe("GET");
    return route.fulfill({ json: [] });
  });
  await page.route("**/api/projects/independent-a/assets", route => {
    if (route.request().method() === "POST") {
      uploaded = true;
      return route.fulfill({ status: 201, json: { assetId: "input-a" } });
    }
    return route.fulfill({ json: uploaded ? [{ id: "input-a", mimeType: "image/png" }] : [] });
  });
  await page.goto("/");
  const start = page.getByRole("button", { name: "Start without a project" });
  await expect(page.getByTestId("selection")).toContainText('"projectId":""');
  await start.click();
  await expect(page.getByText("Could not open the workspace. Try again.")).toBeVisible();
  await start.click();
  await expect(page.getByLabel("Choose or drop an image")).toBeFocused();
  expect(keys).toHaveLength(2);
  expect(keys[0]).toEqual(keys[1]);
  await page.getByLabel("Choose or drop an image").setInputFiles({ name: "source.png", mimeType: "image/png", buffer: Buffer.from("fixture") });
  await page.getByRole("button", { name: "Upload image" }).click();
  await expect(page.getByTestId("selection")).toContainText('"sourceAssetId":"input-a"');
  await expect(page.getByTestId("selection")).toContainText('"projectId":"independent-a"');
});

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
