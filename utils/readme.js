import { setWeek, nextMonday, format, addDays } from 'npm:date-fns';

const issues = JSON.parse(await Deno.readTextFile('./dist/index.json'))

const lines = []

lines.push('| Week | Period | Deadline | Curator |')
lines.push('| --- | --- | --- | --- |')

for (const issue of issues) {
    const [ year, week ] = issue.week.split('-')
    const props = [
        `[${issue.week}](/data/${year}/week${week}.md)`,
        `${format(new Date(issue.period[0]), "MMM d")} - ${format(new Date(issue.period[1]), "MMM d")}`,
        issue.published ? `✅ [published](https://news.web3privacy.info/${issue.week})` : format(new Date(issue.period[1]), "MMM d"),
        issue.curator || '-'
    ]

    lines.push('| ' + props.join(' | ') + ' |')
}

const out = lines.join("\n")
//console.log(out)

const readmeSrc = await Deno.readTextFile('./README.md')
const readmeOut = readmeSrc.replace(
    /<!-- ISSUES-START -->[\s\S]+<!-- ISSUES-END -->/m,
    `<!-- ISSUES-START -->\n\n${out}\n\n<!-- ISSUES-END -->`
)

await Deno.writeTextFile('./README.md', readmeOut)

console.log(`README.md modified. Done.`)