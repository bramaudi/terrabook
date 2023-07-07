const list = [...document.querySelectorAll('.hgroup .main')].map(e => e.textContent.replace(/\(.*\)/g, '').trim())
print(list)