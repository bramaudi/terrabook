const tables = document.querySelectorAll('table.terraria')
const list = []
for (const table of tables) {
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
}

// remove unobtainable dye
list.pop()

print(list)