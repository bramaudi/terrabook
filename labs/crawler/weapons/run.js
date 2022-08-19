import crawl from '../_crawl.js'
import { readFileSync } from 'fs'

// Fetch Weapons.json
await crawl({
	script: './labs/crawler/weapons/_index.script.js',
	slug: 'Weapons',
	name: '_weapons',
})

const items = JSON.parse(readFileSync('./public/json/_weapons.json', { encoding: 'utf-8' }))

for (const item of items) {
	const name = decodeURIComponent(item)
	
	try {	
		let scriptPath = './labs/crawler/tools/_fetch.script.js'
		let slug = name.replace(/ /g, '_')
		
		await crawl({ script: scriptPath, slug, name })
	 } catch (error) {
		console.log(`[××× Failed] ${error.status} with '${error.message}'`);
	 }
}
