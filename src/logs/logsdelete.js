const cron = require('node-cron');
const fs = require('fs');
// ...

// Remove the error.log file every twenty-first day of the month.
cron.schedule('* * */25 * *', function() {
    console.log('---------------------');
    console.log('Deleting logs');
    fs.unlink('./cron-logs.json', err => {
      if (err) throw err;
      console.log('Error file successfully deleted');
    });
});