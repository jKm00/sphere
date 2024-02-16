import express, { Express, Request, Response } from 'express';
import cron from 'node-cron';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = 3000;

let scheduledTask: cron.ScheduledTask;

app.listen(port, async () => {
	scheduledTask = cron.schedule('*/5 * * * * *', async () => {
		try {
			const res = await fetch(
				`${process.env.SVELTEKIT_URL}/api/v1/fetch-exchange-rates?API_KEY=${process.env.API_KEY}`
			);
			const data = await res.json();

			if (res.status === 200) {
				console.log(`Success: ${new Date().toString()}`);
			} else {
				console.error(`Error (${res.status}):`, data, new Date().toString());
			}
		} catch (err) {
			console.error(err);
		}
	});

	console.log(`Server is running on port ${port}`);
});

process.on('SIGINT', () => {
	console.log('Bye bye!');
	scheduledTask.stop();
	process.exit();
});

process.on('SIGTERM', () => {
	console.log('Bye bye!');
	scheduledTask.stop();
	process.exit();
});
