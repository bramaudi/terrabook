import crawl from '../_crawl.js'
import { readFileSync, rmSync, writeFileSync } from 'fs'

const blocks_types = [
    'Soils',
    'Grown Blocks',
    'Other Found Blocks',
    'Trap Blocks',
    'Ore Blocks',
    'Gemstone Blocks',
    'Bricks',
    'Crafted Blocks',
    'Purchased Blocks',
    'Looted Blocks',
    'Summoned Blocks',
]
let mergedList = []

let i = 1;
for (const type of blocks_types) {
    const name = 'Blocks-' + i
    await crawl({
        script: ['./labs/crawler/blocks/_index.script.js'],
        custom_slug: true,
        slug: `index.php?action=render&title=${encodeURIComponent(type)}`,
        name,
    })
    const list = JSON.parse(readFileSync(`./public/json/${name}.json`, { encoding: 'utf-8' }))
    mergedList = [...mergedList, ...list]
    rmSync(`./public/json/${name}.json`)
    i++
}

// exclude non-crawl-able page
const multiplePage = ['Grass', 'Ice', 'Pearlsandstone', 'Sandstone']
mergedList = [...new Set(mergedList)]
    .filter(name => !name.match('Item ID'))
    .filter(name => !name.match(/grass/i))
    .filter(name => !multiplePage.includes(name))
writeFileSync('./public/json/_blocks.json', JSON.stringify(mergedList), { encoding: 'utf-8' })

for (const item of mergedList) {
    const name = decodeURIComponent(item)
	try {	
		await crawl({
            script: [
                './labs/crawler/_functions.script.js',
                './labs/crawler/blocks/_fetch.script.js',
            ],
            slug: name.replace(/ /g, '_'),
            name
        })
	 } catch (error) {
		console.log(`[××× Failed] ${error.status} with '${error.message}'`);
	 }
}