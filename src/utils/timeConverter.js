function timestampToDate(timestamp) {
  try {
    const date = new Date(parseInt(timestamp));
    return date.toISOString().replace("T", " ").slice(0, 19);
  } catch (error) {
    throw new Error(`Failed to convert timestamp to date: ${error.message}`);
  }
}

function dateToTimestamp(dateStr) {
  try {
    const date = new Date(dateStr);
    return date.getTime().toString();
  } catch (error) {
    throw new Error(`Failed to convert date to timestamp: ${error.message}`);
  }
}

function getCurrentTimestamp() {
  return Date.now().toString();
}

function getTimestampHoursAgo(hours) {
  const now = Date.now();
  const hoursInMs = hours * 60 * 60 * 1000;
  return (now - hoursInMs).toString();
}

module.exports = {
  timestampToDate,
  dateToTimestamp,
  getCurrentTimestamp,
  getTimestampHoursAgo,
};
