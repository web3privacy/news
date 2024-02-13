import { join } from "https://deno.land/std@0.208.0/path/mod.ts";
import { emptyDir } from "https://deno.land/std@0.196.0/fs/empty_dir.ts";
import { addDays, format, nextMonday, setWeek } from "npm:date-fns";
import { marked } from "npm:marked";
import matter from "npm:front-matter";

const SRC_DIR = "./data";
const DEST_DIR = "./dist";

async function build() {
  let issues = [];
  for await (const dirEntry of Deno.readDir(SRC_DIR)) {
    if (!dirEntry.isDirectory || !dirEntry.name.match(/^\d{4}$/)) {
      continue;
    }
    //const [fn, ext] = dirEntry.name.split(".");
    const year = dirEntry.name;
    const yearDir = join(SRC_DIR, year);
    console.log(`Processing year: ${year}`);
    for await (const dirEntry of Deno.readDir(yearDir)) {
      const [fn, ext] = dirEntry.name.split(".");
      const weekMatch = fn.match(/^week(\d{2})$/);
      if (!weekMatch || ext !== "md") {
        continue;
      }
      const week = weekMatch[1];
      const mdPath = join(SRC_DIR, year, dirEntry.name);
      const source = await Deno.readTextFile(mdPath);

      const issue = {
        week: `${year}-${week}`,
        period: calcPeriod(year, week),
      };

      await renderData(issue, source);
      issues.push(issue);
    }
  }

  await emptyDir(DEST_DIR);

  const outputFn = join(DEST_DIR, "index.json");
  await writeJSONFile(outputFn, issues);
}

async function renderData(issue, source) {
  const fm = matter(source);

  const parsed = marked.parse(fm.body);
  return Object.assign(issue, fm.attributes, {
    newsMd: fm.body,
    newsHtml: parsed,
  });

  //const fm = matter(issue.source)
  //console.log(fm)
  //console.log(parsed)
  //return
}

function calcPeriod(year, week) {
  const weekStart = setWeek(
    nextMonday(new Date(Number(year), 0, 4)),
    Number(week),
    {
      weekStartsOn: 1,
      firstWeekContainsDate: 4,
    },
  );
  const weekEnd = addDays(weekStart, 6);

  return [weekStart, weekEnd];
}

async function writeJSONFile(fn, data) {
  console.log(`File written: ${fn}`);
  return Deno.writeTextFile(fn, JSON.stringify(data, null, 2));
}

build();
