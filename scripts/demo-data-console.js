chrome.storage.local.set({
  timeData: {
    "reddit.com": {
      day: 1200000,     // 20 minutes today
      week: 7200000,    // 2 hours this week  
      month: 18000000,  // 5 hours this month
      year: 54000000,   // 15 hours this year
      allTime: 108000000 // 30 hours all time
    },
    "facebook.com": {
      day: 900000,      // 15 minutes today
      week: 5400000,    // 1.5 hours this week
      month: 14400000,  // 4 hours this month  
      year: 43200000,   // 12 hours this year
      allTime: 86400000 // 24 hours all time
    },
    "linkedin.com": {
      day: 600000,      // 10 minutes today
      week: 3600000,    // 1 hour this week
      month: 10800000,  // 3 hours this month
      year: 36000000,   // 10 hours this year
      allTime: 72000000 // 20 hours all time
    }
  }
}, () => console.log('✅ Demo data set! Refresh the page.'));