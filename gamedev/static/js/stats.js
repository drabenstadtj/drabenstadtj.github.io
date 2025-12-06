// Count all entry divs
const totalEntries = document.querySelectorAll('.entry').length;

// Get the date from the first entry (assuming newest first)
const lastUpdated = document.querySelector('.entry .date').textContent;

// Update the stats
document.querySelector('.stats p:first-child').textContent = `Total Entries: ${totalEntries}`;
document.querySelector('.stats p:last-child').textContent = `Last Updated: ${lastUpdated}`;