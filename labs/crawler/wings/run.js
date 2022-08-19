import crawl from '../_crawl.js'
import { readFileSync } from 'fs'

await crawl({
	script: './labs/crawler/wings/_index.script.js',
	slug: 'Wings',
	name: '_wings',
})

const items = JSON.parse(readFileSync('./public/json/_wings.json', { encoding: 'utf-8' }))

for (const item of items) {
	const name = decodeURIComponent(item)
	
	try {	
		let scriptPath = './labs/crawler/wings/_fetch.script.js'
		let slug = 'Wings#' + name.replace(/ /g, '_')

		await crawl({script: scriptPath, slug, name})
	 } catch (error) {
		console.log(`[××× Failed] ${error.status} with '${error.message}'`);
	 }
}