const table = document.getElementById('wings-table')
const list = []
for (const tr of table.querySelectorAll('tr')) {
	const td = tr.querySelectorAll('td')
	if (td.length) {
        list.push(
        	td[1]
				.querySelector('span span span')
				.textContent.trim()
		)
    }
}
print(list)