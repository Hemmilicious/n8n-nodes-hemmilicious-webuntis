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
			displayName: 'Authentication',
			name: 'configurationMode',
			type: 'options',
			options: [
				{
					name: 'Secret Key (Manual)',
					value: 'manual',
					description:
						'Use the WebUntis mobile/QR secret key. This keeps compatibility with credentials created with version 0.1.0.',
				},
				{
					name: 'Username + Password',
					value: 'password',
					description:
						'Use the normal WebUntis username and password login',
				},
				{
					name: 'Untis QR URL',
					value: 'qrUrl',
					description:
						'Use the complete untis://setschool?... value from WebUntis',
				},
			],
			default: 'manual',
		},
		{
			displayName: 'Server',
			name: 'server',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'demo.webuntis.com',
			description:
				'WebUntis server hostname without https://',
			displayOptions: {
				show: {
					configurationMode: ['manual', 'password'],
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
			description:
				'WebUntis school identifier/login name',
			displayOptions: {
				show: {
					configurationMode: ['manual', 'password'],
				},
			},
		},
		{
			displayName: 'School Number',
			name: 'schoolNumber',
			type: 'string',
			default: '',
			required: false,
			placeholder: '1234567',
			description:
				'Optional school number from the mobile configuration. It is stored for completeness but is not required by the webuntis login constructor.',
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
					configurationMode: ['manual', 'password'],
				},
			},
		},
		{
			displayName: 'Secret Key',
			name: 'secret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			placeholder: 'FAKE_SECRET',
			description:
				'Secret key from the WebUntis mobile/QR setup. This is not the normal WebUntis password.',
			displayOptions: {
				show: {
					configurationMode: ['manual'],
				},
			},
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Normal WebUntis password. Stored only in the n8n Credential system.',
			displayOptions: {
				show: {
					configurationMode: ['password'],
				},
			},
		},
		{
			displayName: 'Untis QR URL',
			name: 'qrUrl',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			placeholder:
				'untis://setschool?url=...&school=...&user=...&key=...&schoolNumber=...',
			description:
				'Sensitive mobile configuration value containing the secret authentication key',
			displayOptions: {
				show: {
					configurationMode: ['qrUrl'],
				},
			},
		},
	];
}
