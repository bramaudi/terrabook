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
    const [,,,Power,Velocity,Sell,Rarity] = row.children
    return {
        Power: Power.innerHTML.trim(),
        Velocity: Velocity.textContent.trim(),
        Sell: Sell.innerHTML.trim(),
        Rarity: Rarity.textContent.trim(),
    }
})()

const source = (() => {
    const [,,Source] = row.children
    return Source.innerHTML.trim()
})()

const notes = (() => {
    const [,,,,,,,Notes] = row.children
    return Notes.innerHTML.trim()
})()

print({
	type: 'fishing_poles',
	title,
    statistics,
    source,
    notes,
})