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

	async validateSession(): Promise<boolean> {
		return await this.client.execute(
			async (client) => await client.validateSession(),
		);
	}

	async getOwnTimetableForToday(): Promise<unknown[]> {
		return await this.client.execute(
			async (client) =>
				await client.getOwnTimetableForToday(false),
		);
	}

	async getOwnTimetableForDate(date: Date): Promise<unknown[]> {
		return await this.client.execute(
			async (client) =>
				await client.getOwnTimetableFor(date, false),
		);
	}

	async getOwnTimetableForRange(
		startDate: Date,
		endDate: Date,
	): Promise<unknown[]> {
		return await this.client.execute(
			async (client) =>
				await client.getOwnTimetableForRange(
					startDate,
					endDate,
					false,
				),
		);
	}

	async getOwnTimetableForWeek(
		date: Date,
		formatId = 1,
	): Promise<unknown[]> {
		return await this.client.execute(
			async (client) =>
				await client.getOwnTimetableForWeek(
					date,
					formatId,
					false,
				),
		);
	}

	async getOwnClassTimetableForToday(): Promise<unknown[]> {
		return await this.client.execute(
			async (client) =>
				await client.getOwnClassTimetableForToday(false),
		);
	}

	async getOwnClassTimetableForDate(
		date: Date,
	): Promise<unknown[]> {
		return await this.client.execute(
			async (client) =>
				await client.getOwnClassTimetableFor(
					date,
					false,
				),
		);
	}

	async getOwnClassTimetableForRange(
		startDate: Date,
		endDate: Date,
	): Promise<unknown[]> {
		return await this.client.execute(
			async (client) =>
				await client.getOwnClassTimetableForRange(
					startDate,
					endDate,
					false,
				),
		);
	}

	async getTimetableForToday(
		id: number,
		type: number,
	): Promise<unknown[]> {
		return await this.client.execute(
			async (client) =>
				await client.getTimetableForToday(
					id,
					type,
					false,
				),
		);
	}

	async getTimetableForDate(
		date: Date,
		id: number,
		type: number,
	): Promise<unknown[]> {
		return await this.client.execute(
			async (client) =>
				await client.getTimetableFor(
					date,
					id,
					type,
					false,
				),
		);
	}

	async getTimetableForRange(
		startDate: Date,
		endDate: Date,
		id: number,
		type: number,
	): Promise<unknown[]> {
		return await this.client.execute(
			async (client) =>
				await client.getTimetableForRange(
					startDate,
					endDate,
					id,
					type,
					false,
				),
		);
	}

	async getTimetableForWeek(
		date: Date,
		id: number,
		type: number,
		formatId = 1,
	): Promise<unknown[]> {
		return await this.client.execute(
			async (client) =>
				await client.getTimetableForWeek(
					date,
					id,
					type,
					formatId,
					false,
				),
		);
	}

	async getClasses(
		schoolYearId?: number,
	): Promise<unknown[]> {
		return await this.client.execute(
			async (client) => {
				let resolvedSchoolYearId = schoolYearId;

				if (resolvedSchoolYearId === undefined) {
					const current =
						await client.getCurrentSchoolyear(false);
					resolvedSchoolYearId = current.id;
				}

				return await client.getClasses(
					false,
					resolvedSchoolYearId,
				);
			},
		);
	}

	async getTeachers(): Promise<unknown[]> {
		return await this.client.execute(
			async (client) => await client.getTeachers(false),
		);
	}

	async getStudents(): Promise<unknown[]> {
		return await this.client.execute(
			async (client) => await client.getStudents(false),
		);
	}

	async getSubjects(): Promise<unknown[]> {
		return await this.client.execute(
			async (client) => await client.getSubjects(false),
		);
	}

	async getRooms(): Promise<unknown[]> {
		return await this.client.execute(
			async (client) => await client.getRooms(false),
		);
	}

	async getDepartments(): Promise<unknown[]> {
		return await this.client.execute(
			async (client) => await client.getDepartments(false),
		);
	}

	async getSchoolYears(): Promise<unknown[]> {
		return await this.client.execute(
			async (client) => await client.getSchoolyears(false),
		);
	}

	async getCurrentSchoolYear(): Promise<unknown> {
		return await this.client.execute(
			async (client) =>
				await client.getCurrentSchoolyear(false),
		);
	}

	async getLatestSchoolYear(): Promise<unknown> {
		return await this.client.execute(
			async (client) =>
				await client.getLatestSchoolyear(false),
		);
	}

	async getHolidays(): Promise<unknown[]> {
		return await this.client.execute(
			async (client) => await client.getHolidays(false),
		);
	}

	async getTimeGrid(): Promise<unknown[]> {
		return await this.client.execute(
			async (client) => await client.getTimegrid(false),
		);
	}

	async getExams(
		startDate: Date,
		endDate: Date,
		classId = -1,
		withGrades = false,
	): Promise<unknown[]> {
		return await this.client.execute(
			async (client) =>
				await client.getExamsForRange(
					startDate,
					endDate,
					classId,
					withGrades,
					false,
				),
		);
	}

	async getHomeworks(
		startDate: Date,
		endDate: Date,
	): Promise<unknown> {
		return await this.client.execute(
			async (client) =>
				await client.getHomeWorksFor(
					startDate,
					endDate,
					false,
				),
		);
	}

	async getHomeworkAndLessons(
		startDate: Date,
		endDate: Date,
	): Promise<unknown> {
		return await this.client.execute(
			async (client) =>
				await client.getHomeWorkAndLessons(
					startDate,
					endDate,
					false,
				),
		);
	}

	async getAbsences(
		startDate: Date,
		endDate: Date,
		excuseStatusId = -1,
	): Promise<unknown> {
		return await this.client.execute(
			async (client) =>
				await client.getAbsentLesson(
					startDate,
					endDate,
					excuseStatusId,
					false,
				),
		);
	}

	async getAbsencePdf(
		startDate: Date,
		endDate: Date,
		excuseStatusId = -1,
		lateness = true,
		absences = true,
		excuseGroup = 2,
	): Promise<string> {
		return await this.client.execute(
			async (client) =>
				await client.getPdfOfAbsentLesson(
					startDate,
					endDate,
					false,
					excuseStatusId,
					lateness,
					absences,
					excuseGroup,
				),
		);
	}

	async getInbox(): Promise<unknown> {
		return await this.client.execute(
			async (client) => await client.getInbox(false),
		);
	}

	async getNews(date: Date): Promise<unknown> {
		return await this.client.execute(
			async (client) =>
				await client.getNewsWidget(date, false),
		);
	}

	async getLatestImportTime(): Promise<number> {
		return await this.client.execute(
			async (client) =>
				await client.getLatestImportTime(false),
		);
	}

	async getStatusData(): Promise<unknown> {
		return await this.client.execute(
			async (client) => await client.getStatusData(false),
		);
	}
}
