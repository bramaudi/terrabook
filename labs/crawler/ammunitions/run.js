import crawl from '../_crawl.js'
import { readFileSync } from 'fs'

await crawl({
	script: './labs/crawler/ammunitions/_index.script.js',
	slug: 'Ammunition_items',
	name: '_ammunitions'
})

const items = JSON.parse(readFileSync('./public/json/_ammunitions.json', { encoding: 'utf-8' }))

for (const item of items) {
	const name = decodeURIComponent(item)
	
	try {
        let scriptPath = './labs/crawler/ammunitions/_fetch.script.js'
        let slug = name.replace(/ /g, '_')
        
        if (name.match('Bait')) {
            scriptPath = './labs/crawler/ammunitions/_bait.script.js'
        }

        if (name.match(/^Rocket [I|II|III|IV]/)) {
            scriptPath = './labs/crawler/ammunitions/_rocket.script.js'
        }

		await crawl({script: scriptPath, slug, name})
	 } catch (error) {
		console.log(`[××× Failed] ${error.status} with '${error.message}'`);
	 }
}
