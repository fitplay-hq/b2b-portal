import chromium from "@sparticuz/chromium";
import { put } from "@vercel/blob";
import { readFileSync } from "fs";
import { execSync } from "child_process";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = dirname(__dirname);
const publicDir = join(projectRoot, "public");
const tarPath = join(publicDir, "chromium-pack.tar");

async function main() {
  console.log("📦 Building Chromium pack…");

  const chromiumResolved = import.meta.resolve("@sparticuz/chromium");
  const chromiumPath = chromiumResolved.replace(/^file:\/\//, "");
  const chromiumDir = dirname(dirname(dirname(chromiumPath)));
  const binDir = join(chromiumDir, "bin");

  if (!existsSync(binDir)) {
    throw new Error("Chromium bin directory not found");
  }

  execSync(`mkdir -p ${publicDir} && tar -cf "${tarPath}" -C "${binDir}" .`, {
    stdio: "inherit",
  });

  console.log("☁️ Uploading to Vercel Blob…");

  const buffer = readFileSync(tarPath);

  const blob = await put("chromium-pack.tar", buffer, {
    access: "public",
    allowOverwrite: true,
    contentType: "application/x-tar",
  });

  console.log("✅ Uploaded Chromium:");
  console.log(blob.url);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
