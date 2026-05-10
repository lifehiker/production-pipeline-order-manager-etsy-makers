import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { randomUUID } from "node:crypto";

export async function saveUploadedFile(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const extension = file.name.includes(".")
    ? file.name.split(".").pop()
    : "bin";
  const filename = `${randomUUID()}.${extension}`;
  const outputDir = path.join(process.cwd(), "public", "uploads");
  const outputPath = path.join(outputDir, filename);

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, buffer);

  return `/uploads/${filename}`;
}
