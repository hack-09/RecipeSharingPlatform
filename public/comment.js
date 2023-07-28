// Create a new Date object with the current date and time
const currentTime = new Date();

// Get individual components of the date and time
const year = currentTime.getFullYear();
const month = (currentTime.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed, so add 1
const day = currentTime.getDate().toString().padStart(2, '0');
const hours = currentTime.getHours().toString().padStart(2, '0');
const minutes = currentTime.getMinutes().toString().padStart(2, '0');

// Create a formatted date and time string without the timezone offset (e.g., "2023-07-25 23:23:19")
const formattedDateTime = `${year}-${month}-${day} / ${hours}:${minutes}`;

console.log(formattedDateTime);
