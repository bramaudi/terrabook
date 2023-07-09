import crawl from '../_crawl.js'
import { readFileSync, rmSync, writeFileSync } from 'fs'

const TYPES = [
    'Movement',
    'Informational',
    'Health and Mana',
    'Combat',
    'Construction',
    'Fishing',
    'Miscellaneous',
    'Vanity',
    'Golf Ball',
    'Expert mode'
]
let mergedList = ['Music Box']
let i = 1;
for (const type of TYPES) {
    const name = 'Accessories-' + i
    await crawl({
        script: [
            './labs/crawler/_functions.script.js',
            './labs/crawler/accessories/_index.script.js',
        ],
        custom_slug: true,
        slug: `index.php?action=render&title=${encodeURIComponent(type + ' Accessories')}`,
        name,
    })
    const list = JSON.parse(readFileSync(`./public/json/${name}.json`, { encoding: 'utf-8' }))
    mergedList = [...mergedList, ...list]
    rmSync(`./public/json/${name}.json`)
    i++
}

mergedList = [...new Set(mergedList)] // filter unique
writeFileSync('./public/json/_accessories.json', JSON.stringify(mergedList, null, 2), { encoding: 'utf-8' })

for (const item of mergedList) {
    const name = decodeURIComponent(item)
    try {
        await crawl({
            script: [
                './labs/crawler/_functions.script.js',
                './labs/crawler/accessories/_fetch.script.js'
            ],
            slug: name.replace(/ /g, '_'),
            name
        })
    } catch (error) {
        console.log(`[××× Failed] ${error.status} with '${error.message}'`);
    }
}