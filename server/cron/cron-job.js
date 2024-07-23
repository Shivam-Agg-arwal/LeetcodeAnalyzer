// cron/cron-job.js
import cron from 'node-cron';
import { autoUpdate } from '../controllers/Managing'; // Importing the function

cron.schedule('* * * * *', async () => {
    try {
        await autoUpdate(); // Call the function
        console.log('Auto update ran successfully at 10 PM');
    } catch (error) {
        console.error('Error running auto update:', error.message);
    }
});

// Keep the worker running
process.stdin.resume();
