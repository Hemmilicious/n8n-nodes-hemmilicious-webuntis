import type { WebUntis } from 'webuntis';

import type { WebUntisUserInformation } from '../types/WebUntis.types';
import { toSafeWebUntisError } from '../utils/errors';

import { WebUntisAuth } from './WebUntisAuth';

export class WebUntisClient {
	constructor(
		private readonly auth: WebUntisAuth,
	) {}

	async connect(): Promise<void> {
		await this.auth.login();
	}

	async getUserInformation(): Promise<WebUntisUserInformation> {
		await this.auth.login();
		return this.auth.getUserInformation();
	}

	async execute<T>(
		operation: (client: WebUntis) => Promise<T>,
	): Promise<T> {
		await this.auth.login();

		if (!(await this.auth.validateSession())) {
			await this.relogin();
		}

		try {
			return await operation(this.auth.getClient());
		} catch (error) {
			const sessionStillValid =
				await this.auth.validateSession();

			if (sessionStillValid) {
				throw toSafeWebUntisError(error, 'request');
			}

			await this.relogin();

			try {
				return await operation(
					this.auth.getClient(),
				);
			} catch (retryError) {
				throw toSafeWebUntisError(
					retryError,
					'request',
				);
			}
		}
	}

	async disconnect(): Promise<void> {
		await this.auth.logout();
	}

	private async relogin(): Promise<void> {
		await this.auth.logout();
		await this.auth.login();
	}
}
