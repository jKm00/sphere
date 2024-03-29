import { transporter, type Transporter } from '../email';

class EmailSerivce {
	private transporter: Transporter;

	constructor(transporter: Transporter) {
		this.transporter = transporter;
	}

	public async sendVerificationEmail(to: string, code: string) {
		const subject = 'Verify your email';
		const html = `
			<h1>Verify your email</h1>
			<p>Use the following code to verify your email: <strong>${code}</strong></p>
		`;

		await this.sendEmail(to, subject, html);
	}

	public async sendPasswordResetEmail(to: string, link: string) {
		const subject = 'Reset your password';
		const html = `
			<h1>Reset your password</h1>
			<p>Click the following link to reset your password: <a href="${link}">${link}</a></p>
		`;

		await this.sendEmail(to, subject, html);
	}

	private async sendEmail(to: string, subject: string, html: string) {
		await this.transporter.sendMail({
			to,
			subject,
			html
		});
	}
}

export default new EmailSerivce(transporter);
