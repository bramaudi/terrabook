let slug = $url.split('/').splice(-1)[0]
	slug = slug.split('#').splice(-1)[0]
	slug = slug.replace(/'/g, '\\\'')

const row = document.querySelector(`#${slug}`).closest('tr')

const title = slug.replace(/_/g, ' ')

const statistics = (() => {
    clearSpan(row)
    parseImg(row)
    removeTags(row, ['s'])
    parseLinks(row)
    normalizeText(row)
    const [,,Power,Rarity,Stack,Sell,Research] = row.children
    return {
        Power: Power.innerHTML.trim(),
        Rarity: Rarity.textContent.trim(),
        Sell: Sell.innerHTML.trim(),
        Research: `<abbr class="journey" title="Journey Mode">${Research.textContent.trim()}</abbr>`,
    }
})()

print({
	type: 'ammunitions',
	title,
    statistics,
})