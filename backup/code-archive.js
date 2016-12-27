/* Code for calling a function at a specific time and repeat it every 24 hours */
var now = new Date();
var refreshTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0, 0) - now; // Example: 10:00 AM
if (refreshTime < 0) {
     refreshTime += 86400000; // It's already past 10:00 AM today, set refreshTime to 10:00 AM tomorrow.
}
// Refresh chart every 24 hours starting from refreshTime (i.e. 10:00 AM)
setTimeout(function() { myFunction(param1); setInterval(function() { myFunction(param1); }, 86400000); }, refreshTime);
/* -- */
