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
  // Skip if BLOB_READ_WRITE_TOKEN is not configured
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.log("⏭️  Skipping Chromium upload (BLOB_READ_WRITE_TOKEN not configured)");
    console.log("   This is fine for local development or if Chromium is already uploaded.");
    return;
  }

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
  console.error("❌ Error:", err.message);
  // Don't exit with error code if BLOB_READ_WRITE_TOKEN is not configured
  if (err.message && err.message.includes("No token found")) {
    console.log("⏭️  Skipping Chromium upload - token not configured");
    process.exit(0);
  }
  process.exit(1);
});
