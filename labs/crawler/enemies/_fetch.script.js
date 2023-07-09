const title = $url.split('/').slice(-1)[0].replace(/_/g, ' ')

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
        if (['DIV','BLOCKQUOTE','TABLE'].includes(walk.nodeName) ||
           walk.querySelector('.gameText')) {
            walk = walk.nextElementSibling
            continue;
        }
        clearSpan(walk)
        parseImg(walk)
        removeTags(walk, ['sup', 'br'])
        parseLinks(walk)
        removeSoundTag(walk)
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
    const stats = getInfobox().querySelector('.section.statistics')
    const tbody = stats.querySelector('tbody')
    const rows = {}
    for (const tr of tbody.querySelectorAll('tr')) {
        const [col1, col2] = tr.childNodes
        const key = col1.textContent.trim()
        normalizeText(col2)
        clearSpan(col2)
        parseImg(col2)
        removeTags(col2, ['s','sup'])
        parseLinks(col2)
        let value = col2.innerHTML
        if (key === 'Immune to') {
        	value = [...col2.querySelectorAll('span.i')]
            	.map(e => e.textContent.trim().replace(/\[img:(.*)\]/, '$1'))
            	.join(', ')
        }
        rows[key] = value
    }
    delete rows['Type']
    return rows
})()

const drops= (() => {
    const ul = getInfobox().querySelector('ul.drops.items')
    if (!ul) return
    return format(ul, ['s', 'sup']).outerHTML
})()

const json_result = {
    type: 'enemies',
    title,
    summaries,
    statistics,
    drops,
}
print(JSON.parse(JSON.stringify(json_result)))