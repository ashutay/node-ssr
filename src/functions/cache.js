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

	check() {
		for (const url in this.cache) {
			if (Date.now() > this.cache[url]['live_time']) {
				delete this.cache[url];
			}
		}
	}

	getSize() {
		return String(Object.keys(this.cache).length);
	}

	getList() {
		let list = '';

		for (const url in this.cache) {
			list = list + url + ' ' + this.cache[url].status + ' ' + this.formatDate(this.cache[url]['date_create']) + '<br>\n';
		}

		return list;
	}

	clear() {
		Object.keys(this.cache).forEach(key => {
			delete this.cache[key];
		})
	}

	formatDate(timestamp) {
		let date = new Date(timestamp)

		return date.getDate() +
			"." + (date.getMonth() + 1) +
			"." + date.getFullYear() +
			" " + date.getHours() +
			":" + date.getMinutes() +
			":" + date.getSeconds()
	}
}
