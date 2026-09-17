import { describe, expect, it } from 'vitest';

import {
	parseWebUntisDateParameter,
	untisDateToIsoDate,
	untisTimeToIsoTime,
} from '../../src/utils/dates';

describe('WebUntis dates', () => {
	it('parses n8n date values', () => {
		const date = parseWebUntisDateParameter(
			'2026-09-17T08:00:00.000Z',
			'Date',
		);

		expect(date.toISOString()).toBe(
			'2026-09-17T12:00:00.000Z',
		);
	});

	it('converts Untis dates', () => {
		expect(untisDateToIsoDate(20260917)).toBe(
			'2026-09-17',
		);
	});

	it('converts Untis times', () => {
		expect(untisTimeToIsoTime(805)).toBe('08:05');
	});
});
