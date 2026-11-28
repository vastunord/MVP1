// Preserve a Studio location through sign-in. Ignore external URLs, API routes,
// nested URLs and arbitrary query values (including credentials).
const studioLocation = /^\/app(?:\/(?:[a-z0-9-]+|(?:projects|studies|tools|editor|settings)\/[A-Za-z0-9_-]{1,100}))?(?:\?(?:album|sample)=[A-Za-z0-9_-]{1,100})?(?:#source-image)?$/;

export function studioReturn(value: unknown): string | null {
  return typeof value === "string" && value.length <= 255 && studioLocation.test(value) && !/\s/.test(value)
    ? value : null;
}

export function studioAuthQuery(roomUpload: boolean, destination: unknown): string {
  if (roomUpload) return "intent=room-upload";
  const target = studioReturn(destination);
  return target && target !== "/app" ? new URLSearchParams({ returnTo: target }).toString() : "";
}
