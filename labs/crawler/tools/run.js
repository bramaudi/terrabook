import crawl from '../_crawl.js'
import { readFileSync } from 'fs'

// Fetch Tools.json
await crawl({
	script: './labs/crawler/tools/_index.script.js',
	slug: 'Tools',
	name: '_tools',
})

const items = JSON.parse(readFileSync('./public/json/_tools.json', { encoding: 'utf-8' }))

for (const item of items) {
	const name = decodeURIComponent(item)
	
	try {	
		let scriptPath = './labs/crawler/tools/_fetch.script.js'
		let slug = name.replace(/ /g, '_')

		if (['Skeletron Hand', 'Ivy Whip', 'Web Slinger'].includes(name) || name.match('Hook')) {
			scriptPath = './labs/crawler/tools/_hook.script.js'
			slug = `Hooks#${slug}`
		}
		
		if (['Fisher of Souls', 'Fleshcatcher', 'Chum Caster', 'Mechanic\'s Rod'].includes(name) || name.match('Fishing')) {
			scriptPath = './labs/crawler/tools/_fishing.script.js'
			slug = `Fishing_poles#${slug}`
		}

		if (['Nebula Hamaxe','Solar Flare Hamaxe','Spectre Hamaxe','Stardust Hamaxe','Vortex Hamaxe'].includes(name)) {
			slug = 'Luminite Hamaxes'
		}

		await crawl({script: scriptPath, slug, name})
	 } catch (error) {
		console.log(`[××× Failed] ${error.status} with '${error.message}'`);
	 }
}
