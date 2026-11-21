export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
// Leave room for the multipart envelope under the Vercel request-body limit.
export const MAX_IMAGE_MIB = 4;
export const MAX_IMAGE_BYTES = MAX_IMAGE_MIB * 1024 * 1024;
