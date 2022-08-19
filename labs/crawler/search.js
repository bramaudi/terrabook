import { readFileSync, writeFileSync } from "fs";
import fs from 'fast-glob'
import { basename } from "path";

const type_dirs = fs
    .sync('./labs/crawler/*', { onlyDirectories: true })
    .filter(v => !v.match('_'))
    .map(v => basename(v))

let collection = []
for (const dirname of type_dirs) {
    const list = JSON.parse(readFileSync(`./public/json/_${dirname}.json`, { encoding: 'utf-8' }))
        .map(name => ({ type: dirname, name }))
    collection = [...collection, ...list]
}

collection = collection.sort((a, b) => a.name.localeCompare(b.name))
console.log(collection);
writeFileSync(`./public/json/_search.json`, JSON.stringify(collection), { encoding: 'utf-8' })