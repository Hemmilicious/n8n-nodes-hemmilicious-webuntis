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
			displayName: 'Anmeldung',
			name: 'configurationMode',
			type: 'options',
			options: [
				{
					name: 'Secret Key (manuell)',
					value: 'manual',
					description:
						'Verwendet den Secret Key aus der WebUntis-Mobil-/QR-Konfiguration und bleibt mit älteren Zugangsdaten kompatibel.',
				},
				{
					name: 'Benutzername + Passwort',
					value: 'password',
					description:
						'Verwendet die normale WebUntis-Anmeldung mit Benutzername und Passwort',
				},
				{
					name: 'Untis QR-URL',
					value: 'qrUrl',
					description:
						'Verwendet den vollständigen untis://setschool?... Wert aus WebUntis',
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
				'WebUntis-Servername ohne https://',
			displayOptions: {
				show: {
					configurationMode: ['manual', 'password'],
				},
			},
		},
		{
			displayName: 'Schule',
			name: 'school',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'demo-school',
			description:
				'WebUntis-Schulkennung bzw. Anmeldename der Schule',
			displayOptions: {
				show: {
					configurationMode: ['manual', 'password'],
				},
			},
		},
		{
			displayName: 'Schulnummer',
			name: 'schoolNumber',
			type: 'string',
			default: '',
			required: false,
			placeholder: '1234567',
			description:
				'Optionale Schulnummer aus der mobilen Konfiguration. Sie wird vollständig gespeichert, ist für die Anmeldung aber nicht zwingend erforderlich.',
			displayOptions: {
				show: {
					configurationMode: ['manual'],
				},
			},
		},
		{
			displayName: 'Benutzername',
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
				'Secret Key aus der WebUntis-Mobil-/QR-Einrichtung. Das ist nicht das normale WebUntis-Passwort.',
			displayOptions: {
				show: {
					configurationMode: ['manual'],
				},
			},
		},
		{
			displayName: 'Passwort',
			name: 'password',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Normales WebUntis-Passwort. Es wird ausschließlich im n8n-Credential-System gespeichert.',
			displayOptions: {
				show: {
					configurationMode: ['password'],
				},
			},
		},
		{
			displayName: 'Untis QR-URL',
			name: 'qrUrl',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			placeholder:
				'untis://setschool?url=...&school=...&user=...&key=...&schoolNumber=...',
			description:
				'Sensibler Wert aus der mobilen Konfiguration, der den geheimen Authentifizierungsschlüssel enthält',
			displayOptions: {
				show: {
					configurationMode: ['qrUrl'],
				},
			},
		},
	];
}
