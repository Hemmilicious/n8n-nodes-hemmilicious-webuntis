import type {
	ICredentialDataDecryptedObject,
	ICredentialsDecrypted,
	ICredentialTestFunctions,
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeCredentialTestResult,
	INodeExecutionData,
	INodePropertyOptions,
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
import { extractArray, toDataObject } from '../../src/utils/json';
import { webUntisProperties } from './descriptions';

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

function assertDateRange(
	node: ReturnType<IExecuteFunctions['getNode']>,
	startDate: Date,
	endDate: Date,
	itemIndex: number,
): void {
	if (startDate.getTime() > endDate.getTime()) {
		throw new NodeOperationError(
			node,
			'Start Date must not be after End Date',
			{ itemIndex },
		);
	}
}

function optionName(value: unknown): string {
	if (typeof value !== 'object' || value === null) {
		return 'Unknown';
	}

	const record = value as Record<string, unknown>;
	const candidates = [
		record.longName,
		record.longname,
		record.displayName,
		record.foreName && record.name
			? `${record.foreName} ${record.name}`
			: undefined,
		record.name,
		record.id,
	];

	for (const candidate of candidates) {
		if (
			typeof candidate === 'string' &&
			candidate.trim()
		) {
			return candidate.trim();
		}

		if (typeof candidate === 'number') {
			return String(candidate);
		}
	}

	return 'Unknown';
}

function optionsFromRecords(
	values: unknown[],
): INodePropertyOptions[] {
	return values
		.flatMap((value) => {
			if (typeof value !== 'object' || value === null) {
				return [];
			}

			const id = (value as Record<string, unknown>).id;

			if (typeof id !== 'number') {
				return [];
			}

			return [{
				name: optionName(value),
				value: id,
			}];
		})
		.sort((a, b) => a.name.localeCompare(b.name));
}

async function createLoadOptionsProvider(
	context: ILoadOptionsFunctions,
): Promise<WebUntisLegacyProvider> {
	const credentials =
		await context.getCredentials('webUntisApi');
	const resolved =
		resolveWebUntisCredentials(credentials);
	const auth = new WebUntisAuth(resolved);
	const client = new WebUntisClient(auth);

	return new WebUntisLegacyProvider(client);
}

export class WebUntis implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'WebUntis',
		name: 'webUntis',
		icon: 'file:Untis.svg',
		group: ['input'],
		version: 2,
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
		properties: webUntisProperties,
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
		loadOptions: {
			async getTimetableElements(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				const provider =
					await createLoadOptionsProvider(this);

				try {
					await provider.connect();
					const elementType = Number(
						this.getCurrentNodeParameter(
							'elementType',
						),
					);

					let values: unknown[];

					switch (elementType) {
						case 1:
							values = await provider.getClasses();
							break;
						case 2:
							values = await provider.getTeachers();
							break;
						case 3:
							values = await provider.getSubjects();
							break;
						case 4:
							values = await provider.getRooms();
							break;
						case 5:
							values = await provider.getStudents();
							break;
						default:
							values = [];
					}

					return optionsFromRecords(values);
				} finally {
					await provider.disconnect();
				}
			},

			async getClassesForExam(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				const provider =
					await createLoadOptionsProvider(this);

				try {
					await provider.connect();
					const values = await provider.getClasses();

					return [
						{
							name: 'All Classes',
							value: -1,
						},
						...optionsFromRecords(values),
					];
				} finally {
					await provider.disconnect();
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

		const pushValue = (
			value: unknown,
			itemIndex: number,
		): void => {
			if (Array.isArray(value)) {
				for (const entry of value) {
					outputItems.push({
						json: toDataObject(entry),
						pairedItem: { item: itemIndex },
					});
				}
				return;
			}

			outputItems.push({
				json: toDataObject(value),
				pairedItem: { item: itemIndex },
			});
		};

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

				if (resource === 'system') {
					if (operation === 'getUserInformation') {
						pushValue(
							userInformationToJson(
								await provider.getUserInformation(),
							),
							itemIndex,
						);
					} else if (
						operation === 'getLatestImportTime'
					) {
						pushValue(
							{
								latestImportTime:
									await provider.getLatestImportTime(),
							},
							itemIndex,
						);
					} else if (
						operation === 'getStatusData'
					) {
						pushValue(
							await provider.getStatusData(),
							itemIndex,
						);
					} else if (
						operation === 'validateSession'
					) {
						pushValue(
							{
								valid:
									await provider.validateSession(),
							},
							itemIndex,
						);
					} else {
						throw new NodeOperationError(
							this.getNode(),
							'Unsupported system operation',
							{ itemIndex },
						);
					}

					continue;
				}

				if (resource === 'timetable') {
					const returnRawData =
						this.getNodeParameter(
							'returnRawData',
							itemIndex,
							false,
						) as boolean;

					let lessons: unknown[];
					let weekly = false;

					if (operation === 'ownToday') {
						lessons =
							await provider.getOwnTimetableForToday();
					} else if (operation === 'ownDate') {
						const date =
							parseWebUntisDateParameter(
								this.getNodeParameter(
									'date',
									itemIndex,
								) as string,
								'Date',
							);
						lessons =
							await provider.getOwnTimetableForDate(
								date,
							);
					} else if (operation === 'ownRange') {
						const startDate =
							parseWebUntisDateParameter(
								this.getNodeParameter(
									'startDate',
									itemIndex,
								) as string,
								'Start Date',
							);
						const endDate =
							parseWebUntisDateParameter(
								this.getNodeParameter(
									'endDate',
									itemIndex,
								) as string,
								'End Date',
							);

						assertDateRange(
							this.getNode(),
							startDate,
							endDate,
							itemIndex,
						);

						lessons =
							await provider.getOwnTimetableForRange(
								startDate,
								endDate,
							);
					} else if (operation === 'ownWeek') {
						const weekDate =
							parseWebUntisDateParameter(
								this.getNodeParameter(
									'weekDate',
									itemIndex,
								) as string,
								'Week Date',
							);
						const formatId = this.getNodeParameter(
							'formatId',
							itemIndex,
							1,
						) as number;

						weekly = true;
						lessons =
							await provider.getOwnTimetableForWeek(
								weekDate,
								formatId,
							);
					} else if (
						operation === 'ownClassToday'
					) {
						lessons =
							await provider.getOwnClassTimetableForToday();
					} else if (
						operation === 'ownClassDate'
					) {
						const date =
							parseWebUntisDateParameter(
								this.getNodeParameter(
									'date',
									itemIndex,
								) as string,
								'Date',
							);
						lessons =
							await provider.getOwnClassTimetableForDate(
								date,
							);
					} else if (
						operation === 'ownClassRange'
					) {
						const startDate =
							parseWebUntisDateParameter(
								this.getNodeParameter(
									'startDate',
									itemIndex,
								) as string,
								'Start Date',
							);
						const endDate =
							parseWebUntisDateParameter(
								this.getNodeParameter(
									'endDate',
									itemIndex,
								) as string,
								'End Date',
							);

						assertDateRange(
							this.getNode(),
							startDate,
							endDate,
							itemIndex,
						);

						lessons =
							await provider.getOwnClassTimetableForRange(
								startDate,
								endDate,
							);
					} else {
						const elementId = Number(
							this.getNodeParameter(
								'elementId',
								itemIndex,
							),
						);
						const elementType = Number(
							this.getNodeParameter(
								'elementType',
								itemIndex,
							),
						);

						if (operation === 'elementToday') {
							lessons =
								await provider.getTimetableForToday(
									elementId,
									elementType,
								);
						} else if (
							operation === 'elementDate'
						) {
							const date =
								parseWebUntisDateParameter(
									this.getNodeParameter(
										'date',
										itemIndex,
									) as string,
									'Date',
								);
							lessons =
								await provider.getTimetableForDate(
									date,
									elementId,
									elementType,
								);
						} else if (
							operation === 'elementRange'
						) {
							const startDate =
								parseWebUntisDateParameter(
									this.getNodeParameter(
										'startDate',
										itemIndex,
									) as string,
									'Start Date',
								);
							const endDate =
								parseWebUntisDateParameter(
									this.getNodeParameter(
										'endDate',
										itemIndex,
									) as string,
									'End Date',
								);

							assertDateRange(
								this.getNode(),
								startDate,
								endDate,
								itemIndex,
							);

							lessons =
								await provider.getTimetableForRange(
									startDate,
									endDate,
									elementId,
									elementType,
								);
						} else if (
							operation === 'elementWeek'
						) {
							const weekDate =
								parseWebUntisDateParameter(
									this.getNodeParameter(
										'weekDate',
										itemIndex,
									) as string,
									'Week Date',
								);
							const formatId =
								this.getNodeParameter(
									'formatId',
									itemIndex,
									1,
								) as number;

							weekly = true;
							lessons =
								await provider.getTimetableForWeek(
									weekDate,
									elementId,
									elementType,
									formatId,
								);
						} else {
							throw new NodeOperationError(
								this.getNode(),
								'Unsupported timetable operation',
								{ itemIndex },
							);
						}
					}

					if (weekly) {
						pushValue(lessons, itemIndex);
					} else {
						for (const lesson of lessons) {
							pushValue(
								normalizeTimetableLesson(
									lesson,
									returnRawData,
								),
								itemIndex,
							);
						}
					}

					continue;
				}

				if (resource === 'classes') {
					const schoolYearId =
						this.getNodeParameter(
							'schoolYearId',
							itemIndex,
							0,
						) as number;

					pushValue(
						await provider.getClasses(
							schoolYearId > 0
								? schoolYearId
								: undefined,
						),
						itemIndex,
					);
					continue;
				}

				if (resource === 'teachers') {
					pushValue(
						await provider.getTeachers(),
						itemIndex,
					);
					continue;
				}

				if (resource === 'students') {
					pushValue(
						await provider.getStudents(),
						itemIndex,
					);
					continue;
				}

				if (resource === 'subjects') {
					pushValue(
						await provider.getSubjects(),
						itemIndex,
					);
					continue;
				}

				if (resource === 'rooms') {
					pushValue(
						await provider.getRooms(),
						itemIndex,
					);
					continue;
				}

				if (resource === 'departments') {
					pushValue(
						await provider.getDepartments(),
						itemIndex,
					);
					continue;
				}

				if (resource === 'schoolYears') {
					if (operation === 'getMany') {
						pushValue(
							await provider.getSchoolYears(),
							itemIndex,
						);
					} else if (
						operation === 'getCurrent'
					) {
						pushValue(
							await provider.getCurrentSchoolYear(),
							itemIndex,
						);
					} else if (
						operation === 'getLatest'
					) {
						pushValue(
							await provider.getLatestSchoolYear(),
							itemIndex,
						);
					}

					continue;
				}

				if (resource === 'holidays') {
					pushValue(
						await provider.getHolidays(),
						itemIndex,
					);
					continue;
				}

				if (resource === 'timeGrid') {
					pushValue(
						await provider.getTimeGrid(),
						itemIndex,
					);
					continue;
				}

				if (resource === 'exams') {
					const startDate =
						parseWebUntisDateParameter(
							this.getNodeParameter(
								'startDate',
								itemIndex,
							) as string,
							'Start Date',
						);
					const endDate =
						parseWebUntisDateParameter(
							this.getNodeParameter(
								'endDate',
								itemIndex,
							) as string,
							'End Date',
						);

					assertDateRange(
						this.getNode(),
						startDate,
						endDate,
						itemIndex,
					);

					const classId = Number(
						this.getNodeParameter(
							'classId',
							itemIndex,
							-1,
						),
					);
					const withGrades =
						this.getNodeParameter(
							'withGrades',
							itemIndex,
							false,
						) as boolean;

					pushValue(
						await provider.getExams(
							startDate,
							endDate,
							classId,
							withGrades,
						),
						itemIndex,
					);
					continue;
				}

				if (resource === 'homework') {
					const startDate =
						parseWebUntisDateParameter(
							this.getNodeParameter(
								'startDate',
								itemIndex,
							) as string,
							'Start Date',
						);
					const endDate =
						parseWebUntisDateParameter(
							this.getNodeParameter(
								'endDate',
								itemIndex,
							) as string,
							'End Date',
						);

					assertDateRange(
						this.getNode(),
						startDate,
						endDate,
						itemIndex,
					);

					if (operation === 'getWithLessons') {
						pushValue(
							await provider.getHomeworkAndLessons(
								startDate,
								endDate,
							),
							itemIndex,
						);
					} else {
						const data =
							await provider.getHomeworks(
								startDate,
								endDate,
							);
						const homeworks =
							extractArray(data, 'homeworks');

						pushValue(
							homeworks.length > 0
								? homeworks
								: data,
							itemIndex,
						);
					}

					continue;
				}

				if (resource === 'absences') {
					const startDate =
						parseWebUntisDateParameter(
							this.getNodeParameter(
								'startDate',
								itemIndex,
							) as string,
							'Start Date',
						);
					const endDate =
						parseWebUntisDateParameter(
							this.getNodeParameter(
								'endDate',
								itemIndex,
							) as string,
							'End Date',
						);

					assertDateRange(
						this.getNode(),
						startDate,
						endDate,
						itemIndex,
					);

					const excuseStatusId =
						this.getNodeParameter(
							'excuseStatusId',
							itemIndex,
							-1,
						) as number;

					if (operation === 'getPdf') {
						const url =
							await provider.getAbsencePdf(
								startDate,
								endDate,
								excuseStatusId,
								this.getNodeParameter(
									'lateness',
									itemIndex,
									true,
								) as boolean,
								this.getNodeParameter(
									'includeAbsences',
									itemIndex,
									true,
								) as boolean,
								this.getNodeParameter(
									'excuseGroup',
									itemIndex,
									2,
								) as number,
							);

						pushValue(
							{
								url,
								sensitive:
									true,
								note:
									'Treat this ephemeral WebUntis report URL as sensitive.',
							},
							itemIndex,
						);
					} else {
						pushValue(
							await provider.getAbsences(
								startDate,
								endDate,
								excuseStatusId,
							),
							itemIndex,
						);
					}

					continue;
				}

				if (resource === 'inbox') {
					const data = await provider.getInbox();
					const messages =
						extractArray(
							data,
							'incomingMessages',
						);

					pushValue(
						messages.length > 0
							? messages
							: data,
						itemIndex,
					);
					continue;
				}

				if (resource === 'news') {
					const date =
						parseWebUntisDateParameter(
							this.getNodeParameter(
								'date',
								itemIndex,
							) as string,
							'Date',
						);
					const data = await provider.getNews(date);

					if (operation === 'getMessages') {
						const messages =
							extractArray(
								data,
								'messagesOfDay',
							);

						pushValue(
							messages.length > 0
								? messages
								: [],
							itemIndex,
						);
					} else {
						pushValue(data, itemIndex);
					}

					continue;
				}

				throw new NodeOperationError(
					this.getNode(),
					`Unsupported WebUntis resource "${resource}"`,
					{ itemIndex },
				);
			}

			return [outputItems];
		} finally {
			await provider.disconnect();
		}
	}
}
