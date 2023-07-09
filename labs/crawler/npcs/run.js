import crawl from '../_crawl.js'
import { readFileSync } from 'fs'

await crawl({
	script: ['./labs/crawler/npcs/_index.script.js'],
	slug: 'NPCs',
	name: '_npcs',
})

const items = JSON.parse(readFileSync('./public/json/_npcs.json', { encoding: 'utf-8' }))

for (const item of items) {
	const name = decodeURIComponent(item)
	try {	
		await crawl({
			script: [
				'./labs/crawler/_functions.script.js',
				'./labs/crawler/npcs/_fetch.script.js',
			],
			slug: name.replace(/ /g, '_'),
			name
		})
	 } catch (error) {
		console.log(`[××× Failed] ${error.status} with '${error.message}'`);
	 }
}
