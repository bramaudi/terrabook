import { readFileSync, writeFileSync } from "fs";
import fs from 'fast-glob'
import { basename } from "path";

const type_dirs = fs
    .sync('./labs/crawler/*', { onlyDirectories: true })
    .map(v => basename(v))
    .filter(n => !n.startsWith('_'))

let collection = []
for (const dirname of type_dirs) {
    const list = JSON.parse(readFileSync(`./public/json/_${dirname}.json`, { encoding: 'utf-8' }))
        .map(name => ({ type: dirname, name }))
    collection = [...collection, ...list]
}

// sort by name
collection = collection.sort((a, b) => a.name.localeCompare(b.name))
// unique by name
collection = [...new Map(collection.map(item =>
    [item['name'], item])).values()];

console.log('[Success] Build search data');
writeFileSync(`./public/json/_search.json`, JSON.stringify(collection), { encoding: 'utf-8' })