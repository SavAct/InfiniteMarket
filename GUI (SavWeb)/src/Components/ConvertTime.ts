/**
 * This function converts a number of seconds into a string formatted as a duration.
 * @param seconds Number of seconds
 * @returns a string in the format "x day(s), y hour(s), z minute(s), and a second(s)"
 */
export function formatDuration(seconds: number) {
  var days = Math.floor(seconds / (3600 * 24));
  var hours = Math.floor((seconds % (3600 * 24)) / 3600);
  var minutes = Math.floor((seconds % 3600) / 60);
  var remainingSeconds = seconds % 60;

  var parts = [];
  if (days > 0) {
    parts.push(days + " day" + (days == 1 ? "" : "s"));
  }
  if (hours > 0) {
    parts.push(hours + " hour" + (hours == 1 ? "" : "s"));
  }
  if (minutes > 0) {
    parts.push(minutes + " minute" + (minutes == 1 ? "" : "s"));
  }
  if (remainingSeconds > 0) {
    const roundSeconds = Math.round(remainingSeconds);
    parts.push(roundSeconds + " second" + (roundSeconds == 1 ? "" : "s"));
  }

  if (parts.length == 0) {
    return "0 seconds";
  }

  if (parts.length == 1) {
    return parts[0];
  }

  var lastPart = parts.pop();
  return parts.join(", ") + " and " + lastPart;
}
