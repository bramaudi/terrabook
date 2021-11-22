const $search = document.getElementById('search')
const $postlist = document.getElementById('postslist')
const $alert = document.getElementById('alert')
$postlist._$$ = $postlist.innerHTML
window.onunload = () => {
	$search.value = ''
}
const postTemplate = `
<div class="post">
	<h2 class="title" rel="bookmark" title=":title:">
		<a href=":url:">:title:</a>
	</h2>
	<div class="content">:description:</div>
</div>`.trim()
function maplist($el, data) {
	const interpolationRegex = /:([\w]+):/g;
	$el._$ = $el._$ || postTemplate
	$el.textContent = "";
	$el.innerHTML = data.reduce((rawTemplate, obj) => {
		return rawTemplate += $el._$.replace(
			interpolationRegex,
			(match, group1) => obj[group1.trim()] ?? match
		)
	}, '')
}
let dataset = []
function search(value) {
	$alert.style.display = 'none'
	const result = fuzzysort.go(value, dataset, { key: 'title', limit: 100 })
	if (!result.length && value !== '') $alert.style.display = 'block'
	maplist(
		$postlist,
		result.map(({ target, obj }) => ({
			...obj,
			title: fuzzysort.highlight(
				fuzzysort.single(value, target),
				'<strong style=color:#be185d>', '</strong>'
			)
		}))
	)
}
$search.onclick = async function(e) {
	if (!dataset.length) {
		const resp = await fetch('/terrabook/search-dataset.json');
		const posts = await resp.json();
		dataset = posts
	}
	if (e.target.value !== '') search(e.target.value)
}
$search.oninput = async function(e) {
	$alert.style.display = 'none'
	if (e.target.value === '') $postlist.innerHTML = $postlist._$$
	else search(e.target.value)
}