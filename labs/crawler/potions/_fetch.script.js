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
function parseCraftTable() {    
    const result = {}
    const crafts = document.querySelectorAll('.crafts')
    for (const $craft of crafts) {
        const title = (() => {
            const prev1 = $craft.previousElementSibling
            const prev2 = $craft
            	.previousElementSibling
            	.previousElementSibling
            const el = prev2?.nodeName === 'H3' ? prev2 : prev1
            return el.textContent
        })()
    	const rows = []
        for (const tr of $craft.querySelectorAll('tr')) {
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
        result[title] = rows.slice(2)
    }
    return result
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

const crafts = parseCraftTable()

const json_result = {
    type: 'accessories',
	title,
    summaries,
    statistics,
    crafts,
}
print(JSON.parse(JSON.stringify(json_result)))