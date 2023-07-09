import crawl from '../_crawl.js'
import { readFileSync } from 'fs'

await crawl({
	script: ['./labs/crawler/mounts/_index.script.js'],
	slug: 'Mounts',
	name: '_mounts',
})

const items = JSON.parse(readFileSync('./public/json/_mounts.json', { encoding: 'utf-8' }))

for (const item of items) {
	const name = decodeURIComponent(item)
	try {	
		await crawl({
			script: [
				'./labs/crawler/_functions.script.js',
				'./labs/crawler/mounts/_fetch.script.js',
			],
			slug: name.replace(/ /g, '_'),
			name
		})
	 } catch (error) {
		console.log(`[××× Failed] ${error.status} with '${error.message}'`);
	 }
}
