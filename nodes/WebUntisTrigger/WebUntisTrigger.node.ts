import type {
	ICredentialDataDecryptedObject,
	ICredentialsDecrypted,
	ICredentialTestFunctions,
	INodeCredentialTestResult,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IPollFunctions,
} from 'n8n-workflow';
import {
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';

import { WebUntisLegacyProvider } from '../../src/providers/WebUntisLegacyProvider';
import { WebUntisAuth } from '../../src/services/WebUntisAuth';
import { WebUntisClient } from '../../src/services/WebUntisClient';
import { normalizeTimetableLesson } from '../../src/services/WebUntisNormalizer';
import { resolveWebUntisCredentials } from '../../src/utils/credentials';
import { dateOffsetFromToday } from '../../src/utils/dates';
import { safeErrorMessage } from '../../src/utils/errors';
import { fingerprintWebUntisData } from '../../src/utils/fingerprint';
import {
	extractArray,
	toDataObject,
} from '../../src/utils/json';

function dataAsExecutionItems(
	value: unknown,
): INodeExecutionData[] {
	const values = Array.isArray(value)
		? value
		: [value];

	return values.map((entry) => ({
		json: toDataObject(entry),
	}));
}

function normalizeTimetable(
	value: unknown[],
): unknown[] {
	return value.map((entry) =>
		normalizeTimetableLesson(entry, false),
	);
}

export class WebUntisTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'WebUntis Trigger',
		name: 'webUntisTrigger',
		icon: 'file:Untis.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description:
			'Starts workflows when selected WebUntis data changes',
		defaults: {
			name: 'WebUntis Trigger',
		},
		credentials: [
			{
				name: 'webUntisApi',
				required: true,
				testedBy: 'webUntisConnectionTest',
			},
		],
		polling: true,
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				options: [
					{
						name: 'Absences Changed',
						value: 'absencesChanged',
					},
					{
						name: 'Exams Changed',
						value: 'examsChanged',
					},
					{
						name: 'Homework Changed',
						value: 'homeworkChanged',
					},
					{
						name: 'Inbox Changed',
						value: 'inboxChanged',
					},
					{
						name: 'My Timetable Changed',
						value: 'timetableChanged',
					},
					{
						name: 'WebUntis Data Updated',
						value: 'dataUpdated',
						description:
							'Triggers when the WebUntis latest import timestamp changes',
					},
				],
				default: 'dataUpdated',
				required: true,
			},
			{
				displayName: 'Days Ahead',
				name: 'daysAhead',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 365,
				},
				default: 14,
				description:
					'How many days ahead to include in timetable, homework, and exam change detection',
				displayOptions: {
					show: {
						event: [
							'timetableChanged',
							'homeworkChanged',
							'examsChanged',
						],
					},
				},
			},
			{
				displayName: 'Days Back',
				name: 'daysBack',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 365,
				},
				default: 30,
				description:
					'How many days back to include in absence change detection',
				displayOptions: {
					show: {
						event: ['absencesChanged'],
					},
				},
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
							message: 'WebUntis credentials are missing',
						};
					}

					const resolved =
						resolveWebUntisCredentials(credential.data);

					const auth = new WebUntisAuth(resolved);
					client = new WebUntisClient(auth);

					await client.connect();
					await client.getUserInformation();

					return {
						status: 'OK',
						message: 'Connection successful.',
					};
				} catch (error) {
					return {
						status: 'Error',
						message: safeErrorMessage(error),
					};
				} finally {
					await client?.disconnect();
				}
			},
		},
	};

	async poll(
		this: IPollFunctions,
	): Promise<INodeExecutionData[][] | null> {
		const staticData =
			this.getWorkflowStaticData('node');
		const event = this.getNodeParameter(
			'event',
		) as string;

		const credentials =
			await this.getCredentials('webUntisApi');
		const resolved =
			resolveWebUntisCredentials(credentials);
		const auth = new WebUntisAuth(resolved);
		const client = new WebUntisClient(auth);
		const provider =
			new WebUntisLegacyProvider(client);

		try {
			await provider.connect();

			let currentData: unknown;
			let outputData: unknown;

			if (event === 'dataUpdated') {
				const latestImportTime =
					await provider.getLatestImportTime();

				currentData = latestImportTime;
				outputData = {
					latestImportTime,
				};
			} else if (event === 'timetableChanged') {
				const daysAhead = this.getNodeParameter(
					'daysAhead',
					14,
				) as number;
				const timetable =
					await provider.getOwnTimetableForRange(
						dateOffsetFromToday(0),
						dateOffsetFromToday(daysAhead),
					);

				currentData = timetable;
				outputData =
					normalizeTimetable(timetable);
			} else if (event === 'homeworkChanged') {
				const daysAhead = this.getNodeParameter(
					'daysAhead',
					14,
				) as number;
				const homework =
					await provider.getHomeworks(
						dateOffsetFromToday(0),
						dateOffsetFromToday(daysAhead),
					);

				currentData = homework;
				const entries =
					extractArray(homework, 'homeworks');
				outputData =
					entries.length > 0
						? entries
						: homework;
			} else if (event === 'examsChanged') {
				const daysAhead = this.getNodeParameter(
					'daysAhead',
					14,
				) as number;
				const exams = await provider.getExams(
					dateOffsetFromToday(0),
					dateOffsetFromToday(daysAhead),
					-1,
					false,
				);

				currentData = exams;
				outputData = exams;
			} else if (event === 'inboxChanged') {
				const inbox = await provider.getInbox();

				currentData = inbox;
				const messages =
					extractArray(
						inbox,
						'incomingMessages',
					);
				outputData =
					messages.length > 0
						? messages
						: inbox;
			} else if (event === 'absencesChanged') {
				const daysBack = this.getNodeParameter(
					'daysBack',
					30,
				) as number;
				const absences =
					await provider.getAbsences(
						dateOffsetFromToday(-daysBack),
						dateOffsetFromToday(1),
						-1,
					);

				currentData = absences;
				const entries =
					extractArray(absences, 'absences');
				outputData =
					entries.length > 0
						? entries
						: absences;
			} else {
				throw new NodeOperationError(
					this.getNode(),
					`Unsupported WebUntis trigger event "${event}"`,
				);
			}

			const fingerprint =
				fingerprintWebUntisData(currentData);
			const previous =
				typeof staticData.webUntisFingerprint ===
				'string'
					? staticData.webUntisFingerprint
					: undefined;

			staticData.webUntisFingerprint =
				fingerprint;

			if (this.getMode() === 'manual') {
				return [
					dataAsExecutionItems(outputData),
				];
			}

			if (!previous || previous === fingerprint) {
				return null;
			}

			return [
				dataAsExecutionItems(outputData),
			];
		} catch (error) {
			throw new NodeOperationError(
				this.getNode(),
				safeErrorMessage(error),
			);
		} finally {
			await provider.disconnect();
		}
	}
}
