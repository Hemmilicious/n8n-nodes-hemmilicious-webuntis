import { describe, expect, it } from 'vitest';

import {
	fingerprintWebUntisData,
} from '../../src/utils/fingerprint';

describe('WebUntis trigger fingerprint', () => {
	it('is stable across object key order', () => {
		const first = fingerprintWebUntisData({
			b: 2,
			a: 1,
		});
		const second = fingerprintWebUntisData({
			a: 1,
			b: 2,
		});

		expect(first).toBe(second);
	});

	it('is stable across collection ordering', () => {
		const first = fingerprintWebUntisData([
			{ id: 2 },
			{ id: 1 },
		]);
		const second = fingerprintWebUntisData([
			{ id: 1 },
			{ id: 2 },
		]);

		expect(first).toBe(second);
	});

	it('changes when data changes', () => {
		expect(
			fingerprintWebUntisData({ id: 1 }),
		).not.toBe(
			fingerprintWebUntisData({ id: 2 }),
		);
	});
});
