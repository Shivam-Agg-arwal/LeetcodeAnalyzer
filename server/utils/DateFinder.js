export const dateFinder = () => {
    const date = new Date();
    
    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[date.getMonth()]; // Get the month name
    const year = date.getFullYear();

    const formattedDate = `${day} ${month} ${year}`;
    
    return formattedDate;
};