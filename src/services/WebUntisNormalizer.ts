import {
	untisDateToIsoDate,
	untisTimeToIsoTime,
} from '../utils/dates';

type UnknownRecord = Record<string, unknown>;

interface ShortDataLike {
	id?: number;
	name?: string;
	longname?: string;
	longName?: string;
}

export interface NormalizedTimetableEntry {
	id: number;
	date: string;
	startTime: string;
	endTime: string;
	subject: string;
	subjectShort: string;
	teacher: string;
	teacherShort: string;
	room: string;
	roomShort: string;
	class: string;
	classShort: string;
	status: 'regular' | 'cancelled' | 'irregular';
	cancelled: boolean;
	substitution: boolean;
	activityType?: string;
	info?: string;
	substitutionText?: string;
	rawData?: UnknownRecord;
}

function isRecord(value: unknown): value is UnknownRecord {
	return typeof value === 'object' && value !== null;
}

function requiredNumber(
	object: UnknownRecord,
	name: string,
): number {
	const value = object[name];

	if (
		typeof value !== 'number' ||
		!Number.isFinite(value)
	) {
		throw new Error(
			`Invalid WebUntis lesson: missing numeric field "${name}"`,
		);
	}

	return value;
}

function optionalString(
	object: UnknownRecord,
	name: string,
): string | undefined {
	const value = object[name];

	if (typeof value !== 'string') {
		return undefined;
	}

	const trimmed = value.trim();
	return trimmed || undefined;
}

function getFirstShortData(
	value: unknown,
): ShortDataLike | undefined {
	if (!Array.isArray(value) || value.length === 0) {
		return undefined;
	}

	const first = value[0];

	if (!isRecord(first)) {
		return undefined;
	}

	return {
		id: typeof first.id === 'number' ? first.id : undefined,
		name: typeof first.name === 'string' ? first.name : undefined,
		longname:
			typeof first.longname === 'string'
				? first.longname
				: undefined,
		longName:
			typeof first.longName === 'string'
				? first.longName
				: undefined,
	};
}

function longName(
	value: ShortDataLike | undefined,
): string {
	return (
		value?.longname?.trim() ||
		value?.longName?.trim() ||
		value?.name?.trim() ||
		''
	);
}

function shortName(
	value: ShortDataLike | undefined,
): string {
	return (
		value?.name?.trim() ||
		value?.longname?.trim() ||
		value?.longName?.trim() ||
		''
	);
}

export function normalizeTimetableLesson(
	value: unknown,
	includeRawData = false,
): NormalizedTimetableEntry {
	if (!isRecord(value)) {
		throw new Error('Invalid WebUntis lesson');
	}

	const subject = getFirstShortData(value.su);
	const teacher = getFirstShortData(value.te);
	const room = getFirstShortData(value.ro);
	const schoolClass = getFirstShortData(value.kl);

	const code = optionalString(value, 'code');
	const status: NormalizedTimetableEntry['status'] =
		code === 'cancelled'
			? 'cancelled'
			: code === 'irregular'
				? 'irregular'
				: 'regular';

	const substitutionText =
		optionalString(value, 'substText');

	const result: NormalizedTimetableEntry = {
		id: requiredNumber(value, 'id'),
		date: untisDateToIsoDate(
			requiredNumber(value, 'date'),
		),
		startTime: untisTimeToIsoTime(
			requiredNumber(value, 'startTime'),
		),
		endTime: untisTimeToIsoTime(
			requiredNumber(value, 'endTime'),
		),
		subject: longName(subject),
		subjectShort: shortName(subject),
		teacher: longName(teacher),
		teacherShort: shortName(teacher),
		room: longName(room),
		roomShort: shortName(room),
		class: longName(schoolClass),
		classShort: shortName(schoolClass),
		status,
		cancelled: status === 'cancelled',
		substitution:
			status === 'irregular' ||
			substitutionText !== undefined,
	};

	const activityType =
		optionalString(value, 'activityType');
	const info = optionalString(value, 'info');

	if (activityType) {
		result.activityType = activityType;
	}

	if (info) {
		result.info = info;
	}

	if (substitutionText) {
		result.substitutionText = substitutionText;
	}

	if (includeRawData) {
		result.rawData = value;
	}

	return result;
}
