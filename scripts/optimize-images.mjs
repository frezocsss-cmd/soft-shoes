/**
 * Rasmlarni optimallashtirish:
 *  - har bir rasm uchun bir necha kenglikda .webp variant
 *  - 16px kichik blur placeholder (base64 data URI)
 *  - natijani src/generated/images.js manifest fayliga yozadi
 *
 * Ishga tushirish:  node scripts/optimize-images.mjs
 */
import { readdir, mkdir, writeFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DIR = path.join(root, "src", "assets");
const OUT_DIR = path.join(root, "src", "generated", "images");
const MANIFEST = path.join(root, "src", "generated", "images.js");

const WIDTHS = [240, 400, 640, 900, 1200];
const PLACEHOLDER_WIDTH = 20;
const QUALITY = { small: 62, large: 74 };

const toBaseName = (file) => path.basename(file).replace(/\.[^.]+$/, "");

const formatBytes = (bytes) => `${(bytes / 1024).toFixed(1)} kB`;

const buildPlaceholder = async (input) => {
  const buffer = await sharp(input)
    .resize({ width: PLACEHOLDER_WIDTH, withoutEnlargement: true })
    .blur(1.2)
    .webp({ quality: 32, alphaQuality: 60 })
    .toBuffer();
  return `data:image/webp;base64,${buffer.toString("base64")}`;
};

const optimizeOne = async (file) => {
  const input = path.join(SRC_DIR, file);
  const name = toBaseName(file);
  const meta = await sharp(input).metadata();
  const originalWidth = meta.width ?? 1200;
  const originalHeight = meta.height ?? 1600;

  const widths = WIDTHS.filter((w) => w < originalWidth);
  if (!widths.includes(Math.min(WIDTHS[WIDTHS.length - 1], originalWidth))) {
    widths.push(Math.min(WIDTHS[WIDTHS.length - 1], originalWidth));
  }

  const sources = [];
  for (const width of [...new Set(widths)].sort((a, b) => a - b)) {
    const fileName = `${name}-${width}.webp`;
    const outPath = path.join(OUT_DIR, fileName);
    const info = await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: width <= 400 ? QUALITY.small : QUALITY.large, effort: 5 })
      .toFile(outPath);
    sources.push({ w: info.width, url: `/src/generated/images/${fileName}`, bytes: info.size });
  }

  const fallbackWidth = Math.min(WIDTHS[WIDTHS.length - 1], originalWidth);
  const fallback = sources.find((s) => s.w === fallbackWidth) ?? sources[sources.length - 1];

  return {
    name,
    width: originalWidth,
    height: originalHeight,
    ratio: Number((originalWidth / originalHeight).toFixed(4)),
    sources,
    src: fallback.url,
    placeholder: await buildPlaceholder(input),
  };
};

const main = async () => {
  if (!existsSync(SRC_DIR)) {
    console.error("src/assets papkasi topilmadi");
    process.exit(1);
  }

  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  const files = (await readdir(SRC_DIR)).filter((file) => /\.(jpe?g|png)$/i.test(file));
  const entries = [];

  for (const file of files) {
    const entry = await optimizeOne(file);
    entries.push(entry);
    const total = entry.sources.reduce((sum, source) => sum + source.bytes, 0);
    console.log(
      `${file} → ${entry.sources.length} webp variant, jami ${formatBytes(total)} (original ${formatBytes(
        (await sharp(path.join(SRC_DIR, file)).toBuffer()).length,
      )})`,
    );
  }

  const body = entries
    .map(
      (entry) => `  ${JSON.stringify(entry.name)}: {
    file: ${JSON.stringify(entry.name)},
    widths: ${JSON.stringify(entry.sources.map((s) => s.w))},
    width: ${entry.width},
    height: ${entry.height},
    ratio: ${entry.ratio},
    placeholder: ${JSON.stringify(entry.placeholder)},
  },`,
    )
    .join("\n");

  const file = `/* eslint-disable */
// AVTOMATIK: scripts/optimize-images.mjs tomonidan yaratilgan.
// Qo'lda tahrirlash shart emas.
//
// Faqat metama'lumot: URL'lar src/lib/images.js orqali
// import.meta.glob bilan build paytida yechiladi (hash qo'shiladi).

export const optimizedImages = {
${body}
};
`;

  await writeFile(MANIFEST, file, "utf8");
  console.log(`\nManifest yozildi: ${path.relative(root, MANIFEST)}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
