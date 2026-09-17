import { describe, expect, it } from 'vitest';

import {
	resolveWebUntisCredentials,
} from '../../src/utils/credentials';

describe('WebUntis credentials', () => {
	it('keeps legacy manual secret credentials compatible', () => {
		const result = resolveWebUntisCredentials({
			configurationMode: 'manual',
			server: 'Demo.WebUntis.com',
			school: 'DemoSchool',
			schoolNumber: '12345',
			username: 'demo-user',
			secret: 'DUMMY_SECRET_NOT_REAL',
		});

		expect(result).toEqual({
			authentication: 'secret',
			server: 'demo.webuntis.com',
			school: 'DemoSchool',
			schoolNumber: '12345',
			username: 'demo-user',
			secret: 'DUMMY_SECRET_NOT_REAL',
		});
	});

	it('supports normal username/password credentials', () => {
		const result = resolveWebUntisCredentials({
			configurationMode: 'password',
			server: 'demo.webuntis.com',
			school: 'DemoSchool',
			username: 'demo-user',
			password: 'DUMMY_PASSWORD_NOT_REAL',
		});

		expect(result).toEqual({
			authentication: 'password',
			server: 'demo.webuntis.com',
			school: 'DemoSchool',
			schoolNumber: undefined,
			username: 'demo-user',
			password: 'DUMMY_PASSWORD_NOT_REAL',
		});
	});
});
