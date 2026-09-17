import { describe, expect, it } from 'vitest';

import {
	normalizeTimetableLesson,
} from '../../src/services/WebUntisNormalizer';

describe('WebUntis timetable normalizer', () => {
	it('normalizes a classic lesson', () => {
		const result = normalizeTimetableLesson({
			id: 42,
			date: 20260917,
			startTime: 800,
			endTime: 845,
			su: [{ id: 1, name: 'M', longname: 'Mathematics' }],
			te: [{ id: 2, name: 'AB', longname: 'Alex Example' }],
			ro: [{ id: 3, name: 'R1', longname: 'Room 1' }],
			kl: [{ id: 4, name: '10A', longname: 'Class 10A' }],
		});

		expect(result.date).toBe('2026-09-17');
		expect(result.startTime).toBe('08:00');
		expect(result.subject).toBe('Mathematics');
		expect(result.cancelled).toBe(false);
	});
});
