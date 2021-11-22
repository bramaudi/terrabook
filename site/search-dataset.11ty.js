class Dataset {
	data() {
		return {
			permalink: 'search-dataset.json'
		}
	}

	render({ collections }) {
		const content = []
		for (const post of collections.posts) {
			content.push({
				title: post.data.title,
				description: post.data.description,
				url: post.url,
				date: this.readableDate(post.date),
			})
		}
		return JSON.stringify(content)
	}
}

module.exports = Dataset