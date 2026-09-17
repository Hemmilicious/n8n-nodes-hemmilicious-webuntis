export type WebUntisErrorContext = 'login' | 'request';

const NETWORK_ERROR_CODES = new Set([
	'ECONNREFUSED',
	'ECONNRESET',
	'ENETUNREACH',
	'EHOSTUNREACH',
	'ENOTFOUND',
	'ETIMEDOUT',
	'EAI_AGAIN',
]);

function getObject(
	value: unknown,
): Record<string, unknown> | undefined {
	return typeof value === 'object' && value !== null
		? (value as Record<string, unknown>)
		: undefined;
}

function getErrorCode(error: unknown): string | undefined {
	const object = getObject(error);

	if (!object) {
		return undefined;
	}

	if (typeof object.code === 'string') {
		return object.code.toUpperCase();
	}

	const cause = getObject(object.cause);

	if (typeof cause?.code === 'string') {
		return cause.code.toUpperCase();
	}

	return undefined;
}

function getHttpStatus(error: unknown): number | undefined {
	const object = getObject(error);
	const response = getObject(object?.response);

	return typeof response?.status === 'number'
		? response.status
		: undefined;
}

function getMessageForClassification(error: unknown): string {
	if (error instanceof Error) {
		return error.message.toLowerCase();
	}

	return '';
}

export function toSafeWebUntisError(
	error: unknown,
	context: WebUntisErrorContext,
): Error {
	const code = getErrorCode(error);

	if (code && NETWORK_ERROR_CODES.has(code)) {
		return new Error('WebUntis server unreachable');
	}

	const status = getHttpStatus(error);
	const message = getMessageForClassification(error);

	if (
		message.includes('session') &&
		(
			message.includes('expired') ||
			message.includes('invalid') ||
			message.includes('not valid')
		)
	) {
		return new Error('WebUntis session expired');
	}

	if (
		status === 403 ||
		message.includes('permission denied') ||
		message.includes('forbidden') ||
		message.includes('unauthorized access')
	) {
		return new Error('Permission denied');
	}

	if (context === 'login') {
		if (
			message.includes('school') &&
			(
				message.includes('not found') ||
				message.includes('unknown')
			)
		) {
			return new Error('WebUntis school not found');
		}

		if (
			status === 401 ||
			message.includes('authentication') ||
			message.includes('invalid user') ||
			message.includes('invalid credential') ||
			message.includes('invalid secret') ||
			message.includes('invalid password') ||
			message.includes('login failed')
		) {
			return new Error('WebUntis authentication failed');
		}

		return new Error('WebUntis login failed');
	}

	if (status === 401) {
		return new Error('WebUntis session expired');
	}

	return new Error('WebUntis request failed');
}

export function safeErrorMessage(error: unknown): string {
	return error instanceof Error
		? error.message
		: 'WebUntis request failed';
}
