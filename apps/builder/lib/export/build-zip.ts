import JSZip from "jszip";
import { VirtualFileTree } from "@zalo-builder/generator";

/**
 * Builds a JSZip Blob from a VirtualFileTree.
 * Works 100% in browser or Node test environments.
 */
export async function buildZip(tree: VirtualFileTree): Promise<Blob> {
  const zip = new JSZip();

  for (const file of tree) {
    if (typeof file.content === "string") {
      zip.file(file.path, file.content);
    } else {
      zip.file(file.path, file.content);
    }
  }

  const blob = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: {
      level: 6,
    },
  });

  return blob;
}
