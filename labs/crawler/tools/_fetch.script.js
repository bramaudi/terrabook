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
        format(walk, ['sup', 'br'])
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
        format(li)
        rows.push(li.innerHTML)
    }
    return rows
})()

const statistics = (() => {
	const stats = document.querySelector('.section.statistics')
    if (!stats) return undefined
    const tbody = stats.querySelector('tbody')
    const rows = {}
    for (const tr of tbody.querySelectorAll('tr')) {
        const [col1, col2] = tr.childNodes
        const key = col1.textContent.trim()
        format(col2)
        const value = col2.innerHTML
    	rows[key] = value
    }
    delete rows['Type']
    return rows
})()

const crafts = parseCraftTable()

const json_result = {
    type: 'tools',
	title,
    toolpower,
    summaries,
    statistics,
    crafts,
}
print(JSON.parse(JSON.stringify(json_result)))