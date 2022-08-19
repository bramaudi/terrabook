// This script will remove all links and replace with one-click download on image
// useful for downloading mass icons on list

let html = document.body.innerHTML
for (const a of document.body.querySelectorAll('a')) {
	html = html.replace(a.outerHTML, a.innerHTML)
}
document.body.innerHTML = html
// -------------
html = document.body.innerHTML
for (const img of document.body.querySelectorAll('img')) {
	const name = img.src.split('/').slice(-1)
	html = html.replace(img.outerHTML, `
	<a href="${img.src}" download>${img.outerHTML}</a>
	`)
}
document.body.innerHTML = html
