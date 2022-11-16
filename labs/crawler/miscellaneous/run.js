import crawl from '../_crawl.js'
import { readFileSync, writeFileSync } from 'fs'

// Fetch Miscellaneous.json
await crawl({
	script: './labs/crawler/miscellaneous/_index.script.js',
	slug: 'Miscellaneous',
	name: '_miscellaneous',
})

const items = JSON.parse(readFileSync('./public/json/_miscellaneous.json', { encoding: 'utf-8' }))

for (const item of items) {
	const name = decodeURIComponent(item)
	
	try {	
		let scriptPath = './labs/crawler/tools/_fetch.script.js'
		let slug = name.replace(/ /g, '_')
		
		await crawl({ script: scriptPath, slug, name })

		// rename type "tools" to "miscellaneous"
		let itemRaw = readFileSync(`./public/json/${name}.json`, { encoding: 'utf-8' })
			.replace('"tools"', '"miscellaneous"')
		
		// remove "toolpower" property
		const itemJsonDecoded = JSON.parse(itemRaw)
		itemJsonDecoded.toolpower = undefined
		itemRaw = JSON.stringify(itemJsonDecoded)
		
		writeFileSync(`./public/json/${name}.json`, itemRaw, { encoding: 'utf-8' })
	 } catch (error) {
		console.log(`[××× Failed] ${error.status} with '${error.message}'`);
	 }
}
