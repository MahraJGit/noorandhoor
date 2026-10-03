import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "app", "fonts");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const families = [
  {
    name: "montserrat",
    css: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap",
    mode: "variable",
  },
  {
    name: "abhaya-libre",
    css: "https://fonts.googleapis.com/css2?family=Abhaya+Libre:wght@400;500;600;700;800&display=swap",
    mode: "static",
    weights: ["400", "500", "600", "700", "800"],
  },
  {
    name: "cinzel",
    css: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800&display=swap",
    mode: "variable",
  },
  {
    name: "josefin-sans",
    css: "https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600;700&display=swap",
    mode: "variable",
  },
];

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": UA } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetchText(res.headers.location).then(resolve, reject);
        }
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          if (res.statusCode !== 200) reject(new Error(`${url} -> ${res.statusCode}`));
          else resolve(data);
        });
      })
      .on("error", reject);
  });
}

function fetchBin(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": UA } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetchBin(res.headers.location).then(resolve, reject);
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          if (res.statusCode !== 200) reject(new Error(`${url} -> ${res.statusCode}`));
          else resolve(Buffer.concat(chunks));
        });
      })
      .on("error", reject);
  });
}

fs.mkdirSync(outDir, { recursive: true });

for (const family of families) {
  const css = await fetchText(family.css);
  const blocks = css.split("/* ").slice(1);
  const written = new Set();

  for (const block of blocks) {
    const commentEnd = block.indexOf("*/");
    const label = block.slice(0, commentEnd).trim();
    if (label !== "latin") continue;

    const body = block.slice(commentEnd + 2);
    const urlMatch = body.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/);
    const weightMatch = body.match(/font-weight:\s*(\d+)/);
    if (!urlMatch || !weightMatch) continue;

    const weight = weightMatch[1];
    const fileName =
      family.mode === "variable"
        ? `${family.name}.woff2`
        : `${family.name}-${weight}.woff2`;

    if (family.mode === "static" && !family.weights.includes(weight)) continue;
    if (written.has(fileName)) continue;

    const file = path.join(outDir, fileName);
    const bin = await fetchBin(urlMatch[1]);
    fs.writeFileSync(file, bin);
    written.add(fileName);
    console.log("wrote", fileName, bin.length);
  }
}
