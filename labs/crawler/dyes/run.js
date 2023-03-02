import crawl from '../_crawl.js'
import { readFileSync } from 'fs'

await crawl({
	script: './labs/crawler/dyes/_index.script.js',
	slug: 'Dyes',
	name: '_dyes',
})

const items = JSON.parse(readFileSync('./public/json/_dyes.json', { encoding: 'utf-8' }))

for (const item of items) {
	const name = decodeURIComponent(item)
	
	try {	
		let scriptPath = './labs/crawler/dyes/_fetch.script.js'
		let slug = 'Dyes#' + name.replace(/ /g, '_')

		await crawl({script: scriptPath, slug, name})
	 } catch (error) {
		console.log(`[××× Failed] ${error.status} with '${error.message}'`);
	 }
}
