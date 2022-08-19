const tables = document.querySelectorAll('table.terraria')
const list = []
for (const table of tables) {
	for (const tr of table.querySelectorAll('tr')) {
    	const td = tr.querySelectorAll('td')
		if (td.length > 1) {
            const name = td[1]
                .querySelector('span span a')
                .href.trim()
                .split('/').splice(-1, 1)[0]
                .replace(/_/g, ' ')
            list.push(decodeURIComponent(name))
        }
	}
}
print(list)