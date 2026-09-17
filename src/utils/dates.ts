export function parseWebUntisDateParameter(
	value: string,
	fieldName: string,
): Date {
	const input = value.trim();
	const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(input);

	if (!match) {
		throw new Error(`${fieldName} must contain a valid date`);
	}

	const year = Number(match[1]);
	const month = Number(match[2]);
	const day = Number(match[3]);

	const date = new Date(
		Date.UTC(year, month - 1, day, 12, 0, 0),
	);

	if (
		date.getUTCFullYear() !== year ||
		date.getUTCMonth() !== month - 1 ||
		date.getUTCDate() !== day
	) {
		throw new Error(`${fieldName} must contain a valid date`);
	}

	return date;
}

export function untisDateToIsoDate(value: number): string {
	const input = String(value).padStart(8, '0');

	if (!/^\d{8}$/.test(input)) {
		throw new Error('Invalid WebUntis date');
	}

	const year = input.slice(0, 4);
	const month = input.slice(4, 6);
	const day = input.slice(6, 8);

	return `${year}-${month}-${day}`;
}

export function untisTimeToIsoTime(value: number): string {
	if (!Number.isInteger(value) || value < 0 || value > 2359) {
		throw new Error('Invalid WebUntis time');
	}

	const input = String(value).padStart(4, '0');
	const hours = Number(input.slice(0, 2));
	const minutes = Number(input.slice(2, 4));

	if (hours > 23 || minutes > 59) {
		throw new Error('Invalid WebUntis time');
	}

	return `${input.slice(0, 2)}:${input.slice(2, 4)}`;
}

export function dateOffsetFromToday(days: number): Date {
	const date = new Date();
	date.setHours(12, 0, 0, 0);
	date.setDate(date.getDate() + days);
	return date;
}
