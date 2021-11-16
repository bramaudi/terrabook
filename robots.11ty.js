class Robots {
	data() {
		return {
			permalink: 'robots.txt',
			eleventyExcludeFromCollections: true
		}
	}
	render({ siteMeta }) {
		const content = [
			'User-agent: *',
			'Allow: /',
			`Sitemap: ${siteMeta.url}/sitemap.xml`
		]
		return content.join('\n')
	}
}

module.exports = Robots