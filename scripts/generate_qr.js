import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load demo data
const dataPath = path.join(__dirname, "../src/data/demo_scenarios.json");
const scenarios = JSON.parse(fs.readFileSync(dataPath, "utf8"));

const outputDir = path.join(__dirname, "../qr_codes");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

console.log("Generating QR Codes for scenarios...");

scenarios.forEach(async (scenario) => {
  const fileName = `qr_${scenario.id}.png`;
  const filePath = path.join(outputDir, fileName);

  // We stringify the 'data' part of the scenario
  const qrContent = JSON.stringify(scenario.data);

  try {
    await QRCode.toFile(filePath, qrContent, {
      errorCorrectionLevel: "M",
      width: 400,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
    console.log(`✅ Created ${fileName}`);
  } catch (err) {
    console.error(`❌ Error creating ${fileName}:`, err);
  }
});

console.log(`\nDone! QR codes are saved in: ${outputDir}`);
console.log(
  "You can scan these with the app (if you implement a real camera scanner) or just copy the JSON content."
);
