const title = document.querySelector('#firstHeading').textContent

const summaries = (() => {
	let walk = (() => {
    	const mwParser = document.querySelector('.mw-parser-output')
        let i = 0
        try {
        	while (mwParser.children[i].nodeName !== 'P') i++
            return mwParser.children[i]
        } catch (e) {
        	return mwParser.querySelector('p')
        }
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
        parseLinks(walk)
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
    if (!stats) return
    const tbody = stats.querySelector('tbody')
    const rows = {}
    for (const tr of tbody.querySelectorAll('tr')) {
        const [col1, col2] = tr.childNodes
        const key = col1.textContent.trim()
        normalizeText(col2)
        clearSpan(col2)
        parseImg(col2)
        removeTags(col2, ['s'])
        parseLinks(col2)
        const value = col2.innerHTML
    	rows[key] = value
    }
    delete rows['Type']
    return rows
})()

const crafts = parseCraftTable()

const json_result = {
    type: 'blocks',
	title,
    summaries,
    statistics,
    crafts
}
print(JSON.parse(JSON.stringify(json_result)))