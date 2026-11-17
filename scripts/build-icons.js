const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { spawnSync } = require('child_process');

const root = path.join(__dirname, '..');
const iconDir = path.join(root, 'public', 'icons');
fs.mkdirSync(iconDir, { recursive: true });

const CRC = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

function png(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function plot(rgba, size, x, y, red, green, blue, alpha) {
  if (x < 0 || y < 0 || x >= size || y >= size) return;
  const i = (y * size + x) * 4;
  const source = alpha / 255;
  const dest = rgba[i + 3] / 255;
  const out = source + dest * (1 - source);
  if (!out) return;
  rgba[i] = Math.round((red * source + rgba[i] * dest * (1 - source)) / out);
  rgba[i + 1] = Math.round((green * source + rgba[i + 1] * dest * (1 - source)) / out);
  rgba[i + 2] = Math.round((blue * source + rgba[i + 2] * dest * (1 - source)) / out);
  rgba[i + 3] = Math.round(out * 255);
}

function stroke(rgba, size, x0, y0, x1, y1, width) {
  const minX = Math.floor(Math.min(x0, x1) - width);
  const maxX = Math.ceil(Math.max(x0, x1) + width);
  const minY = Math.floor(Math.min(y0, y1) - width);
  const maxY = Math.ceil(Math.max(y0, y1) + width);
  const dx = x1 - x0;
  const dy = y1 - y0;
  const length = dx * dx + dy * dy || 1;
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      let t = ((x + 0.5 - x0) * dx + (y + 0.5 - y0) * dy) / length;
      t = Math.max(0, Math.min(1, t));
      const distance = Math.hypot(x + 0.5 - (x0 + t * dx), y + 0.5 - (y0 + t * dy));
      const half = width / 2;
      if (distance <= half - 0.4) plot(rgba, size, x, y, 243, 250, 247, 255);
      else if (distance < half + 0.6) {
        plot(rgba, size, x, y, 243, 250, 247, Math.max(0, Math.min(255, (half + 0.6 - distance) * 255)));
      }
    }
  }
}

function drawMark(size) {
  const rgba = Buffer.alloc(size * size * 4, 0);
  for (let i = 0; i < rgba.length; i += 4) {
    rgba[i] = 12;
    rgba[i + 1] = 74;
    rgba[i + 2] = 62;
    rgba[i + 3] = 255;
  }
  const scale = size / 48;
  const segments = [
    [8, 16, 16, 16, 2],
    [16, 16, 16, 8, 2],
    [32, 8, 40, 8, 2],
    [40, 8, 40, 16, 2],
    [40, 32, 40, 40, 2],
    [40, 40, 32, 40, 2],
    [16, 40, 8, 40, 2],
    [8, 40, 8, 32, 2],
    [24, 14, 24, 34, 1.6],
    [14, 24, 34, 24, 1.6],
  ];
  for (const [x0, y0, x1, y1, width] of segments) {
    stroke(rgba, size, x0 * scale, y0 * scale, x1 * scale, y1 * scale, width * scale);
  }
  return png(size, size, rgba);
}

function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const directory = Buffer.alloc(16 * images.length);
  let offset = 6 + directory.length;
  const parts = [header, directory];
  images.forEach((image, index) => {
    const at = index * 16;
    directory[at] = image.size >= 256 ? 0 : image.size;
    directory[at + 1] = image.size >= 256 ? 0 : image.size;
    directory.writeUInt16LE(1, at + 4);
    directory.writeUInt16LE(32, at + 6);
    directory.writeUInt32LE(image.png.length, at + 8);
    directory.writeUInt32LE(offset, at + 12);
    offset += image.png.length;
    parts.push(image.png);
  });
  return Buffer.concat(parts);
}

const sizes = [48, 96, 192, 512];
const pngs = sizes.map((size) => ({ size, png: drawMark(size) }));
for (const image of pngs) {
  fs.writeFileSync(path.join(iconDir, `icon-${image.size}.png`), image.png);
}
fs.writeFileSync(path.join(iconDir, 'apple-touch-icon.png'), drawMark(180));
fs.writeFileSync(
  path.join(root, 'public', 'favicon.ico'),
  ico([
    { size: 16, png: drawMark(16) },
    { size: 32, png: drawMark(32) },
    { size: 48, png: pngs[0].png },
  ])
);

const ogScript = `
Add-Type -AssemblyName System.Drawing
$path = '${path.join(root, 'public', 'images', 'og.png').replace(/'/g, "''")}'
$bmp = New-Object System.Drawing.Bitmap 1200, 630
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.Clear([System.Drawing.Color]::FromArgb(231, 238, 233))
$green = [System.Drawing.Color]::FromArgb(12, 74, 62)
$ink = [System.Drawing.Color]::FromArgb(28, 46, 40)
$paper = [System.Drawing.Color]::FromArgb(243, 246, 244)
$white = [System.Drawing.Color]::FromArgb(243, 250, 247)
$greenBrush = New-Object System.Drawing.SolidBrush $green
$inkBrush = New-Object System.Drawing.SolidBrush $ink
$g.FillRectangle($greenBrush, 0, 0, 1200, 18)
$g.FillRectangle($greenBrush, 72, 64, 88, 88)
$pen = New-Object System.Drawing.Pen $white, 3
$g.DrawLine($pen, 86, 92, 102, 92)
$g.DrawLine($pen, 102, 92, 102, 76)
$g.DrawLine($pen, 130, 76, 146, 76)
$g.DrawLine($pen, 146, 76, 146, 92)
$g.DrawLine($pen, 146, 124, 146, 140)
$g.DrawLine($pen, 146, 140, 130, 140)
$g.DrawLine($pen, 102, 140, 86, 140)
$g.DrawLine($pen, 86, 140, 86, 124)
$g.DrawLine($pen, 116, 90, 116, 126)
$g.DrawLine($pen, 98, 108, 134, 108)
$brand = New-Object System.Drawing.Font 'Segoe UI', 26
$title = New-Object System.Drawing.Font 'Segoe UI', 46, ([System.Drawing.FontStyle]::Bold)
$note = New-Object System.Drawing.Font 'Segoe UI', 20
$g.DrawString('pontosfelmérés', $brand, $greenBrush, 180, 86)
$g.DrawString("Épületfelmérés\`r\`na tervezéshez", $title, $inkBrush, 68, 190)
$g.DrawString('Pontfelhő, alaprajz vagy metszet', $note, $greenBrush, 72, 430)
$g.FillRectangle((New-Object System.Drawing.SolidBrush $paper), 700, 110, 420, 410)
$plan = New-Object System.Drawing.Pen $green, 4
$g.DrawRectangle($plan, 760, 180, 300, 250)
$g.DrawLine($plan, 910, 180, 910, 310)
$g.DrawLine($plan, 760, 310, 1060, 310)
$bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
`;
const encoded = Buffer.from(ogScript, 'utf16le').toString('base64');
const result = spawnSync('powershell', ['-NoProfile', '-EncodedCommand', encoded], { stdio: 'inherit' });
if (result.status !== 0) process.exit(result.status || 1);
