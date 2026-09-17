import { createHash } from 'node:crypto';

function canonicalize(value: unknown): unknown {
	if (value instanceof Date) {
		return value.toISOString();
	}

	if (Array.isArray(value)) {
		const normalized = value.map((entry) => canonicalize(entry));

		return normalized.sort((a, b) =>
			JSON.stringify(a).localeCompare(JSON.stringify(b)),
		);
	}

	if (typeof value === 'object' && value !== null) {
		const source = value as Record<string, unknown>;
		const result: Record<string, unknown> = {};

		for (const key of Object.keys(source).sort()) {
			const entry = source[key];

			if (entry !== undefined) {
				result[key] = canonicalize(entry);
			}
		}

		return result;
	}

	return value;
}

export function fingerprintWebUntisData(value: unknown): string {
	const payload = JSON.stringify(canonicalize(value));

	return createHash('sha256').update(payload).digest('hex');
}
