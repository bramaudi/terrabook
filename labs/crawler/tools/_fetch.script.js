function removeTags($el, tags, recursive = true) {
	tags.forEach(tag => {
    	for (const elm of $el.querySelectorAll(tag)) {
            if (!recursive) {
                $el.innerHTML = $el.innerHTML
                	.replace(elm.outerHTML, elm.innerHTML)
            }
        	else elm.remove()
        }
    })
}
function parseImg($el) {
    for (const img of $el.querySelectorAll('img')) {
        const alt = img.getAttribute('alt')
            .replace(/\.(png|gif)/g, '')
        $el.innerHTML = $el.innerHTML
            .replace(img.outerHTML, `[img:${alt}]`)
    }
}
function clearSpan($el) {
    for (const span of $el.querySelectorAll('span')) {
    	if (span.getAttribute('style') || span.classList.contains('nowrap')) {
        	$el.innerHTML = $el.innerHTML
            	.replace(span.outerHTML, span.innerHTML)
        }
    }
}
function normalizeText($el) {
	$el.innerHTML = $el.innerHTML
        .replace(/&nbsp;/g, ' ')
        .replace(/\n+/g, '')
        .replace(/\t+/g, '')
        .trim()
}
function parseCraftTable(headlineId) {
	const headline = (() => {
        let walk = document.querySelector(`#${headlineId}`)?.parentElement
        if (!walk) return
        while (!walk.classList.contains('crafts')) {
        	walk = walk.nextElementSibling
        }
        return walk.querySelector('table')
    })()
    if (!headline) return undefined
    
    const rows = []
    for (const tr of headline.querySelectorAll('tr')) {
        function getCol(className) {
        	const el = tr.querySelector(className)
            if (!el) return undefined
            clearSpan(el)
            parseImg(el)
            removeTags(el, ['a'], false)
            normalizeText(el)
            const rowspan = ~~el.getAttribute('rowspan') || undefined
            const value = el.innerHTML
            return { rowspan, value }
        }
        const result = getCol('.result')
        const ingredients = getCol('.ingredients')
        const station = getCol('.station')
    	rows.push({ result, ingredients, station })
    }
    return rows.slice(1)
}

const title = document.querySelector('#firstHeading').textContent

const summaries = (() => {
	let walk = (() => {
    	const mwParser = document.querySelector('.mw-parser-output')
        let i = 0
        while (mwParser.children[i].nodeName !== 'P') i++
        return mwParser.children[i]
    })()
    const data = []
    while (walk && (
        walk.getAttribute('id') !== 'toc' &&
        walk.nodeName !== 'H2' ||
        (walk.nodeName === 'TABLE' && !walk.classList.contains('infobox'))
    )) {
        if (['DIV','BLOCKQUOTE','TABLE'].includes(walk.nodeName)) {
        	walk = walk.nextElementSibling
            continue;
        }
        clearSpan(walk)
        parseImg(walk)
        removeTags(walk, ['sup', 'br'])
        removeTags(walk, ['a'], false)
        normalizeText(walk)
        if (walk.nodeName === 'UL') {
        	data.push(walk.outerHTML)
        }
        else data.push(walk.innerHTML)
        walk = walk.nextElementSibling
    }
    return data
})()

const toolpower = (() => {
	const rows = []
    for (const li of document.querySelectorAll('.toolpower li')) {
        parseImg(li)
        rows.push(li.textContent)
    }
    return rows
})()

const statistics = (() => {
	const stats = document.querySelector('.section.statistics')
    const tbody = stats.querySelector('tbody')
    const rows = {}
    for (const tr of tbody.querySelectorAll('tr')) {
        const [col1, col2] = tr.childNodes
        const key = col1.textContent.trim()
        normalizeText(col2)
        clearSpan(col2)
        parseImg(col2)
        removeTags(col2, ['s'])
        removeTags(col2, ['a'], false)
        const value = col2.innerHTML
    	rows[key] = value
    }
    delete rows['Type']
    return rows
})()

const receipes = parseCraftTable('Recipes')

const used_in = parseCraftTable('Used_in')

const json_result = {
    type: 'tools',
	title,
    toolpower,
    summaries,
    statistics,
    receipes,
    used_in,
}
print(JSON.parse(JSON.stringify(json_result)))