const list = []
let itemlists = [...document.querySelectorAll('.itemlist')]
// exclude bosses
const excludeIndexes = [16,17,18,19,20,21,22].sort((a,b) => b - a)
for (const index of excludeIndexes) {
	itemlists.splice(index-1, 1)
}
for (const itemlist of itemlists) {
	for (const li of itemlist.querySelectorAll('li')) {
    	list.push(li.querySelector('a').getAttribute('title'))
    }
}

function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}

list.pop() // exclude unspawnable
print(list.filter(onlyUnique))