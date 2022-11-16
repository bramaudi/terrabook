const list = []
for (const itemlist of document.querySelectorAll('.itemlist')) {
	for (const li of itemlist.querySelectorAll('li')) {
    	list.push(li.querySelector('a').getAttribute('title'))
    }
}

function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}

function removeSomeWeapon(value) {
	const unobtainable = []
	const removed = []
	return ![...unobtainable, ...removed].includes(value)
}

print(list.filter(onlyUnique).filter(removeSomeWeapon))