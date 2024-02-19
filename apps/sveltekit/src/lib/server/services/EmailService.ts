import { transporter, type Transporter } from '../email';

class EmailSerivce {
	private transporter: Transporter;

	constructor(transporter: Transporter) {
		this.transporter = transporter;
	}

	async sendEmail(to: string, subject: string, html: string) {
		await this.transporter.sendMail({
			from: 'sphere@service.com',
			to,
			subject,
			html
		});
	}
}

export default new EmailSerivce(transporter);
