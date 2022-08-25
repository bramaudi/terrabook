import crawl from '../_crawl.js'
import { readFileSync } from 'fs'

// Fetch Tools.json
await crawl({
	script: './labs/crawler/enemies/_index.script.js',
	slug: 'Enemies',
	name: '_enemies',
})

const items = JSON.parse(readFileSync('./public/json/_enemies.json', { encoding: 'utf-8' }))

for (const item of items) {
	const name = decodeURIComponent(item)
	
	try {	
		let scriptPath = './labs/crawler/enemies/_fetch.script.js'
		let slug = name.replace(/ /g, '_')

		await crawl({script: scriptPath, slug, name})
	 } catch (error) {
		console.log(`[××× Failed] ${error.status} with '${error.message}'`);
	 }
}
