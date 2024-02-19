import { SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USERNAME } from '$env/static/private';
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
	host: SMTP_HOST,
	port: Number(SMTP_PORT),
	secure: false,
	auth: {
		user: SMTP_USERNAME,
		pass: SMTP_PASSWORD
	}
});

export type Transporter = typeof transporter;
