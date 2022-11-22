const tables = document.querySelectorAll('table.terraria')
const list = []
for (const table of tables) {
	for (const tr of table.querySelectorAll('.il2c')) {
        let name = tr.querySelector('.i.-w > span > span')
    	name = name || tr.querySelector('a')
        name = name.textContent.trim()
    	!name.match('ID') && list.push(name)
	}
}
print([...new Set(list)])