import type { ICredentialDataDecryptedObject } from 'n8n-workflow';

import {
	normalizeWebUntisServer,
	parseUntisQrUrl,
} from './qr';

export interface WebUntisResolvedCredentials {
	server: string;
	school: string;
	schoolNumber?: string;
	username: string;
	secret: string;
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
		const qrUrl = requireCredential(
			credentials,
			'qrUrl',
			'Untis QR URL',
		);

		return parseUntisQrUrl(qrUrl);
	}

	if (configurationMode !== 'manual') {
		throw new Error('Invalid WebUntis credential configuration mode');
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

	const schoolNumber = requireCredential(
		credentials,
		'schoolNumber',
		'School Number',
	);

	const username = requireCredential(
		credentials,
		'username',
		'Username',
	);

	const secret = requireCredential(
		credentials,
		'secret',
		'Secret Key',
	);

	return {
		server: normalizeWebUntisServer(server),
		school,
		schoolNumber,
		username,
		secret,
	};
}
