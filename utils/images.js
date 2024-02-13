import { join } from "https://deno.land/std@0.208.0/path/mod.ts";
import { emptyDir } from "https://deno.land/std@0.196.0/fs/empty_dir.ts";

const DEST_DIR = "./dist";

const imgDir = join(DEST_DIR, "img");
await emptyDir(imgDir);

const issues = JSON.parse(
  await Deno.readTextFile(join(DEST_DIR, "index.json")),
);

// get images
for (const issue of issues) {
  await genImage(
    `https://news.web3privacy.info/image/${issue.week}?${new Date().valueOf()}`,
    join(imgDir, `${issue.week}.png`),
  );
}

// make cover
await genImage(
  `https://news.web3privacy.info/cover`,
  join(imgDir, "cover.png"),
);

console.log("Done");

async function genImage(url, fn) {
  const imgResp = await fetch("https://html2svg.gwei.cz", {
    method: "POST",
    body: JSON.stringify({
      url,
      format: "png",
      width: 1920,
      height: 960,
    }),
  });

  if (imgResp.body) {
    const file = await Deno.open(fn, { write: true, create: true });
    await imgResp.body.pipeTo(file.writable);

    console.log(`Image written: ${fn}`);
  }
}
