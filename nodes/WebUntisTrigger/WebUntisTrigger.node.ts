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
			'Startet Automationen im Schul- & Familien-OS, wenn sich ausgewählte WebUntis-Daten ändern',
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
				displayName: 'Ereignis',
				name: 'event',
				type: 'options',
				options: [
					{
						name: 'Abwesenheiten geändert',
						value: 'absencesChanged',
					},
					{
						name: 'Klassenarbeiten / Prüfungen geändert',
						value: 'examsChanged',
					},
					{
						name: 'Hausaufgaben geändert',
						value: 'homeworkChanged',
					},
					{
						name: 'Posteingang geändert',
						value: 'inboxChanged',
					},
					{
						name: 'Stundenplan geändert',
						value: 'timetableChanged',
					},
					{
						name: 'WebUntis-Daten aktualisiert',
						value: 'dataUpdated',
						description:
							'Startet, wenn sich der letzte WebUntis-Importzeitpunkt ändert',
					},
				],
				default: 'dataUpdated',
				required: true,
			},
			{
				displayName: 'Schüler-ID',
				name: 'studentId',
				type: 'number',
				typeOptions: {
					minValue: 0,
				},
				default: 0,
				description:
					'Optional: WebUntis-Schüler-ID für Elternkonten. Bei 0 wird der angemeldete Benutzer verwendet.',
				displayOptions: {
					show: {
						event: [
							'timetableChanged',
							'absencesChanged',
						],
					},
				},
			},
			{
				displayName: 'Klassen-ID',
				name: 'classId',
				type: 'number',
				default: -1,
				description:
					'WebUntis-Klassen-ID für die Prüfung auf Änderungen bei Klassenarbeiten. Mit -1 wird keine bestimmte Klasse erzwungen.',
				displayOptions: {
					show: {
						event: ['examsChanged'],
					},
				},
			},
			{
				displayName: 'Tage voraus',
				name: 'daysAhead',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 365,
				},
				default: 14,
				description:
					'Wie viele Tage im Voraus bei Stundenplan, Hausaufgaben und Klassenarbeiten geprüft werden sollen',
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
				displayName: 'Tage zurück',
				name: 'daysBack',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 365,
				},
				default: 30,
				description:
					'Wie viele Tage rückwirkend bei Abwesenheiten geprüft werden sollen',
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
							message: 'WebUntis-Zugangsdaten fehlen',
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
						message: 'Verbindung erfolgreich.',
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
				const studentId = Number(
					this.getNodeParameter(
						'studentId',
						0,
					),
				);
				const timetable =
					studentId > 0
						? await provider.getTimetableForRange(
								dateOffsetFromToday(0),
								dateOffsetFromToday(daysAhead),
								studentId,
								5,
							)
						: await provider.getOwnTimetableForRange(
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
				const classId = Number(
					this.getNodeParameter(
						'classId',
						-1,
					),
				);
				const exams = await provider.getExams(
					dateOffsetFromToday(0),
					dateOffsetFromToday(daysAhead),
					classId,
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
				const studentId = Number(
					this.getNodeParameter(
						'studentId',
						0,
					),
				);
				const absences =
					await provider.getAbsences(
						dateOffsetFromToday(-daysBack),
						dateOffsetFromToday(1),
						-1,
						studentId > 0
							? studentId
							: undefined,
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
					`Nicht unterstütztes WebUntis-Trigger-Ereignis "${event}"`,
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
