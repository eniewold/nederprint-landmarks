// Draait alle generate-*.mjs na elkaar en meldt alleen fouten plus een
// samenvatting. Argumenten gaan door naar elk script, bijvoorbeeld:
//
//   node scripts/generate-all.mjs                  # schrijft naar models/
//   node scripts/generate-all.mjs --out /tmp/x     # schrijft naar /tmp/x/<slug>/
//
// Een script dat een andere schaal dan 1:1000 gebruikt, kiest die zelf; geef
// daarom geen --scale mee als je de vastgelegde STL's wilt reproduceren.
import { spawnSync } from "node:child_process";
import { readdir } from "node:fs/promises";
import path from "node:path";

const scripts = (await readdir(import.meta.dirname))
  .filter((name) => /^generate-.+\.mjs$/.test(name) && name !== "generate-all.mjs")
  .sort();
const failures = [];
const started = Date.now();
for (const [index, name] of scripts.entries()) {
  const t0 = Date.now();
  const result = spawnSync(
    process.execPath,
    [path.join(import.meta.dirname, name), ...process.argv.slice(2)],
    { encoding: "utf8", maxBuffer: 1 << 28 },
  );
  const seconds = ((Date.now() - t0) / 1000).toFixed(1);
  if (result.status === 0) {
    console.log(`[${index + 1}/${scripts.length}] ${name} ${seconds} s`);
  } else {
    failures.push(name);
    console.error(`[${index + 1}/${scripts.length}] ${name} MISLUKT na ${seconds} s`);
    console.error((result.stderr || result.error?.message || "").trim());
  }
}
const total = ((Date.now() - started) / 1000).toFixed(0);
console.log(`${scripts.length - failures.length} van ${scripts.length} gelukt in ${total} s`);
if (failures.length) {
  console.error(`Mislukt: ${failures.join(", ")}`);
  process.exitCode = 1;
}
