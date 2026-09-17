import { WebUntisClient } from '../services/WebUntisClient';
import type { WebUntisUserInformation } from '../types/WebUntis.types';

import type { WebUntisProvider } from './WebUntisProvider';

export class WebUntisLegacyProvider implements WebUntisProvider {
	constructor(
		private readonly client: WebUntisClient,
	) {}

	async connect(): Promise<void> {
		await this.client.connect();
	}

	async disconnect(): Promise<void> {
		await this.client.disconnect();
	}

	async getUserInformation(): Promise<WebUntisUserInformation> {
		return await this.client.getUserInformation();
	}

	async getOwnTimetableForToday(): Promise<unknown[]> {
		return await this.client.execute(async (client) => {
			return await client.getOwnTimetableForToday(false);
		});
	}

	async getOwnTimetableForDate(
		date: Date,
	): Promise<unknown[]> {
		return await this.client.execute(async (client) => {
			return await client.getOwnTimetableFor(date, false);
		});
	}

	async getOwnTimetableForRange(
		startDate: Date,
		endDate: Date,
	): Promise<unknown[]> {
		return await this.client.execute(async (client) => {
			return await client.getOwnTimetableForRange(
				startDate,
				endDate,
				false,
			);
		});
	}
}
