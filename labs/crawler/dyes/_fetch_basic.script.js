let slug = $url.split('/').splice(-1)[0]
	slug = slug.split('#').splice(-1)[0]
	slug = slug.replace("'", "\\'")

const row = document.querySelector(`#${slug}`).closest('tr')

const title = slug.replace(/_/g, ' ')

const summaries = (() => {
    clearSpan(row)
    parseImg(row)
    removeTags(row, ['s'])
    parseLinks(row)
    normalizeText(row)
    const list = row.lastElementChild.querySelectorAll('li')
	return [...list].map(n => n.innerHTML.trim())
})()

const statistics = (() => {
    clearSpan(row)
    parseImg(row)
    removeTags(row, ['s'])
    parseLinks(row)
    normalizeText(row)
    const [,,Ingredients,Source,String,Golf,BrightDye,BlackDye,SilverDye,Special] = row.children
    return {
        Ingredients: Ingredients.textContent.trim(),
        Source: Source.textContent.trim(),
        String: String.textContent.trim(),
        'Golf Ball': Golf.textContent.trim(),
        'Bright Dye (+ Silver Dye)': BrightDye.textContent.trim(),
        '+ Black Dye': BlackDye.textContent.trim(),
        '+ Silver Dye': SilverDye.textContent.trim(),
        Special: Special.textContent.trim()
    }
})()

print({
    type: 'dyes',
	title,
    summaries,
    statistics,
})