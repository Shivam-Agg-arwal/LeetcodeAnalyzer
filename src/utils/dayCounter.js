function calculateDaysFromToday(givenDate) {
    // Convert date string to Date object
    const parseDate = (dateStr) => {
        const [day, month, year] = dateStr.split(' ');
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthIndex = monthNames.indexOf(month);
        return new Date(year, monthIndex, day);
    };

    const startDate = parseDate(givenDate);
    const today = new Date(); // Get today's date

    // Calculate the difference in time
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

    return diffDays ; // Add 1 to make the calculation inclusive
}

export default calculateDaysFromToday;