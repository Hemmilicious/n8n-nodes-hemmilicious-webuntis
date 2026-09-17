import type {
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class WebUntisApi implements ICredentialType {
	name = 'webUntisApi';

	displayName = 'WebUntis API';

	icon: Icon = 'file:../nodes/WebUntis/Untis.svg';

	documentationUrl =
		'https://www.npmjs.com/package/n8n-nodes-hemmilicious-webuntis';

	properties: INodeProperties[] = [
		{
			displayName: 'Configuration',
			name: 'configurationMode',
			type: 'options',
			options: [
				{
					name: 'Manual',
					value: 'manual',
				},
				{
					name: 'Untis QR URL',
					value: 'qrUrl',
				},
			],
			default: 'manual',
			description:
				'Choose whether to enter the WebUntis connection details manually or use an Untis QR URL',
		},
		{
			displayName: 'Server',
			name: 'server',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'demo.webuntis.com',
			description: 'WebUntis server hostname without protocol',
			displayOptions: {
				show: {
					configurationMode: ['manual'],
				},
			},
		},
		{
			displayName: 'School',
			name: 'school',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'demo-school',
			description: 'WebUntis school identifier',
			displayOptions: {
				show: {
					configurationMode: ['manual'],
				},
			},
		},
		{
			displayName: 'School Number',
			name: 'schoolNumber',
			type: 'string',
			default: '',
			required: true,
			placeholder: '1234567',
			description:
				'WebUntis school number. Stored as text to preserve the exact value.',
			displayOptions: {
				show: {
					configurationMode: ['manual'],
				},
			},
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'demo-user',
			displayOptions: {
				show: {
					configurationMode: ['manual'],
				},
			},
		},
		{
			displayName: 'Secret Key',
			name: 'secret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			placeholder: 'FAKE_SECRET',
			description:
				'Secret from the WebUntis mobile/QR configuration. This is not a normal WebUntis password.',
			displayOptions: {
				show: {
					configurationMode: ['manual'],
				},
			},
		},
		{
			displayName: 'Untis QR URL',
			name: 'qrUrl',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			placeholder:
				'untis://setschool?url=...&school=...&user=...&key=...&schoolNumber=...',
			description:
				'Sensitive Untis mobile configuration URL containing the secret authentication key',
			displayOptions: {
				show: {
					configurationMode: ['qrUrl'],
				},
			},
		},
	];
}
