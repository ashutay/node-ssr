export class Cache {
	constructor() {
		this.time = 43200000;
		this.cache = {};
	}

	getPageByURL(url) {
		if (this.cache.hasOwnProperty(url)) {
			return this.cache[url];
		}

		return null;
	}

	setPage(url, html, status) {
		this.cache[url] = {
			html,
			status,
			'date_create': Date.now(),
			'live_time': Date.now() + this.time
		}
	}
}
