export const publicationChannels = ["GALLERY", "PINTEREST", "YOUTUBE"] as const;
export type PublicationChannel = (typeof publicationChannels)[number];
export const sharingPolicy = "vn-publication-v1";

export type SharingVersion = {
  id: string;
  version: number;
  current: boolean;
  mimeType: string;
  createdAt: string;
  grants: PublicationChannel[];
};

export function permittedChannels(mime: string): PublicationChannel[] {
  if (mime === "video/mp4") return [...publicationChannels];
  if (["image/jpeg", "image/png", "image/webp"].includes(mime))
    return ["GALLERY", "PINTEREST"];
  return [];
}
