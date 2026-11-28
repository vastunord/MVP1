import { expect, test } from "@playwright/test";

test("local guides, lighting and sky switches change only the preview", async ({page}) => {
  for (const [tool, field] of [["perspective-correction", "guides"], ["lighting-reimagination","preview"], ["sky-transformation","preview"]]) {
    await page.goto("/app/tools/"+tool+"?sample=gallery-01");
    const toggle = page.locator("#option-"+field);
    await expect(toggle).toBeChecked();
    const image = page.locator(".sample-stage > img").first();
    const saved = await image.getAttribute("src");
    if(tool==="perspective-correction"){
      await expect(page.locator(".sample-guides")).toBeVisible();
      const vertical = page.locator("#option-vertical");
      await vertical.focus(); await vertical.press("ArrowRight");
      await expect(vertical).toHaveValue("5");
      await expect(image).toHaveCSS("transform", /matrix/);
    } else if(tool==="lighting-reimagination"){
      const temperature=page.locator("#option-temperature");
      await expect(temperature).toHaveAttribute("min","2200");
      await expect(temperature).toHaveAttribute("max","5000");
      await temperature.focus(); await temperature.press("ArrowRight");
      await expect(temperature).toHaveValue("2800");
      await expect(image).toHaveCSS("filter", /sepia/);
    } else {
      await expect(page.locator(".sample-stage > div[aria-hidden=true]")).toBeVisible();
    }
    await toggle.uncheck();
    if(tool==="perspective-correction") await expect(page.locator(".sample-guides")).toHaveCount(0);
    if(tool==="lighting-reimagination") await expect(image).toHaveCSS("filter","none");
    if(tool==="sky-transformation") await expect(page.locator(".sample-stage > div[aria-hidden=true]")).toHaveCount(0);
    await expect(image).toHaveAttribute("src",saved!);
  }
});

test("an object plan requires a source and supports positions, sizes, details and removal", async ({page})=>{
  await page.goto("/app/tools/object-placement");
  const add=page.getByRole("button",{name:"Legg til i midten"});
  await expect(add).toBeDisabled();
  await page.goto("/app/tools/object-placement?sample=gallery-01");
  await add.click();
  await page.getByRole("radio",{name:"Stor",exact:true}).check();
  await page.getByLabel("Detaljer",{exact:true}).fill("Bench near the terrace");
  const x=page.getByRole("slider",{name:"Vannrett posisjon"});
  await x.focus(); await x.press("ArrowRight"); await expect(x).toHaveValue("51");
  await page.getByRole("button",{name:"Ferdig",exact:true}).click();
  await page.getByRole("button",{name:"Rediger posisjon 1"}).click();
  await expect(page.getByRole("radio",{name:"Stor",exact:true})).toBeChecked();
  await expect(page.getByLabel("Detaljer",{exact:true})).toHaveValue("Bench near the terrace");
  await page.getByRole("button",{name:"Fjern posisjon",exact:true}).click();
  await expect(page.locator(".placement-pin")).toHaveCount(0);
  await expect(page.locator(".primary-action button")).toBeDisabled();
});

test("decor restyling and material selection stay tied to the selected position", async ({page})=>{
  await page.goto("/app/tools/decor-redefinition?sample=gallery-01");
  const newDecor=page.getByRole("button",{name:"Plasser ny dekor"});
  await newDecor.click();
  await page.getByRole("button",{name:"Velg posisjon på bildet"}).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("radio",{name:"Legg til",exact:true})).toBeChecked();
  await page.getByRole("radio",{name:"Endre stil",exact:true}).check();
  await page.getByRole("button",{name:"Ferdig",exact:true}).click();
  await page.getByRole("button",{name:"Rediger posisjon 1"}).click();
  await expect(page.getByRole("radio",{name:"Endre stil",exact:true})).toBeChecked();
  await page.goto("/app/tools/material-refinement?sample=gallery-01");
  await expect(page.getByRole("group",{name:"Palett",exact:true}).getByRole("radio")).toHaveCount(7);
  await page.getByRole("button",{name:"Legg til i midten"}).click();
  await page.getByRole("radio",{name:"Kvarts",exact:true}).check();
  await page.getByRole("radio",{name:"Gulv",exact:true}).check();
  await expect(page.getByRole("radio",{name:"Kvarts",exact:true})).toHaveCount(0);
  await page.getByRole("group",{name:"Materiale",exact:true}).getByRole("radio",{name:"Valnøtt",exact:true}).check();
  await page.getByRole("button",{name:"Ferdig",exact:true}).click();
  await page.getByRole("button",{name:"Rediger posisjon 1"}).click();
  await expect(page.getByRole("group",{name:"Materiale",exact:true}).getByRole("radio",{name:"Valnøtt",exact:true})).toBeChecked();
});

test("garden tidy presets keep three initial tasks and restore the previous design scope", async({page})=>{
  await page.goto("/app/tools/garden-design");
  const terrace=page.getByRole("radio",{name:"Terrace",exact:true});
  await terrace.check();
  const tidy=page.getByLabel("Rydd opp i hagen");
  await tidy.check();
  const tasks=page.getByRole("group",{name:"Hagearbeid"});
  await expect(tasks.getByRole("checkbox")).toHaveCount(6);
  await expect(tasks.locator("input:checked")).toHaveCount(3);
  await tasks.getByRole("checkbox",{name:"Fyll tomrom"}).check();
  await expect(terrace).toBeDisabled();
  await expect(page.locator(".primary-action button")).toContainText("Rydd hagen");
  await tidy.uncheck();
  await expect(terrace).toBeChecked();
  await expect(terrace).toBeEnabled();
});

test("pool mode scopes the schematic and amenities; winter reveals snow settings",async({page})=>{
  await page.goto("/app/tools/pool-redesign");
  const plan=page.locator(".designer-pool-plan");
  await expect(plan.locator("span")).toHaveCount(1);
  await expect(page.locator("#option-feature-0")).toHaveCount(0);
  await page.getByRole("radio",{name:/Basseng \+ spa/}).check();
  await expect(plan.locator("span")).toHaveCount(2);
  await expect(page.locator("#option-feature-0")).toBeVisible();
  await page.getByRole("radio",{name:/^Spa Form/}).check();
  await expect(plan.locator("span")).toHaveCount(1);
  await page.goto("/app/tools/seasonal-transformation");
  await page.getByRole("radio",{name:/Vinter Nakne/}).check();
  await expect(page.getByRole("radio",{name:"Heavy snow",exact:true})).toBeVisible();
  await page.getByRole("radio",{name:/Vår Friskt/}).check();
  await expect(page.getByRole("radio",{name:"Heavy snow",exact:true})).toHaveCount(0);
});
