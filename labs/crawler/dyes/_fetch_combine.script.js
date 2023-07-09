let slug = $url.split('/').splice(-1)[0]
	slug = slug.split('#').splice(-1)[0]
	slug = slug.replace("'", "\\'")

const row = document.querySelector(`#${slug}`).closest('tr')

const title = slug.replace(/_/g, ' ')

const statistics = (() => {
    //clearSpan(row)
    parseImg(row)
    removeTags(row, ['s'])
    parseLinks(row)
    normalizeText(row)
    const [,,Ingredients, Crafts] = row.children
    const craftsList = [...Crafts.querySelectorAll('.dye-unit')].map(e => e.textContent).join('<br/>')
    return {
        Ingredients: Ingredients.textContent.trim(),
        Crafts: craftsList || undefined,
    }
})()

print(JSON.parse(JSON.stringify({
    type: 'dyes',
	title,
    statistics,
})))