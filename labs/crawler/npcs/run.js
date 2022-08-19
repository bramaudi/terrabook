import crawl from '../_crawl.js'
import { readFileSync } from 'fs'

await crawl({
	script: './labs/crawler/npcs/_index.script.js',
	slug: 'NPCs',
	name: '_npcs',
})

const items = JSON.parse(readFileSync('./public/json/_npcs.json', { encoding: 'utf-8' }))

for (const item of items) {
	const name = decodeURIComponent(item)
	
	try {	
		let scriptPath = './labs/crawler/npcs/_fetch.script.js'
		let slug = name.replace(/ /g, '_')

		await crawl({script: scriptPath, slug, name})
	 } catch (error) {
		console.log(`[××× Failed] ${error.status} with '${error.message}'`);
	 }
}
