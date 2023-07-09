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
        parseLinks(walk)
        normalizeText(walk)
        if (walk.nodeName === 'UL') {
            data.push(walk.outerHTML)
        }
        else data.push(walk.innerHTML)
        walk = walk.nextElementSibling
    }
    if (title === 'Town Slimes') {
    	const headingTypes = document.querySelector('#Types')
        const table = headingTypes.parentElement.nextElementSibling
        format(table)
        data.push(table.outerHTML)
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
        removeTags(col2, ['s','sup'])
        parseLinks(col2)
        const value = col2.innerHTML
        rows[key] = value
    }
    delete rows['Type']
    return rows
})()

const living_preferences = (() => {
    let el = document.querySelector('.living-preferences') ||
          document.querySelector('#Living_preferences')
    if (!el) return

    if (el.id === 'Living_preferences') {
        el = el.closest('h2')
        let html = ''
        while (el.nextElementSibling.nodeName === 'P') {
            const next = format(el.nextElementSibling)
            html += next.outerHTML
            el = el.nextElementSibling
        }
        return html
    }

    format(el)
    return el.innerHTML
})()

const drops= (() => {
    const ul = document.querySelector('ul.drops.items')
    if (!ul) return
    return format(ul).outerHTML
})()

const json_result = {
    type: 'npcs',
    title,
    summaries,
    statistics,
    living_preferences,
    drops,
}
print(JSON.parse(JSON.stringify(json_result)))