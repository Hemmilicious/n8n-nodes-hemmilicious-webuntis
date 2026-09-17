import { describe, expect, it } from 'vitest';

import {
	normalizeWebUntisServer,
	parseUntisQrUrl,
} from '../../src/utils/qr';

describe('WebUntis QR parser', () => {
	it('parses a valid Untis QR URL', () => {
		const result = parseUntisQrUrl(
			'untis://setschool?url=https%3A%2F%2Fdemo.webuntis.com&school=DemoSchool&user=test-user&key=DUMMY_SECRET_NOT_REAL&schoolNumber=12345',
		);

		expect(result).toEqual({
			server: 'demo.webuntis.com',
			school: 'DemoSchool',
			schoolNumber: '12345',
			username: 'test-user',
			secret: 'DUMMY_SECRET_NOT_REAL',
		});
	});

	it('normalizes a WebUntis server hostname', () => {
		expect(
			normalizeWebUntisServer(
				'https://Demo.WebUntis.com/',
			),
		).toBe('demo.webuntis.com');
	});

	it('rejects a QR URL without a secret key', () => {
		expect(() =>
			parseUntisQrUrl(
				'untis://setschool?url=demo.webuntis.com&school=DemoSchool&user=test-user',
			),
		).toThrow('missing required field "key"');
	});
});
