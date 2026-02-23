/**
 * Downloads doctor placeholder images to data/images.
 * Run from project root: node backend/data/createDoctorImages.js
 */
import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, "images");

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "Node" } }, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
    }).on("error", reject);
  });
}

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const files = [
  { file: "male-doctor.png", url: "https://placehold.co/300x300/1e40af/white?text=Doctor" },
  { file: "female-doctor.png", url: "https://placehold.co/300x300/831843/white?text=Doctor" },
];

async function main() {
  for (const { file, url } of files) {
    try {
      const buf = await download(url);
      fs.writeFileSync(path.join(imagesDir, file), buf);
      console.log("Created:", file);
    } catch (err) {
      console.error("Failed", file, err.message);
    }
  }
  console.log("Doctor images saved to backend/data/images");
}

main();
