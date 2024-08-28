// cronJobs.js
import cron from 'node-cron';
import { UserModel } from '../models/userModel';

// Schedule the cron job to run daily at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    console.log("cron job")

    // Find users whose next donation date is today or earlier
    const users: any = await UserModel.find({ nextDonation: { $lte: new Date() } });

  
    if (users.length === 0) {
      console.log('No users with past due donation dates.');
      return;
    }

  
    for (const user of users) {
      user.lastDonated = user.nextDonation;
      user.nextDonation = null; 
      await user.save();
      console.log(`Updated donation dates for user ${user._id}`);
    }

    console.log('Donation dates updated successfully.');

  } catch (error) {
    console.error('Error updating donation dates:', error);
  }
});
