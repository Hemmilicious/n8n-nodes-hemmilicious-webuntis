import type { WebUntisUserInformation } from '../types/WebUntis.types';

export interface WebUntisProvider {
	connect(): Promise<void>;

	disconnect(): Promise<void>;

	getUserInformation(): Promise<WebUntisUserInformation>;

	getOwnTimetableForToday(): Promise<unknown[]>;

	getOwnTimetableForDate(
		date: Date,
	): Promise<unknown[]>;

	getOwnTimetableForRange(
		startDate: Date,
		endDate: Date,
	): Promise<unknown[]>;
}
