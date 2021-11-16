class Dataset {
	data() {
		return {
			permalink: 'search-dataset.json'
		}
	}

	render({ collections }) {
		const content = []
		for (const post of collections.blog) {
			content.push({
				title: post.data.title,
				url: post.url,
				date: this.handleDate(post.date),
			})
		}
		return JSON.stringify(content)
	}
}

module.exports = Dataset