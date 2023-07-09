import crawl from '../_crawl.js'
import { readFileSync } from 'fs'

await crawl({
	script: ['./labs/crawler/enemies/_index.script.js'],
	slug: 'Enemies',
	name: '_enemies',
})

const items = JSON.parse(readFileSync('./public/json/_enemies.json', { encoding: 'utf-8' }))

for (const item of items) {
	const name = decodeURIComponent(item)
	try {	
		await crawl({
			script: [
				'./labs/crawler/_functions.script.js',
				'./labs/crawler/enemies/_fetch.script.js'
			],
			slug: name.replace(/ /g, '_'),
			name
		})
	 } catch (error) {
		console.log(`[××× Failed] ${error.status} with '${error.message}'`);
	 }
}
