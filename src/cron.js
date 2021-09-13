export class Cron {
	constructor(CACHE) {
		this.cron = require('node-cron');
		this.cache = CACHE;
	}

	initTasks() {
		this.cron.schedule('0 0 */1 * * *', () => {
			this.cache.check();
		});
	}
}
