import sharp from 'sharp';

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function truncate(s: string, max: number): string {
  return s.length <= max ? s : s.slice(0, max - 1) + '…';
}

function wrapTitle(title: string): { lines: string[]; fontSize: number } {
  let fontSize: number;
  let charsPerLine: number;

  if (title.length <= 22) {
    fontSize = 62; charsPerLine = 22;
  } else if (title.length <= 40) {
    fontSize = 50; charsPerLine = 28;
  } else {
    fontSize = 38; charsPerLine = 36;
  }

  if (title.length <= charsPerLine) return { lines: [title], fontSize };

  let breakAt = title.lastIndexOf(' ', charsPerLine);
  if (breakAt <= 0) breakAt = charsPerLine;

  const line1 = title.slice(0, breakAt).trim();
  let line2 = title.slice(breakAt).trim();
  if (line2.length > charsPerLine) line2 = line2.slice(0, charsPerLine - 1) + '…';

  return { lines: [line1, line2], fontSize };
}

export interface OgOptions {
  title: string;
  description: string;
  badge: string;
  categoryColor: string;
}

export async function generateOgImage(opts: OgOptions): Promise<Buffer> {
  const { title, description, badge, categoryColor } = opts;
  const { lines, fontSize } = wrapTitle(title);
  const lineHeight = Math.round(fontSize * 1.25);
  const titleStartY = lines.length === 1 ? 300 : 258;
  const descY = titleStartY + lines.length * lineHeight + 32;
  const desc = truncate(description, 88);
  const badgeW = badge.length * 10 + 28;

  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0d0b14"/>
      <stop offset="100%" stop-color="#130d24"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1150" cy="-30" r="340" fill="none" stroke="${categoryColor}" stroke-width="1" opacity="0.12"/>
  <circle cx="1150" cy="-30" r="220" fill="none" stroke="${categoryColor}" stroke-width="1" opacity="0.08"/>
  <rect x="0" y="0" width="6" height="630" fill="${categoryColor}"/>
  <rect x="80" y="116" width="${badgeW}" height="30" rx="4" fill="${categoryColor}" opacity="0.18"/>
  <text x="94" y="137" font-family="monospace" font-size="15" font-weight="bold" fill="${categoryColor}">${esc(badge)}</text>
  ${lines.map((line, i) => `<text x="80" y="${titleStartY + i * lineHeight}" font-family="monospace" font-size="${fontSize}" font-weight="bold" fill="#e2e8f0">${esc(line)}</text>`).join('\n  ')}
  <text x="80" y="${descY}" font-family="monospace" font-size="21" fill="#6b7280">${esc(desc)}</text>
  <text x="80" y="582" font-family="monospace" font-size="19" fill="#3b3554">dgovalen.cl</text>
  <text x="1120" y="582" font-family="monospace" font-size="17" fill="#4b4468" text-anchor="end">Diego Valencia · @pirrandi</text>
</svg>`;

  return sharp(Buffer.from(svg)).png().toBuffer();
}
