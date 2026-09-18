/*
 * Die folgenden n8n-Lintregeln gehen von englischen UI-Texten aus.
 * Die sichtbaren Bezeichnungen dieser Node sind bewusst deutsch.
 */
/* eslint-disable n8n-nodes-base/node-param-display-name-miscased */
/* eslint-disable n8n-nodes-base/node-param-operation-option-action-miscased */
/* eslint-disable n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options */
/* eslint-disable n8n-nodes-base/node-param-description-wrong-for-dynamic-options */
/* eslint-disable n8n-nodes-base/node-param-description-boolean-without-whether */

import type { INodeProperties } from 'n8n-workflow';

const simpleOperation = (
	resource: string,
	action: string,
): INodeProperties => ({
	displayName: 'Aktion',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: [resource] } },
	options: [
		{
			name: 'Alle abrufen',
			value: 'getMany',
			action,
		},
	],
	default: 'getMany',
});

export const webUntisProperties: INodeProperties[] = [
	{
		displayName: 'Bereich',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'Abteilung', value: 'departments' },
			{ name: 'Abwesenheit', value: 'absences' },
			{ name: 'Fach', value: 'subjects' },
			{ name: 'Ferien / Feiertage', value: 'holidays' },
			{ name: 'Hausaufgaben', value: 'homework' },
			{ name: 'Klasse', value: 'classes' },
			{ name: 'Klassenarbeit / Prüfung', value: 'exams' },
			{ name: 'Lehrkraft', value: 'teachers' },
			{ name: 'Neuigkeiten', value: 'news' },
			{ name: 'Posteingang', value: 'inbox' },
			{ name: 'Raum', value: 'rooms' },
			{ name: 'Schüler/in', value: 'students' },
			{ name: 'Schuljahr', value: 'schoolYears' },
			{ name: 'Stundenplan', value: 'timetable' },
			{ name: 'System', value: 'system' },
			{ name: 'Zeitraster', value: 'timeGrid' },
		],
		default: 'timetable',
	},

	{
		displayName: 'Aktion',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['timetable'] } },
		options: [
			{
				name: 'Element für Datum abrufen',
				value: 'elementDate',
				action: 'Stundenplan eines Elements für ein Datum abrufen',
			},
			{
				name: 'Element für heute abrufen',
				value: 'elementToday',
				action: 'Stundenplan eines Elements für heute abrufen',
			},
			{
				name: 'Element für Woche abrufen',
				value: 'elementWeek',
				action: 'Stundenplan eines Elements für eine Woche abrufen',
			},
			{
				name: 'Element für Zeitraum abrufen',
				value: 'elementRange',
				action: 'Stundenplan eines Elements für einen Zeitraum abrufen',
			},
			{
				name: 'Meine Klasse für Datum abrufen',
				value: 'ownClassDate',
				action: 'Stundenplan meiner Klasse für ein Datum abrufen',
			},
			{
				name: 'Meine Klasse für Zeitraum abrufen',
				value: 'ownClassRange',
				action: 'Stundenplan meiner Klasse für einen Zeitraum abrufen',
			},
			{
				name: 'Meine Klasse heute abrufen',
				value: 'ownClassToday',
				action: 'Stundenplan meiner Klasse für heute abrufen',
			},
			{
				name: 'Meinen Stundenplan für Datum abrufen',
				value: 'ownDate',
				action: 'Meinen Stundenplan für ein Datum abrufen',
			},
			{
				name: 'Meinen Stundenplan für Woche abrufen',
				value: 'ownWeek',
				action: 'Meinen Stundenplan für eine Woche abrufen',
			},
			{
				name: 'Meinen Stundenplan für Zeitraum abrufen',
				value: 'ownRange',
				action: 'Meinen Stundenplan für einen Zeitraum abrufen',
			},
			{
				name: 'Meinen Stundenplan heute abrufen',
				value: 'ownToday',
				action: 'Meinen Stundenplan für heute abrufen',
			},
		],
		default: 'ownToday',
	},
	{
		displayName: 'Datum',
		name: 'date',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['timetable'],
				operation: [
					'ownDate',
					'ownClassDate',
					'elementDate',
				],
			},
		},
	},
	{
		displayName: 'Startdatum',
		name: 'startDate',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['timetable'],
				operation: [
					'ownRange',
					'ownClassRange',
					'elementRange',
				],
			},
		},
	},
	{
		displayName: 'Enddatum',
		name: 'endDate',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['timetable'],
				operation: [
					'ownRange',
					'ownClassRange',
					'elementRange',
				],
			},
		},
	},
	{
		displayName: 'Datum innerhalb der Woche',
		name: 'weekDate',
		type: 'dateTime',
		required: true,
		default: '',
		description:
			'Ein beliebiges Datum innerhalb der abzurufenden Woche',
		displayOptions: {
			show: {
				resource: ['timetable'],
				operation: ['ownWeek', 'elementWeek'],
			},
		},
	},
	{
		displayName: 'Elementtyp',
		name: 'elementType',
		type: 'options',
		options: [
			{ name: 'Klasse', value: 1 },
			{ name: 'Lehrkraft', value: 2 },
			{ name: 'Fach', value: 3 },
			{ name: 'Raum', value: 4 },
			{ name: 'Schüler/in', value: 5 },
		],
		default: 1,
		displayOptions: {
			show: {
				resource: ['timetable'],
				operation: [
					'elementToday',
					'elementDate',
					'elementRange',
					'elementWeek',
				],
			},
		},
	},
	{
		displayName: 'Element oder ID',
		name: 'elementId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getTimetableElements',
		},
		default: '',
		required: true,
		description:
			'Ein für das angemeldete WebUntis-Konto sichtbares Element. Aus der Liste wählen oder eine ID per Expression angeben.',
		displayOptions: {
			show: {
				resource: ['timetable'],
				operation: [
					'elementToday',
					'elementDate',
					'elementRange',
					'elementWeek',
				],
				elementType: [1, 3, 4, 5],
			},
		},
	},
	{
		displayName: 'Lehrer-ID',
		name: 'teacherId',
		type: 'number',
		default: 0,
		required: true,
		description:
			'WebUntis-ID der Lehrkraft. Für Konten ohne Berechtigung auf die komplette Lehrerliste kann die bekannte Lehrer-ID hier manuell eingetragen werden.',
		displayOptions: {
			show: {
				resource: ['timetable'],
				operation: [
					'elementToday',
					'elementDate',
					'elementRange',
					'elementWeek',
				],
				elementType: [2],
			},
		},
	},
	{
		displayName: 'Wochenformat',
		name: 'formatId',
		type: 'options',
		options: [
			{
				name: 'Lehrkräfte einschließen',
				value: 1,
			},
			{
				name: 'Lehrkräfte auslassen',
				value: 2,
			},
		],
		default: 1,
		displayOptions: {
			show: {
				resource: ['timetable'],
				operation: ['ownWeek', 'elementWeek'],
			},
		},
	},
	{
		displayName: 'Rohdaten mit ausgeben',
		name: 'returnRawData',
		type: 'boolean',
		default: false,
		description:
			'Zusätzlich zum normalisierten Stundenplaneintrag auch die originalen WebUntis-Rohdaten ausgeben',
		displayOptions: {
			show: {
				resource: ['timetable'],
				operation: [
					'ownToday',
					'ownDate',
					'ownRange',
					'ownClassToday',
					'ownClassDate',
					'ownClassRange',
					'elementToday',
					'elementDate',
					'elementRange',
				],
			},
		},
	},

	simpleOperation('classes', 'Klassen abrufen'),
	{
		displayName: 'Schuljahr-ID',
		name: 'schoolYearId',
		type: 'number',
		default: 0,
		description:
			'Optionale WebUntis-Schuljahr-ID. Mit 0 verwendet WebUntis das Standardschuljahr.',
		displayOptions: { show: { resource: ['classes'] } },
	},
	simpleOperation('teachers', 'Lehrkräfte abrufen'),
	simpleOperation('students', 'Schüler abrufen'),
	simpleOperation('subjects', 'Fächer abrufen'),
	simpleOperation('rooms', 'Räume abrufen'),
	simpleOperation('departments', 'Abteilungen abrufen'),
	simpleOperation('holidays', 'Ferien und Feiertage abrufen'),
	simpleOperation('timeGrid', 'Zeitraster abrufen'),

	{
		displayName: 'Aktion',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['schoolYears'] } },
		options: [
			{
				name: 'Alle abrufen',
				value: 'getMany',
				action: 'Schuljahre abrufen',
			},
			{
				name: 'Aktuelles abrufen',
				value: 'getCurrent',
				action: 'Aktuelles Schuljahr abrufen',
			},
			{
				name: 'Neuestes abrufen',
				value: 'getLatest',
				action: 'Neuestes Schuljahr abrufen',
			},
		],
		default: 'getMany',
	},

	{
		displayName: 'Aktion',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['exams'] } },
		options: [
			{
				name: 'Zeitraum abrufen',
				value: 'getRange',
				action: 'Klassenarbeiten und Prüfungen für einen Zeitraum abrufen',
			},
		],
		default: 'getRange',
	},
	{
		displayName: 'Startdatum',
		name: 'startDate',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['exams'] },
		},
	},
	{
		displayName: 'Enddatum',
		name: 'endDate',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['exams'] },
		},
	},
	{
		displayName: 'Klasse oder ID',
		name: 'classId',
		type: 'options',
		description: 'Aus der Liste wählen oder eine Klassen-ID per Expression angeben',
		typeOptions: {
			loadOptionsMethod: 'getClassesForExam',
		},
		default: -1,
		displayOptions: {
			show: { resource: ['exams'] },
		},
	},
	{
		displayName: 'Noten einschließen',
		name: 'withGrades',
		type: 'boolean',
		default: false,
		description:
			'WebUntis-Noteninformationen einbeziehen, sofern das Konto dazu berechtigt ist',
		displayOptions: {
			show: { resource: ['exams'] },
		},
	},

	{
		displayName: 'Aktion',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['homework'] } },
		options: [
			{
				name: 'Hausaufgaben abrufen',
				value: 'getRange',
				action: 'Hausaufgaben für einen Zeitraum abrufen',
			},
			{
				name: 'Hausaufgaben und Unterricht abrufen',
				value: 'getWithLessons',
				action: 'Hausaufgaben und Unterricht für einen Zeitraum abrufen',
			},
		],
		default: 'getRange',
	},
	{
		displayName: 'Startdatum',
		name: 'startDate',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['homework'] },
		},
	},
	{
		displayName: 'Enddatum',
		name: 'endDate',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['homework'] },
		},
	},

	{
		displayName: 'Aktion',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['absences'] } },
		options: [
			{
				name: 'Abwesenheiten abrufen',
				value: 'getRange',
				action: 'Abwesenheiten für einen Zeitraum abrufen',
			},
			{
				name: 'PDF-URL abrufen',
				value: 'getPdf',
				action: 'PDF-URL für Abwesenheiten abrufen',
				description:
					'Gibt eine temporäre WebUntis-Berichts-URL zurück. Diese Ausgabe ist sensibel.',
			},
		],
		default: 'getRange',
	},
	{
		displayName: 'Startdatum',
		name: 'startDate',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['absences'] },
		},
	},
	{
		displayName: 'Enddatum',
		name: 'endDate',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['absences'] },
		},
	},
	{
		displayName: 'Schüler-ID',
		name: 'studentId',
		type: 'number',
		default: 0,
		description:
			'Optional: WebUntis-Schüler-ID, z. B. bei Elternkonten. Bei 0 wird die angemeldete Person verwendet.',
		displayOptions: {
			show: { resource: ['absences'] },
		},
	},
	{
		displayName: 'Entschuldigungsstatus-ID',
		name: 'excuseStatusId',
		type: 'number',
		default: -1,
		description:
			'Mit -1 werden alle Entschuldigungsstatus berücksichtigt',
		displayOptions: {
			show: { resource: ['absences'] },
		},
	},
	{
		displayName: 'Verspätungen einschließen',
		name: 'lateness',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: {
				resource: ['absences'],
				operation: ['getPdf'],
			},
		},
	},
	{
		displayName: 'Abwesenheiten einschließen',
		name: 'includeAbsences',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: {
				resource: ['absences'],
				operation: ['getPdf'],
			},
		},
	},
	{
		displayName: 'Entschuldigungsgruppe',
		name: 'excuseGroup',
		type: 'number',
		default: 2,
		displayOptions: {
			show: {
				resource: ['absences'],
				operation: ['getPdf'],
			},
		},
	},

	{
		displayName: 'Aktion',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['inbox'] } },
		options: [
			{
				name: 'Nachrichten abrufen',
				value: 'getMessages',
				action: 'Nachrichten aus dem Posteingang abrufen',
			},
		],
		default: 'getMessages',
	},

	{
		displayName: 'Aktion',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['news'] } },
		options: [
			{
				name: 'Widget abrufen',
				value: 'getWidget',
				action: 'Neuigkeiten-Widget abrufen',
			},
			{
				name: 'Nachrichten des Tages abrufen',
				value: 'getMessages',
				action: 'Nachrichten des Tages abrufen',
			},
		],
		default: 'getWidget',
	},
	{
		displayName: 'Datum',
		name: 'date',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['news'] },
		},
	},

	{
		displayName: 'Aktion',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['system'] } },
		options: [
			{
				name: 'Benutzerinformationen abrufen',
				value: 'getUserInformation',
				action: 'Benutzerinformationen abrufen',
			},
			{
				name: 'Letzte Importzeit abrufen',
				value: 'getLatestImportTime',
				action: 'Letzte Importzeit abrufen',
			},
			{
				name: 'Statusdaten abrufen',
				value: 'getStatusData',
				action: 'Statusdaten abrufen',
			},
			{
				name: 'Sitzung prüfen',
				value: 'validateSession',
				action: 'WebUntis-Sitzung prüfen',
			},
		],
		default: 'getUserInformation',
	},
];
