import crawl from '../_crawl.js'
import { readFileSync } from 'fs'

await crawl({
	script: './labs/crawler/bosses/_index.script.js',
	slug: 'Bosses',
	name: '_bosses',
})

const items = JSON.parse(readFileSync('./public/json/_bosses.json', { encoding: 'utf-8' }))

for (const item of items) {
	const name = decodeURIComponent(item)
	
	try {	
		let scriptPath = './labs/crawler/bosses/_fetch.script.js'
		let slug = name.replace(/ /g, '_')
		
		await crawl({ script: scriptPath, slug, name })
	 } catch (error) {
		console.log(`[××× Failed] ${error.status} with '${error.message}'`);
	 }
}
