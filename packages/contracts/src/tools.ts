export const categories = [
  "Interior Design",
  "Exterior & Landscape",
  "Virtual Staging",
  "Image Enhancement",
] as const;
export type Category = (typeof categories)[number];
export type Control = {
  id: string;
  label: string;
  kind: "select" | "range" | "toggle" | "action" | "unknown" | "integer";
  options?: readonly string[];
  legacyOptions?: readonly string[];
  defaultValue?: string | number | boolean;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  when?: { id: string; values: readonly string[] };
};
export interface ToolDefinition {
  id: string;
  name: string;
  category: Category;
  route: string;
  prompt: string;
  action: string;
  briefLimit?: number;
  avoidLimit?: number;
  reference: boolean;
  improve: boolean;
  framing: string;
  comparison?: readonly [string, string];
  controls: readonly Control[];
  configVersion: 1;
}
const select = (
  id: string,
  label: string,
  options: readonly string[],
  defaultValue?: string,
  legacyOptions?: readonly string[],
): Control => ({ id, label, kind: "select", options, defaultValue, legacyOptions });
const toggle = (
  id: string,
  label: string,
  defaultValue?: boolean,
): Control => ({ id, label, kind: "toggle", defaultValue });
const action = (id: string, label: string): Control => ({
  id,
  label,
  kind: "action",
});
const unknown = (id: string, label: string): Control => ({
  id,
  label,
  kind: "unknown",
});
const range = (
  id: string,
  label: string,
  value: number,
  unit?: string,
): Control => ({
  id,
  label,
  kind: "range",
  defaultValue: value,
  ...(unit === "%" ? { min: 0, max: 100 } : {}),
  unit,
});
const room = select(
  "room",
  "Room type",
  [
    "Auto-detect",
    "Living room",
    "Bedroom",
    "Kitchen",
    "Bathroom",
    "Dining",
    "Office",
    "Hallway",
  ],
  "Auto-detect",
);
const roomStyle = select("style", "Room style", [
  "Scandinavian",
  "Japandi",
  "Modern luxury",
  "Minimalist",
  "Industrial",
  "Biophilic",
], "Scandinavian", ["Auto"]);
const palette = select(
  "palette",
  "Palette",
  [
    "Auto",
    "Pale oak",
    "Ink & cream",
    "Ember",
    "Sea glass",
    "Clay",
    "Deep forest",
  ],
  "Auto",
);
const ratio = select(
  "ratio",
  "Output ratio",
  ["Original", "1:1", "4:3", "3:2", "16:9"],
  "Original",
);
const daylight = select("time", "Time of day", ["As photographed", "Morning", "Midday", "Golden hour", "Blue hour", "Night"], "As photographed", ["Soft daylight", "Direct sun"]);
const familyLayout = toggle("safe", "Child-friendly layout", false);
const roomDesign: Control[] = [
  select("medium", "Render style", ["Photography", "Clean 3D", "Architectural", "Pencil", "Watercolor", "Illustration", "Diagram", "Line drawing", "Neutral clay", "Clay model", "CAD", "Material study"], "Photography"),
  room, roomStyle, palette,
  select("camera", "Camera", ["Keep framing", "Reframe"], "Keep framing"),
  {
    ...select("viewpoint", "Viewpoint", ["Eye level", "Low angle", "Elevated"], "Eye level"),
    when: { id: "camera", values: ["Reframe"] },
  },
  daylight,
  select("lighting", "Lighting", ["Auto", "Natural only", "Warm lamps", "Bright", "Moody"], "Auto", ["Window light", "Task lighting", "Layered"]),
  select("furnishing", "Furnishing", ["Keep existing", "Light", "Balanced", "Full"], "Keep existing", ["Auto", "Empty", "Minimal"]),
  select("plants", "Indoor plants", ["Auto", "None", "A few", "Generous"], "Auto", ["Lush"]),
  select("accessories", "Accessories", ["Auto", "Minimal", "Considered", "Layered"], "Auto", ["None", "Curated"]),
  select("floor", "Floor finish", ["Keep existing", "Pale oak", "Walnut", "Concrete", "Stone", "Terrazzo"], "Keep existing", ["Pale timber", "Natural stone", "Polished"]),
  familyLayout,
  select("people", "People", ["Auto", "None", "A few", "Many"], "Auto"),
  select("markings", "Annotations", ["Keep existing", "Remove text"], "Keep existing"),
  ratio,
];
const season = select(
  "season",
  "Season",
  ["Spring", "Summer", "Autumn", "Winter"],
  "Spring",
);
const outside = select("style", "Outdoor style", [
  "Naturalistic",
  "Formal",
  "Mediterranean",
  "Nordic",
  "Desert",
  "Tropical",
], "Naturalistic");
const outdoors: Control[] = [
  daylight,
  outside,
  range("density", "Lighting density", 30, "%"),
  select("people", "People", ["Keep existing", "None", "A few", "Many"], "Keep existing"),
  select("site", "Site context", ["Auto", "Urban", "Suburban", "Nature"], "Auto"),
  select("greenery", "Greenery", ["Keep existing", "Sparse", "Balanced", "Lush"], "Keep existing"),
  select("vehicles", "Vehicles", ["Keep existing", "None", "A few", "Many"], "Keep existing"),
  select("weather", "Weather", [
    "As photographed",
    "Clear",
    "Overcast",
    "Hazy",
    "Rain",
    "Snow",
  ], "As photographed"),
  action("suggest", "VastuNord suggestions · Show"),
  action("area", "Analyze an area · Select"),
];
const tidy: Control[] = [
  "Mow & edge",
  "Weed",
  "Fresh mulch",
  "Prune & shape",
  "Clean paving",
  "Fill gaps",
].map((label, i) => ({
  ...toggle("tidy-" + i, label, i < 3),
  when: { id: "tidy", values: ["true"] },
}));
const manual = (c: Control): Control => ({
  ...c,
  when: { id: "mode", values: ["Manual controls"] },
});
type Seed = Omit<
  ToolDefinition,
  "route" | "configVersion" | "framing" | "improve" | "reference"
> &
  Partial<Pick<ToolDefinition, "framing" | "improve" | "reference">>;
const seeds: Seed[] = [
  {
    id: "room-reimagination",
    briefLimit: 1000,
    avoidLimit: 400,
    name: "Room Reimagination",
    category: "Interior Design",
    prompt: "Describe the room",
    action: "Generate room",
    comparison: ["Today", "Reimagined"],
    controls: roomDesign,
  },
  {
    id: "virtual-home-staging",
    briefLimit: 1000,
    name: "Virtual Home Staging",
    category: "Virtual Staging",
    prompt: "Describe the staging · Anything specific?",
    action: "Stage this room",
    comparison: ["Today", "Staged"],
    controls: [
      select("buyer", "Buyer profile", [
        "Family",
        "Young professional",
        "Downsizer",
        "Luxury",
        "Neutral",
      ], "Family"),
      familyLayout,
    ],
  },
  {
    id: "outdoor-visualization",
    briefLimit: 1000,
    name: "Outdoor Visualization",
    category: "Exterior & Landscape",
    prompt: "Describe the outside",
    action: "Visualize outside",
    comparison: ["Today", "Reimagined"],
    controls: outdoors,
  },
  {
    id: "hardscape-design",
    briefLimit: 1000,
    name: "Hardscape Design",
    category: "Exterior & Landscape",
    prompt: "Anything else? · Anything the surfaces do not say",
    action: "Design the hardscape",
    comparison: ["Today", "Hardscaped"],
    controls: [...outdoors.filter(control => control.id !== "area"), action("surfaces", "Surfaces · Mark")],
  },
  {
    id: "furniture-refresh",
    briefLimit: 1000,
    name: "Furniture Refresh",
    category: "Interior Design",
    prompt: "What should change?",
    action: "Refresh furniture",
    comparison: ["Today", "Refreshed"],
    controls: [
      room,
      roomStyle,
      daylight,
      action("refresh", "Refresh now"),
      action("pick", "Pick"),
      action("place", "Place"),
      action("asset", "Choose furniture asset"),
      toggle("cleanup", "Clean up the room", false),
      familyLayout,
    ],
  },
  {
    id: "seasonal-styling",
    briefLimit: 1000,
    name: "Seasonal Styling",
    category: "Virtual Staging",
    prompt: "Describe the seasonal styling",
    action: "Style for spring",
    comparison: ["Today", "Summer"],
    controls: [
      room,
      roomStyle,
      select("palette", "Palette", ["Season’s own", ...palette.options!.slice(1)], "Season’s own", ["Spring’s own"]),
      season,
    ],
  },
  {
    id: "visual-cleanup",
    briefLimit: 1000,
    name: "Visual Cleanup",
    category: "Image Enhancement",
    reference: false,
    improve: false,
    prompt: "Describe what to clean up",
    action: "Clean up image",
    controls: [
      select("mode", "Editing mode", ["AI object editing", "Brush & delete"], "AI object editing"),
      ...[
        "Bins",
        "Cables",
        "Cars",
        "People",
        "Signs",
        "Loose clutter",
        "Power lines",
        "Reflections",
      ].map((x, i) => toggle("remove-" + i, x, false)),
      action("pick", "Pick things on photo · Pick"),
    ],
  },
  {
    id: "resolution-enhancement",
    name: "Resolution Enhancement",
    category: "Image Enhancement",
    reference: false,
    improve: false,
    prompt: "Describe the enhancement",
    action: "Enhance image",
    comparison: ["Today", "Natural · preview"],
    controls: [
      select(
        "mode",
        "Enhancement mode",
        ["Auto enhance", "Manual controls"],
        "Auto enhance",
      ),
      ...[
        "Noise reduction",
        "Sharpness",
        "Brightness",
        "Contrast",
        "Saturation",
      ].map((x, i) => manual({ ...range("adjust-" + i, x, 0), min: i < 2 ? 0 : -100, max: 100, step: 5 })),
      { ...select("upscale", "Upscale", ["Original size", "2×", "4×"], "Original size"), when: { id: "mode", values: ["Auto enhance"] } },
      manual(
        select("look", "Look", [
          "None",
          "Natural",
          "Warm",
          "Cool",
          "Matte",
          "Mono",
        ], "None"),
      ),
      manual(select("crop", "Crop", ["Original", "1:1", "4:3", "3:2", "16:9"], "Original")),
      manual({ ...range("straighten", "Straighten", 0, "°"), min: -15, max: 15, step: 0.5 }),
      manual(toggle("flip-h", "Flip horizontal", false)),
      manual(toggle("flip-v", "Flip vertical", false)),
    ],
  },
  {
    id: "perspective-correction",
    name: "Perspective Correction",
    category: "Image Enhancement",
    reference: false,
    improve: false,
    prompt: "Describe the correction",
    action: "Correct perspective",
    controls: [
      select(
        "mode",
        "Correction mode",
        ["Fix distortion", "Camera angle"],
        "Fix distortion",
      ),
      {
        ...range("vertical", "Vertical", 0), min: -100, max: 100, step: 5,
        when: { id: "mode", values: ["Fix distortion"] },
      },
      {
        ...range("horizontal", "Horizontal", 0), min: -100, max: 100, step: 5,
        when: { id: "mode", values: ["Fix distortion"] },
      },
      action("suggest", "Suggest a correction"),
      {
        ...select(
          "angle",
          "Camera angle",
          ["Eye level", "Low", "High", "Straight on"],
          "Eye level",
        ),
        when: { id: "mode", values: ["Camera angle"] },
      },
      toggle("guides", "Show guides", true),
    ],
  },
  {
    id: "decor-redefinition",
    name: "Decor Re-definition",
    category: "Interior Design",
    prompt: "Describe the decor you want",
    action: "Redefine decor",
    comparison: ["Today", "Restyled"],
    controls: [
      select(
        "decor",
        "Decor style",
        [
          "Warm minimal",
          "Gallery",
          "Layered textile",
          "Mid-century",
          "Coastal",
          "Monochrome",
        ],
        "Warm minimal",
      ),
      ratio,
      action("pick", "Spot · Pick"),
      action("place", "Place decor"),
      action("decor-assets", "Choose from your decor assets"),
      familyLayout,
    ],
  },
  {
    id: "material-refinement",
    name: "Material Refinement",
    category: "Interior Design",
    prompt: "Describe the material change",
    action: "Refine materials",
    comparison: ["Today", "Refined"],
    controls: [
      palette,
      action("surfaces", "Surfaces · Pick"),
      familyLayout,
    ],
  },
  {
    id: "lighting-reimagination",
    name: "Lighting Reimagination",
    category: "Interior Design",
    prompt: "Describe the lighting you want",
    action: "Relight the room",
    comparison: ["Today", "Evening"],
    controls: [
      room,
      { ...range("temperature", "Colour temperature", 2700, "K"), min: 2200, max: 5000, step: 100 },
      { ...range("brightness", "Brightness", 60, "%"), min: 10, step: 5 },
      select(
        "layer",
        "Layering",
        ["Ambient only", "Ambient + task", "Fully layered"],
        "Ambient only",
      ),
      toggle("preview", "Preview on my photo", true),
      select(
        "fixture",
        "Fixture",
        [
          "Keep existing",
          "Pendant",
          "Recessed",
          "Track",
          "Sconce",
          "Floor lamp",
          "Statement",
        ],
        "Keep existing",
      ),
      action("lights", "Place a light"),
      action("lighting-assets", "Choose from your lighting assets"),
    ],
  },
  {
    id: "garden-design",
    name: "Garden Design",
    category: "Exterior & Landscape",
    prompt: "Describe the garden you want",
    action: "Design the garden",
    comparison: ["Today", "Redesigned"],
    controls: [
      { ...outside, defaultValue: "Naturalistic" },
      select(
        "scope",
        "Garden area",
        ["Whole garden", "Borders", "Lawn", "Terrace", "Front"],
        "Whole garden",
      ),
      toggle("tidy", "Just tidy it up", false),
      ...tidy,
      action("suggest", "AI suggestions · Show"),
      action("area", "Analyze an area · Select"),
    ],
  },
  {
    id: "pool-redesign",
    name: "Spa & Pool Redesign",
    category: "Exterior & Landscape",
    prompt: "Describe the pool, spa, or pool and spa",
    action: "Design the pool",
    comparison: ["Today", "Natural pool"],
    controls: [
      select("mode", "Design", ["Pool", "Spa", "Pool + Spa"], "Pool"),
      {
        ...select(
          "pool",
          "Pool type",
          ["Infinity", "Lap", "Plunge", "Natural", "Courtyard"],
          "Infinity",
        ),
        when: { id: "mode", values: ["Pool", "Pool + Spa"] },
      },
      ...["Contemporary", "In-ground", "Rectangular", "Tile"].map((x, i) => ({
        ...select(
          "pool-option-" + i,
          ["Pool style", "Installation", "Shape", "Material"][i],
          [
            [x, "Natural", "Resort", "Classic"],
            [x, "Raised", "Partially raised"],
            [x, "L-shape", "Freeform", "Circular"],
            [x, "Plaster", "Pebble", "Stone"],
          ][i],
          x,
        ),
        when: { id: "mode", values: ["Pool", "Pool + Spa"] },
      })),
      ...["Hot tub (above ground)", "Round", "Tile"].map((x, i) => ({
        ...select(
          "spa-option-" + i,
          ["Spa type", "Spa shape", "Spa material"][i],
          [
            [x, "In-ground spa", "Plunge pool/cold plunge"],
            [x, "Square", "Rectangular", "Freeform"],
            [x, "Stone", "Concrete-plaster", "Acrylic", "Wood surround"],
          ][i],
          x,
        ),
        when: { id: "mode", values: ["Spa", "Pool + Spa"] },
      })),
      {
        ...select(
          "placement",
          "Combined placement",
          ["Attached/spillover", "Next to the pool", "Separate area"],
          "Attached/spillover",
        ),
        when: { id: "mode", values: ["Pool + Spa"] },
      },
      ...[
        "Built-in seating",
        "Jets",
        "Waterfall/water feature",
        "Underwater lighting",
        "Deck/surround",
      ].map((x, i) => ({ ...toggle("feature-" + i, x, false), when: { id: "mode", values: ["Spa", "Pool + Spa"] } })),
    ],
  },
  {
    id: "sky-transformation",
    name: "Sky Transformation",
    category: "Exterior & Landscape",
    prompt: "Describe the sky",
    action: "Change the sky",
    comparison: ["Today", "Golden hour · preview"],
    controls: [
      toggle("preview", "Preview on my photo", true),
      select(
        "time",
        "Time of day",
        ["Morning", "Midday", "Golden hour", "Blue hour", "Night"],
        "Morning",
      ),
      select(
        "weather",
        "Weather",
        ["Clear", "Overcast", "Hazy", "Rain", "Snow"],
        "Clear",
      ),
      range("clouds", "Cloud intensity", 45, "%"),
      range("saturation", "Sky saturation", 50, "%"),
    ],
  },
  {
    id: "seasonal-transformation",
    name: "Seasonal Transformation",
    category: "Exterior & Landscape",
    prompt: "Describe the season",
    action: "Show it in spring",
    comparison: ["Today", "Autumn · preview"],
    controls: [
      select(
        "time",
        "Time of day",
        [
          "As photographed",
          "Morning",
          "Midday",
          "Golden hour",
          "Blue hour",
          "Night",
        ],
        "As photographed",
      ),
      season,
      toggle("preview", "Preview on my photo", true),
      {
        ...select(
          "snow",
          "Snow",
          ["None", "Frost", "Light snow", "Heavy snow"],
          "None",
        ),
        when: { id: "season", values: ["Winter"] },
      },
      select(
        "people",
        "People",
        ["Keep existing", "None", "A few", "Busy"],
        "Keep existing",
      ),
      select(
        "vehicles",
        "Vehicles",
        ["Keep existing", "None", "Parked", "Passing"],
        "Keep existing",
      ),
    ],
  },
  {
    id: "object-placement",
    name: "Object Placement",
    category: "Exterior & Landscape",
    reference: false,
    prompt: "Describe how the objects should sit",
    action: "Place the object",
    controls: [
      action("objects", "Required objects · Choose from your objects"),
      action("place", "Place"),
      unknown("pins", "Numbered location pins"),
    ],
  },
];
export const tools: readonly ToolDefinition[] = seeds.map((s) => ({
  framing:
    s.category === "Exterior & Landscape"
      ? "Wide daylight exterior photo"
      : "Room photo",
  reference: true,
  improve: true,
  ...([
    "decor-redefinition",
    "material-refinement",
    "lighting-reimagination",
  ].includes(s.id)
    ? { framing: "Straight-on room photo" }
    : {}),
  ...s,
  route: "/app/tools/" + s.id,
  configVersion: 1,
}));
export function findTool(id: string) {
  return tools.find((t) => t.id === id);
}
export function visibleControls(
  tool: ToolDefinition,
  values: Record<string, string | number | boolean>,
) {
  return tool.controls
    .filter(
      (c) =>
        !c.when ||
        c.when.values.includes(
          String(
            values[c.when.id] ??
              tool.controls.find((x) => x.id === c.when?.id)?.defaultValue ??
              "",
          ),
        ),
    )
    .map((c) => typeof values[c.id] === "string" && c.legacyOptions?.includes(String(values[c.id]))
      ? { ...c, options: [...(c.options ?? []), String(values[c.id])] }
      : c)
    .map((c) =>
      tool.id === "pool-redesign" &&
      c.id === "spa-option-0" &&
      values.mode === "Pool + Spa"
        ? { ...c, options: [...(c.options ?? []).slice(0, 2), "Spillover spa", ...(c.options ?? []).slice(2)] }
        : c,
    );
}
export function primaryAction(
  tool: ToolDefinition,
  values: Record<string, string | number | boolean>,
) {
  if (tool.id === "garden-design" && values.tidy === true)
    return "Tidy the garden";
  if (tool.id === "resolution-enhancement" && values.mode === "Manual controls")
    return "Apply adjustments";
  if (tool.id === "pool-redesign")
    return values.mode === "Spa"
      ? "Design the spa"
      : values.mode === "Pool + Spa"
        ? "Design the pool and spa"
        : tool.action;
  if (tool.id === "seasonal-styling")
    return "Style for " + String(values.season ?? "Spring").toLowerCase();
  if (tool.id === "seasonal-transformation")
    return "Show it in " + String(values.season ?? "Spring").toLowerCase();
  return tool.action;
}
