import { authenticator as Authenticator } from 'otplib';
import { WebUntisSecretAuth } from 'webuntis';

import type { WebUntisUserInformation } from '../types/WebUntis.types';
import type { WebUntisResolvedCredentials } from '../utils/credentials';
import { toSafeWebUntisError } from '../utils/errors';

const WEBUNTIS_IDENTITY = 'n8n-nodes-hemmilicious-webuntis';

function optionalNumber(value: unknown): number | undefined {
	return typeof value === 'number' && Number.isFinite(value)
		? value
		: undefined;
}

export class WebUntisAuth {
	private client: WebUntisSecretAuth | null = null;

	private authenticated = false;

	constructor(
		private readonly credentials: WebUntisResolvedCredentials,
	) {}

	getClient(): WebUntisSecretAuth {
		if (!this.client) {
			this.client = new WebUntisSecretAuth(
				this.credentials.school,
				this.credentials.username,
				this.credentials.secret,
				this.credentials.server,
				WEBUNTIS_IDENTITY,
				Authenticator,
				false,
			);
		}

		return this.client;
	}

	async login(): Promise<WebUntisUserInformation> {
		if (this.authenticated) {
			return this.getUserInformation();
		}

		const client = this.getClient();

		try {
			await client.login();
			this.authenticated = true;

			return this.getUserInformation();
		} catch (error) {
			this.authenticated = false;

			throw toSafeWebUntisError(error, 'login');
		}
	}

	getUserInformation(): WebUntisUserInformation {
		const sessionInformation =
			this.client?.sessionInformation as
				| Record<string, unknown>
				| null
				| undefined;

		return {
			username: this.credentials.username,
			personId: optionalNumber(sessionInformation?.personId),
			personType: optionalNumber(sessionInformation?.personType),
			classId: optionalNumber(sessionInformation?.klasseId),
		};
	}

	async validateSession(): Promise<boolean> {
		if (!this.authenticated || !this.client) {
			return false;
		}

		try {
			return await this.client.validateSession();
		} catch {
			return false;
		}
	}

	async logout(): Promise<void> {
		if (!this.client) {
			return;
		}

		try {
			if (this.authenticated) {
				await this.client.logout();
			}
		} catch {
			// Best-effort cleanup only.
		} finally {
			this.authenticated = false;
			this.client = null;
		}
	}
}
