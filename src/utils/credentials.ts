import type { ICredentialDataDecryptedObject } from 'n8n-workflow';

import {
	normalizeWebUntisServer,
	parseUntisQrUrl,
} from './qr';

export type WebUntisAuthenticationMode = 'secret' | 'password';

export interface WebUntisResolvedCredentials {
	authentication: WebUntisAuthenticationMode;
	server: string;
	school: string;
	schoolNumber?: string;
	username: string;
	secret?: string;
	password?: string;
}

function getStringCredential(
	credentials: ICredentialDataDecryptedObject,
	name: string,
): string {
	const value = credentials[name];

	if (typeof value !== 'string') {
		return '';
	}

	return value.trim();
}

function requireCredential(
	credentials: ICredentialDataDecryptedObject,
	name: string,
	displayName: string,
): string {
	const value = getStringCredential(credentials, name);

	if (!value) {
		throw new Error(`${displayName} is required`);
	}

	return value;
}

export function resolveWebUntisCredentials(
	credentials: ICredentialDataDecryptedObject,
): WebUntisResolvedCredentials {
	const configurationMode =
		getStringCredential(credentials, 'configurationMode') || 'manual';

	if (configurationMode === 'qrUrl') {
		const parsed = parseUntisQrUrl(
			requireCredential(
				credentials,
				'qrUrl',
				'Untis QR URL',
			),
		);

		return {
			authentication: 'secret',
			server: parsed.server,
			school: parsed.school,
			schoolNumber: parsed.schoolNumber,
			username: parsed.username,
			secret: parsed.secret,
		};
	}

	if (
		configurationMode !== 'manual' &&
		configurationMode !== 'password'
	) {
		throw new Error(
			'Invalid WebUntis credential authentication mode',
		);
	}

	const server = requireCredential(
		credentials,
		'server',
		'Server',
	);
	const school = requireCredential(
		credentials,
		'school',
		'School',
	);
	const username = requireCredential(
		credentials,
		'username',
		'Username',
	);
	const schoolNumber =
		getStringCredential(credentials, 'schoolNumber') || undefined;

	if (configurationMode === 'password') {
		return {
			authentication: 'password',
			server: normalizeWebUntisServer(server),
			school,
			schoolNumber,
			username,
			password: requireCredential(
				credentials,
				'password',
				'Password',
			),
		};
	}

	return {
		authentication: 'secret',
		server: normalizeWebUntisServer(server),
		school,
		schoolNumber,
		username,
		secret: requireCredential(
			credentials,
			'secret',
			'Secret Key',
		),
	};
}
