import crawl from '../_crawl.js'
import { readFileSync, rmSync, writeFileSync } from 'fs'

const accessories_types = [
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
for (const type of accessories_types) {
    const name = 'Accessories-' + i
    await crawl({
        script: './labs/crawler/accessories/_index.script.js',
        custom_slug: true,
        slug: `index.php?action=render&title=${encodeURIComponent(type + ' Accessories')}`,
        name,
    })
    const list = JSON.parse(readFileSync(`./public/json/${name}.json`, { encoding: 'utf-8' }))
    mergedList = [...mergedList, ...list]
    rmSync(`./public/json/${name}.json`)
    i++
}

// filter unique
mergedList = [...new Set(mergedList)]
writeFileSync('./public/json/_accessories.json', JSON.stringify(mergedList), { encoding: 'utf-8' })

for (const item of mergedList) {
    const name = decodeURIComponent(item)
	
	try {	
		let scriptPath = './labs/crawler/accessories/_fetch.script.js'
		let slug = name.replace(/ /g, '_')

		await crawl({script: scriptPath, slug, name})
	 } catch (error) {
		console.log(`[××× Failed] ${error.status} with '${error.message}'`);
	 }
}