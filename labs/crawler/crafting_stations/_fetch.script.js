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


const sections = (() => {
	const data = []
    if ($url.match('Shimmer_Transmutation')?.length) {
        let walk = document.querySelector('#toc').nextElementSibling
        while (walk.children[0]?.id !== 'Notes') {
            clearSpan(walk)
            parseImg(walk)
            removeTags(walk, ['sup', 'br'])
            parseLinks(walk)
            removeSoundTag(walk)
            normalizeText(walk)
            data.push(walk.outerHTML)
            walk = walk.nextElementSibling
        }
    }
    return data
})()

const crafts = parseCraftTable()

const json_result = {
    type: 'crafting_stations',
	title,
    summaries: [...summaries, ...sections],
    crafts,
}
print(JSON.parse(JSON.stringify(json_result)))