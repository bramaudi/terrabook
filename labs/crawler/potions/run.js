import crawl from '../_crawl.js'
import { readFileSync, rmSync, writeFileSync } from 'fs'

const TYPES = [
    'Recovery potions',
    'Buff potions',
    'Flasks',
    'Other potions',
]
let mergedList = []

let i = 1;
for (const type of TYPES) {
    const name = 'Potions-' + i
    await crawl({
        script: [
            './labs/crawler/_functions.script.js',
            './labs/crawler/potions/_index.script.js'
        ],
        custom_slug: true,
        slug: `index.php?action=render&title=${encodeURIComponent(type)}`,
        name,
    })
    const list = JSON.parse(readFileSync(`./public/json/${name}.json`, { encoding: 'utf-8' }))
    mergedList = [...mergedList, ...list]
    rmSync(`./public/json/${name}.json`)
    i++
}

mergedList = [...new Set(mergedList)].map(v => v.replace('ä', 'a'))
writeFileSync('./public/json/_potions.json', JSON.stringify(mergedList), { encoding: 'utf-8' })

for (const item of mergedList) {
    const name = decodeURIComponent(item)
	try {
        let slug = name.replace(/ /g, '_')
        
        // escape non-ascii that caused error on android build
        if (name === 'Wiesnbrau') slug = slug.replace('a', 'ä')

		await crawl({
            script: [
                './labs/crawler/_functions.script.js',
                './labs/crawler/potions/_fetch.script.js',
            ],
            slug,
            name
        })
	 } catch (error) {
		console.log(`[××× Failed] ${error.status} with '${error.message}'`);
	 }
}