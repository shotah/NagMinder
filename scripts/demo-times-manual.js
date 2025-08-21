// Set realistic demo times
chrome.storage.local.set({
  nm_siteTimes: {
    "reddit.com": {
      day: 25,      // 25 minutes today
      week: 180,    // 3 hours this week
      month: 420,   // 7 hours this month  
      year: 1200,   // 20 hours this year
      allTime: 2400 // 40 hours all time
    }
  }
}, () => {
  console.log('✅ Demo times set!');
  console.log('📄 Now refresh the page to see times...');
});