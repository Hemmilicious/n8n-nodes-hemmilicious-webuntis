export interface ParsedUntisQrUrl {
	server: string;
	school: string;
	schoolNumber?: string;
	username: string;
	secret: string;
}

function requireValue(params: URLSearchParams, name: string): string {
	const value = params.get(name)?.trim();

	if (!value) {
		throw new Error(`Invalid Untis QR URL: missing required field "${name}"`);
	}

	return value;
}

export function normalizeWebUntisServer(value: string): string {
	const input = value.trim();

	if (!input) {
		throw new Error('WebUntis server must not be empty');
	}

	try {
		const parsed = new URL(
			input.includes('://') ? input : `https://${input}`,
		);

		if (!parsed.hostname) {
			throw new Error();
		}

		return parsed.hostname.toLowerCase();
	} catch {
		// eslint-disable-next-line @n8n/community-nodes/require-node-api-error -- Pure parser utility has no n8n execution context
		throw new TypeError('Invalid WebUntis server');
	}
}

export function parseUntisQrUrl(qrUrl: string): ParsedUntisQrUrl {
	const input = qrUrl.trim();

	if (!input) {
		throw new Error('Untis QR URL must not be empty');
	}

	let parsed: URL;

	try {
		parsed = new URL(input);
	} catch {
		// eslint-disable-next-line @n8n/community-nodes/require-node-api-error -- Pure parser utility has no n8n execution context
		throw new TypeError('Invalid Untis QR URL');
	}

	if (parsed.protocol !== 'untis:') {
		throw new Error('Invalid Untis QR URL: expected untis:// scheme');
	}

	if (parsed.hostname.toLowerCase() !== 'setschool') {
		throw new Error('Invalid Untis QR URL: expected setschool action');
	}

	const rawServer = requireValue(parsed.searchParams, 'url');
	const school = requireValue(parsed.searchParams, 'school');
	const username = requireValue(parsed.searchParams, 'user');
	const secret = requireValue(parsed.searchParams, 'key');
	const schoolNumber =
		parsed.searchParams.get('schoolNumber')?.trim() || undefined;

	return {
		server: normalizeWebUntisServer(rawServer),
		school,
		schoolNumber,
		username,
		secret,
	};
}
