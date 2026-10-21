import { readFileSync } from "node:fs";

/**
 * Reads the donors named on a class JSDoc's `Modelled on:` lines. The runtime retired class
 * definition donors, so this provenance lives only in the comment above the class's define.
 *
 * @param {string} file Source module relative to the package root, e.g. "destiny/CjsDestinyBall.js".
 * @param {string} className The class name its `meta.define` registers.
 * @returns {string[]} Donor names in declaration order; empty when the class has no attached JSDoc.
 */
export function modelledOn(file, className)
{
    const source = readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
    const define = source.indexOf(`@meta.define({ className: "${className}"`);
    const start = define === -1 ? -1 : source.lastIndexOf("/**", define);
    if (start === -1 || source.slice(source.indexOf("*/", start) + 2, define).trim()) return [];
    return [...source.slice(start, define).matchAll(/^ \* Modelled on: ([\w:~]+) \(/gm)].map(match => match[1]);
}
