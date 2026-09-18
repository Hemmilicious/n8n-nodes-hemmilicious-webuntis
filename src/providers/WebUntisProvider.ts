import type { WebUntisUserInformation } from '../types/WebUntis.types';

export interface WebUntisProvider {
	connect(): Promise<void>;
	disconnect(): Promise<void>;
	getUserInformation(): Promise<WebUntisUserInformation>;
	validateSession(): Promise<boolean>;

	getOwnTimetableForToday(): Promise<unknown[]>;
	getOwnTimetableForDate(date: Date): Promise<unknown[]>;
	getOwnTimetableForRange(
		startDate: Date,
		endDate: Date,
	): Promise<unknown[]>;
	getOwnTimetableForWeek(
		date: Date,
		formatId?: number,
	): Promise<unknown[]>;

	getOwnClassTimetableForToday(): Promise<unknown[]>;
	getOwnClassTimetableForDate(date: Date): Promise<unknown[]>;
	getOwnClassTimetableForRange(
		startDate: Date,
		endDate: Date,
	): Promise<unknown[]>;

	getTimetableForToday(
		id: number,
		type: number,
	): Promise<unknown[]>;
	getTimetableForDate(
		date: Date,
		id: number,
		type: number,
	): Promise<unknown[]>;
	getTimetableForRange(
		startDate: Date,
		endDate: Date,
		id: number,
		type: number,
	): Promise<unknown[]>;
	getTimetableForWeek(
		date: Date,
		id: number,
		type: number,
		formatId?: number,
	): Promise<unknown[]>;

	getClasses(schoolYearId?: number): Promise<unknown[]>;
	getTeachers(): Promise<unknown[]>;
	getStudents(): Promise<unknown[]>;
	getSubjects(): Promise<unknown[]>;
	getRooms(): Promise<unknown[]>;
	getDepartments(): Promise<unknown[]>;
	getSchoolYears(): Promise<unknown[]>;
	getCurrentSchoolYear(): Promise<unknown>;
	getLatestSchoolYear(): Promise<unknown>;
	getHolidays(): Promise<unknown[]>;
	getTimeGrid(): Promise<unknown[]>;

	getExams(
		startDate: Date,
		endDate: Date,
		classId?: number,
		withGrades?: boolean,
	): Promise<unknown[]>;

	getHomeworks(
		startDate: Date,
		endDate: Date,
	): Promise<unknown>;
	getHomeworkAndLessons(
		startDate: Date,
		endDate: Date,
	): Promise<unknown>;

	getAbsences(
		startDate: Date,
		endDate: Date,
		excuseStatusId?: number,
		studentId?: number,
	): Promise<unknown>;
	getAbsencePdf(
		startDate: Date,
		endDate: Date,
		excuseStatusId?: number,
		lateness?: boolean,
		absences?: boolean,
		excuseGroup?: number,
		studentId?: number,
	): Promise<string>;

	getInbox(): Promise<unknown>;
	getNews(date: Date): Promise<unknown>;
	getLatestImportTime(): Promise<number>;
	getStatusData(): Promise<unknown>;
}
