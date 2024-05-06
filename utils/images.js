import { join } from "https://deno.land/std@0.208.0/path/mod.ts";
import { ensureDir } from "https://deno.land/std@0.224.0/fs/ensure_dir.ts";
import { existsSync } from "https://deno.land/std@0.224.0/fs/exists.ts";

const DATA_DIR = "./data";

const imgDir = "./web/public/img";
await ensureDir(imgDir);


// get images
for (const { name: year } of Deno.readDirSync(DATA_DIR)) {
  for (const { name: fn } of Deno.readDirSync(join(DATA_DIR, year))) {
    const week = fn.match(/^week(\d+)/)?.[1];
    if (!week) continue;
    const yearWeek = `${year}-${week}`;
    const imgn = `https://news.web3privacy.info/image/${yearWeek}?${new Date().valueOf()}`;
    const outputFn = join(imgDir, `${yearWeek}.png`);
    if (existsSync(outputFn)) continue;
    console.log('Processing:', imgn);
    await genImage(imgn, outputFn);
  }
}

// make cover
const coverFn = join(imgDir, "cover.png");
if (!existsSync(coverFn)) {
  await genImage(`https://news.web3privacy.info/cover`, coverFn);
}

console.log("Done");

// ---------

async function genImage(url, fn) {
  const imgResp = await fetch("https://html2svg.gwei.cz", {
    method: "POST",
    body: JSON.stringify({
      url,
      format: "png",
      width: 1920,
      height: 960,
    }),
    headers: {
      "content-type": "application/json",
    }
  });

  if (imgResp.body) {
    const file = await Deno.open(fn, { write: true, create: true });
    await imgResp.body.pipeTo(file.writable);

    console.log(`Image written: ${fn}`);
  }
}
