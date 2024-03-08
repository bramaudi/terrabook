import crawl from '../_crawl.js'
import { readFileSync } from 'fs'

await crawl({
	script: ['./labs/crawler/crafting_stations/_index.script.js'],
	slug: 'Crafting_stations',
	name: '_crafting_stations',
})

const items = JSON.parse(readFileSync('./public/json/_crafting_stations.json', { encoding: 'utf-8' }))

let index = 0
for (const item of items) {
	const name = decodeURIComponent(item)
	let slug = name.replace(/ /g, '_')
	
	try {
		await crawl({
			script: [
				`./labs/crawler/_functions.script.js`,
				`./labs/crawler/crafting_stations/_fetch.script.js`
			],
			slug,
			name
		})
		index++
	 } catch (error) {
		console.log(`[××× Failed] ${error.status} with '${error.message}'`);
	 }
}
