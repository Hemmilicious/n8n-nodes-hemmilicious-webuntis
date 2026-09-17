import type {
	ICredentialDataDecryptedObject,
	ICredentialsDecrypted,
	ICredentialTestFunctions,
	IDataObject,
	IExecuteFunctions,
	INodeCredentialTestResult,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import {
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';

import { WebUntisLegacyProvider } from '../../src/providers/WebUntisLegacyProvider';
import { WebUntisAuth } from '../../src/services/WebUntisAuth';
import { WebUntisClient } from '../../src/services/WebUntisClient';
import { normalizeTimetableLesson } from '../../src/services/WebUntisNormalizer';
import type { WebUntisUserInformation } from '../../src/types/WebUntis.types';
import { resolveWebUntisCredentials } from '../../src/utils/credentials';
import { parseWebUntisDateParameter } from '../../src/utils/dates';

function userInformationToJson(
	information: WebUntisUserInformation,
): IDataObject {
	const result: IDataObject = {
		username: information.username,
	};

	if (information.personId !== undefined) {
		result.personId = information.personId;
	}

	if (information.personType !== undefined) {
		result.personType = information.personType;
	}

	if (information.classId !== undefined) {
		result.classId = information.classId;
	}

	return result;
}

function errorMessage(error: unknown): string {
	return error instanceof Error
		? error.message
		: 'WebUntis connection test failed';
}

export class WebUntis implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'WebUntis',
		name: 'webUntis',
		icon: 'file:Untis.svg',
		group: ['input'],
		version: 1,
		usableAsTool: true,
		subtitle:
			'={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'Read data from WebUntis',
		defaults: {
			name: 'WebUntis',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'webUntisApi',
				required: true,
				testedBy: 'webUntisConnectionTest',
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Timetable',
						value: 'timetable',
					},
					{
						name: 'System',
						value: 'system',
					},
				],
				default: 'timetable',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['timetable'],
					},
				},
				options: [
					{
						name: 'Get Today',
						value: 'getToday',
						action: 'Get today timetable',
						description:
							'Get the timetable for the authenticated user for today',
					},
					{
						name: 'Get Date',
						value: 'getDate',
						action: 'Get timetable for a date',
						description:
							'Get the timetable for the authenticated user for a specific date',
					},
					{
						name: 'Get Range',
						value: 'getRange',
						action: 'Get timetable for a date range',
						description:
							'Get the timetable for the authenticated user for a date range',
					},
				],
				default: 'getToday',
			},
			{
				displayName: 'Date',
				name: 'date',
				type: 'dateTime',
				required: true,
				default: '',
				description:
					'Date for which to retrieve the timetable',
				displayOptions: {
					show: {
						resource: ['timetable'],
						operation: ['getDate'],
					},
				},
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				required: true,
				default: '',
				description:
					'First date of the timetable range',
				displayOptions: {
					show: {
						resource: ['timetable'],
						operation: ['getRange'],
					},
				},
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				required: true,
				default: '',
				description:
					'Last date of the timetable range',
				displayOptions: {
					show: {
						resource: ['timetable'],
						operation: ['getRange'],
					},
				},
			},
			{
				displayName: 'Return Raw Data',
				name: 'returnRawData',
				type: 'boolean',
				default: false,
				description:
					'Whether to include the original WebUntis lesson object in addition to normalized fields',
				displayOptions: {
					show: {
						resource: ['timetable'],
					},
				},
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['system'],
					},
				},
				options: [
					{
						name: 'Get User Information',
						value: 'getUserInformation',
						action: 'Get user information',
						description:
							'Get non-sensitive information about the authenticated WebUntis user',
					},
				],
				default: 'getUserInformation',
			},
		],
	};

	methods = {
		credentialTest: {
			async webUntisConnectionTest(
				this: ICredentialTestFunctions,
				credential: ICredentialsDecrypted<ICredentialDataDecryptedObject>,
			): Promise<INodeCredentialTestResult> {
				let client: WebUntisClient | undefined;

				try {
					if (!credential.data) {
						return {
							status: 'Error',
							message:
								'WebUntis credentials are missing',
						};
					}

					const resolvedCredentials =
						resolveWebUntisCredentials(
							credential.data,
						);

					const auth = new WebUntisAuth(
						resolvedCredentials,
					);

					client = new WebUntisClient(auth);

					await client.connect();
					await client.getUserInformation();

					return {
						status: 'OK',
						message:
							'Connection successful. WebUntis authentication succeeded and user information was loaded.',
					};
				} catch (error) {
					return {
						status: 'Error',
						message: errorMessage(error),
					};
				} finally {
					await client?.disconnect();
				}
			},
		},
	};

	async execute(
		this: IExecuteFunctions,
	): Promise<INodeExecutionData[][]> {
		const inputItems = this.getInputData();

		const credentials =
			await this.getCredentials('webUntisApi');

		const resolvedCredentials =
			resolveWebUntisCredentials(credentials);

		const auth = new WebUntisAuth(resolvedCredentials);
		const client = new WebUntisClient(auth);
		const provider = new WebUntisLegacyProvider(client);

		const outputItems: INodeExecutionData[] = [];

		try {
			await provider.connect();

			for (
				let itemIndex = 0;
				itemIndex < inputItems.length;
				itemIndex++
			) {
				const resource = this.getNodeParameter(
					'resource',
					itemIndex,
				) as string;

				const operation = this.getNodeParameter(
					'operation',
					itemIndex,
				) as string;

				if (
					resource === 'system' &&
					operation === 'getUserInformation'
				) {
					const information =
						await provider.getUserInformation();

					outputItems.push({
						json: userInformationToJson(
							information,
						),
						pairedItem: {
							item: itemIndex,
						},
					});

					continue;
				}

				if (resource !== 'timetable') {
					throw new NodeOperationError(
						this.getNode(),
						'Unsupported WebUntis resource',
						{
							itemIndex,
						},
					);
				}

				const returnRawData =
					this.getNodeParameter(
						'returnRawData',
						itemIndex,
						false,
					) as boolean;

				let lessons: unknown[];

				if (operation === 'getToday') {
					lessons =
						await provider.getOwnTimetableForToday();
				} else if (operation === 'getDate') {
					const dateValue =
						this.getNodeParameter(
							'date',
							itemIndex,
						) as string;

					const date =
						parseWebUntisDateParameter(
							dateValue,
							'Date',
						);

					lessons =
						await provider.getOwnTimetableForDate(
							date,
						);
				} else if (operation === 'getRange') {
					const startValue =
						this.getNodeParameter(
							'startDate',
							itemIndex,
						) as string;

					const endValue =
						this.getNodeParameter(
							'endDate',
							itemIndex,
						) as string;

					const startDate =
						parseWebUntisDateParameter(
							startValue,
							'Start Date',
						);

					const endDate =
						parseWebUntisDateParameter(
							endValue,
							'End Date',
						);

					if (
						startDate.getTime() >
						endDate.getTime()
					) {
						throw new NodeOperationError(
							this.getNode(),
							'Start Date must not be after End Date',
							{
								itemIndex,
							},
						);
					}

					lessons =
						await provider.getOwnTimetableForRange(
							startDate,
							endDate,
						);
				} else {
					throw new NodeOperationError(
						this.getNode(),
						'Unsupported timetable operation',
						{
							itemIndex,
						},
					);
				}

				for (const lesson of lessons) {
					const normalized =
						normalizeTimetableLesson(
							lesson,
							returnRawData,
						);

					outputItems.push({
						json: normalized as unknown as IDataObject,
						pairedItem: {
							item: itemIndex,
						},
					});
				}
			}

			return [outputItems];
		} finally {
			await provider.disconnect();
		}
	}
}
