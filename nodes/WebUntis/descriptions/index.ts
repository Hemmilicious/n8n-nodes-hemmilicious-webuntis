import type { INodeProperties } from 'n8n-workflow';

const simpleOperation = (
	resource: string,
	action: string,
): INodeProperties => ({
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: [resource] } },
	options: [
		{
			name: 'Get Many',
			value: 'getMany',
			action,
		},
	],
	default: 'getMany',
});

export const webUntisProperties: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'Absence', value: 'absences' },
			{ name: 'Class', value: 'classes' },
			{ name: 'Department', value: 'departments' },
			{ name: 'Exam', value: 'exams' },
			{ name: 'Holiday', value: 'holidays' },
			{ name: 'Homework', value: 'homework' },
			{ name: 'Inbox', value: 'inbox' },
			{ name: 'News', value: 'news' },
			{ name: 'Room', value: 'rooms' },
			{ name: 'School Year', value: 'schoolYears' },
			{ name: 'Student', value: 'students' },
			{ name: 'Subject', value: 'subjects' },
			{ name: 'System', value: 'system' },
			{ name: 'Teacher', value: 'teachers' },
			{ name: 'Time Grid', value: 'timeGrid' },
			{ name: 'Timetable', value: 'timetable' },
		],
		default: 'timetable',
	},

	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['timetable'] } },
		options: [
			{
				name: 'Get Element for Date',
				value: 'elementDate',
				action: 'Get an element timetable for a date',
			},
			{
				name: 'Get Element for Range',
				value: 'elementRange',
				action: 'Get an element timetable for a date range',
			},
			{
				name: 'Get Element for Week',
				value: 'elementWeek',
				action: 'Get an element timetable for a week',
			},
			{
				name: 'Get Element Today',
				value: 'elementToday',
				action: 'Get an element timetable today',
			},
			{
				name: 'Get My Class for Date',
				value: 'ownClassDate',
				action: 'Get my class timetable for a date',
			},
			{
				name: 'Get My Class for Range',
				value: 'ownClassRange',
				action: 'Get my class timetable for a date range',
			},
			{
				name: 'Get My Class Today',
				value: 'ownClassToday',
				action: 'Get my class timetable today',
			},
			{
				name: 'Get My Timetable for Date',
				value: 'ownDate',
				action: 'Get my timetable for a date',
			},
			{
				name: 'Get My Timetable for Range',
				value: 'ownRange',
				action: 'Get my timetable for a date range',
			},
			{
				name: 'Get My Timetable for Week',
				value: 'ownWeek',
				action: 'Get my timetable for a week',
			},
			{
				name: 'Get My Timetable Today',
				value: 'ownToday',
				action: 'Get my timetable today',
			},
		],
		default: 'ownToday',
	},
	{
		displayName: 'Date',
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
		displayName: 'Start Date',
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
		displayName: 'End Date',
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
		displayName: 'Week Date',
		name: 'weekDate',
		type: 'dateTime',
		required: true,
		default: '',
		description:
			'Any date inside the week to retrieve',
		displayOptions: {
			show: {
				resource: ['timetable'],
				operation: ['ownWeek', 'elementWeek'],
			},
		},
	},
	{
		displayName: 'Element Type',
		name: 'elementType',
		type: 'options',
		options: [
			{ name: 'Class', value: 1 },
			{ name: 'Teacher', value: 2 },
			{ name: 'Subject', value: 3 },
			{ name: 'Room', value: 4 },
			{ name: 'Student', value: 5 },
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
		displayName: 'Element Name or ID',
		name: 'elementId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getTimetableElements',
		},
		default: '',
		required: true,
		description: 'Element visible to the authenticated WebUntis account. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
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
		displayName: 'Weekly Format',
		name: 'formatId',
		type: 'options',
		options: [
			{
				name: 'Include Teachers',
				value: 1,
			},
			{
				name: 'Omit Teachers',
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
		displayName: 'Return Raw Data',
		name: 'returnRawData',
		type: 'boolean',
		default: false,
		description:
			'Whether to include the original WebUntis lesson object with normalized classic timetable entries',
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

	simpleOperation('classes', 'Get classes'),
	{
		displayName: 'School Year ID',
		name: 'schoolYearId',
		type: 'number',
		default: 0,
		description:
			'Optional WebUntis school year ID. Use 0 to let WebUntis use its default.',
		displayOptions: { show: { resource: ['classes'] } },
	},
	simpleOperation('teachers', 'Get teachers'),
	simpleOperation('students', 'Get students'),
	simpleOperation('subjects', 'Get subjects'),
	simpleOperation('rooms', 'Get rooms'),
	simpleOperation('departments', 'Get departments'),
	simpleOperation('holidays', 'Get holidays'),
	simpleOperation('timeGrid', 'Get time grid'),

	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['schoolYears'] } },
		options: [
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get school years',
			},
			{
				name: 'Get Current',
				value: 'getCurrent',
				action: 'Get current school year',
			},
			{
				name: 'Get Latest',
				value: 'getLatest',
				action: 'Get latest school year',
			},
		],
		default: 'getMany',
	},

	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['exams'] } },
		options: [
			{
				name: 'Get Range',
				value: 'getRange',
				action: 'Get exams for a date range',
			},
		],
		default: 'getRange',
	},
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['exams'] },
		},
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['exams'] },
		},
	},
	{
		displayName: 'Class Name or ID',
		name: 'classId',
		type: 'options',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: {
			loadOptionsMethod: 'getClassesForExam',
		},
		default: -1,
		displayOptions: {
			show: { resource: ['exams'] },
		},
	},
	{
		displayName: 'Include Grades',
		name: 'withGrades',
		type: 'boolean',
		default: false,
		description:
			'Whether WebUntis should include grade information when the account has permission',
		displayOptions: {
			show: { resource: ['exams'] },
		},
	},

	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['homework'] } },
		options: [
			{
				name: 'Get Homework',
				value: 'getRange',
				action: 'Get homework for a date range',
			},
			{
				name: 'Get Homework and Lessons',
				value: 'getWithLessons',
				action: 'Get homework and lessons for a date range',
			},
		],
		default: 'getRange',
	},
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['homework'] },
		},
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['homework'] },
		},
	},

	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['absences'] } },
		options: [
			{
				name: 'Get Absence Data',
				value: 'getRange',
				action: 'Get absence data for a date range',
			},
			{
				name: 'Get PDF URL',
				value: 'getPdf',
				action: 'Get an absence PDF URL',
				description:
					'Returns an ephemeral WebUntis report URL. Treat this output as sensitive.',
			},
		],
		default: 'getRange',
	},
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['absences'] },
		},
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['absences'] },
		},
	},
	{
		displayName: 'Excuse Status ID',
		name: 'excuseStatusId',
		type: 'number',
		default: -1,
		description:
			'Use -1 for all excuse statuses',
		displayOptions: {
			show: { resource: ['absences'] },
		},
	},
	{
		displayName: 'Include Lateness',
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
		displayName: 'Include Absences',
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
		displayName: 'Excuse Group',
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
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['inbox'] } },
		options: [
			{
				name: 'Get Messages',
				value: 'getMessages',
				action: 'Get inbox messages',
			},
		],
		default: 'getMessages',
	},

	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['news'] } },
		options: [
			{
				name: 'Get Widget',
				value: 'getWidget',
				action: 'Get news widget',
			},
			{
				name: 'Get Messages of Day',
				value: 'getMessages',
				action: 'Get messages of the day',
			},
		],
		default: 'getWidget',
	},
	{
		displayName: 'Date',
		name: 'date',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['news'] },
		},
	},

	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['system'] } },
		options: [
			{
				name: 'Get User Information',
				value: 'getUserInformation',
				action: 'Get user information',
			},
			{
				name: 'Get Latest Import Time',
				value: 'getLatestImportTime',
				action: 'Get latest import time',
			},
			{
				name: 'Get Status Data',
				value: 'getStatusData',
				action: 'Get status data',
			},
			{
				name: 'Validate Session',
				value: 'validateSession',
				action: 'Validate the web untis session',
			},
		],
		default: 'getUserInformation',
	},
];
