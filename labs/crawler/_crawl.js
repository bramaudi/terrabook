import {
	readFileSync,
	writeFileSync,
	existsSync,
	mkdirSync
} from 'fs'
import fetch from 'node-fetch'
import { parseHTML } from 'linkedom'

/**
 * Crawler
 * @param {{
 * script: string
 * slug: string
 * name: string?
 * update_cache: boolean?
 * verbose: boolean?
 * custom_slug: boolean?
 * }} props 
 * @returns 
 */
export default async function crawl(props) {
	let {
		script,
		slug,
		name = null,
		update_cache = false,
		verbose = false,
		custom_slug = false
	} = props
	if (!script) return console.log('"--script" argument cannot be empty')
	if (!slug) return console.log('"--slug" argument cannot be empty')

	const WIKI_URL = 'https://terraria.wiki.gg/' + (custom_slug ? '' : 'wiki/')
	const CACHE = `./labs/crawler/_cache/${custom_slug ? name : slug}.html`
	// const CACHE = `./labs/crawler/cache/${script.replace(/\//g, ':').replace('.', '').substr(1)}>${slug}.html`
	
	// Create if script folder exists
	const folder = `./public/json`
	if (!existsSync(folder)) {
		mkdirSync(folder)
	}
	
	// Get html and save in cache (if update_cache disabled)
	if (!existsSync(CACHE) || update_cache) {
		await fetch(WIKI_URL + slug).then(async (res) => {
			if (verbose) console.log(`Caching ${slug}`);
			writeFileSync(CACHE, await res.text(), { encoding: 'utf-8' })
		})
	}
	
	// Run script and write json result
	const scriptPath = script //`./labs/crawler/fetch-script/${script}.js`
	if (!existsSync(scriptPath)) return console.log(`--script ${script} not found`)
	const fetchScript = readFileSync(scriptPath, { encoding: 'utf-8' })
	const html = readFileSync(CACHE, { encoding: 'utf-8' })
	const { document } = parseHTML(html)

	// Saved file name
	name = name || slug
	
	function json(obj) {
		const target = `${folder}/${name}.json`
		const content = JSON.stringify(obj, null, 2)
		if (verbose) console.log(`Write ${target}`);
		writeFileSync(target, content, { encoding: 'utf-8' })
	}
	
	try {
		new Function('document', 'print', '$url', fetchScript)(document, json, WIKI_URL + slug)
		console.log(`[Success] ${name}.json`);
	} catch (error) {
		console.log(`[××× Failed] ${name}.json`);
		writeFileSync(`./labs/crawler/_logs/${name}.txt`, `${scriptPath}\n${error.stack}`, { encoding: 'utf-8' })
	}

	return
}