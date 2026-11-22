// Accept a complete MP4 with a video track; reject HTML, audio-only and truncated responses.
export function isStudioMp4(bytes: Buffer) {
  let fileType = false,
    video = false,
    payload = false;
  function inspect(start: number, end: number, depth: number): boolean {
    let offset = start;
    while (offset < end) {
      if (end - offset < 8) return false;
      const type = bytes.toString("ascii", offset + 4, offset + 8);
      let size = bytes.readUInt32BE(offset),
        header = 8;
      if (size === 1) {
        if (end - offset < 16) return false;
        const extended = bytes.readBigUInt64BE(offset + 8);
        if (extended > BigInt(end - offset)) return false;
        size = Number(extended);
        header = 16;
      } else if (size === 0) size = end - offset;
      if (size < header || offset + size > end) return false;
      const body = offset + header;
      if (depth === 0 && type === "ftyp" && size >= header + 8) fileType = true;
      if (depth === 0 && type === "mdat" && size > header) payload = true;
      if (
        depth === 3 &&
        type === "hdlr" &&
        size >= header + 12 &&
        bytes.toString("ascii", body + 8, body + 12) === "vide"
      )
        video = true;
      const path = ["moov", "trak", "mdia"];
      if (
        depth < path.length &&
        type === path[depth] &&
        !inspect(body, offset + size, depth + 1)
      )
        return false;
      offset += size;
    }
    return true;
  }
  return inspect(0, bytes.length, 0) && fileType && video && payload;
}
