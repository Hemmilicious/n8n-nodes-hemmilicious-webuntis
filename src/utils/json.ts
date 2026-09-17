import type { IDataObject } from 'n8n-workflow';

type JsonPrimitive = string | number | boolean | null;
type JsonCompatible =
	| JsonPrimitive
	| JsonCompatible[]
	| { [key: string]: JsonCompatible };

export function toJsonCompatible(value: unknown): JsonCompatible {
	if (
		value === null ||
		typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'boolean'
	) {
		return value;
	}

	if (value instanceof Date) {
		return value.toISOString();
	}

	if (Array.isArray(value)) {
		return value.map((entry) => toJsonCompatible(entry));
	}

	if (typeof value === 'object') {
		const result: Record<string, JsonCompatible> = {};

		for (const [key, entry] of Object.entries(
			value as Record<string, unknown>,
		)) {
			if (entry === undefined) {
				continue;
			}

			result[key] = toJsonCompatible(entry);
		}

		return result;
	}

	return String(value);
}

export function toDataObject(value: unknown): IDataObject {
	const converted = toJsonCompatible(value);

	if (
		typeof converted === 'object' &&
		converted !== null &&
		!Array.isArray(converted)
	) {
		return converted as IDataObject;
	}

	return { value: converted } as IDataObject;
}

export function extractArray(
	value: unknown,
	key: string,
): unknown[] {
	if (Array.isArray(value)) {
		return value;
	}

	if (
		typeof value === 'object' &&
		value !== null
	) {
		const nested = (value as Record<string, unknown>)[key];

		if (Array.isArray(nested)) {
			return nested;
		}
	}

	return [];
}
