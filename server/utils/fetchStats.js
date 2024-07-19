export const fetchLeetcodeStats = async (leetcode_id) => {
    try {
        const url = `${process.env.BASE_URL}${leetcode_id}`;
        const response = await fetch(url, {
            method: "GET", // Specify method as GET
            headers: {
                'Content-Type': 'application/json', // Optional: Specify content type
            }
        });

        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        return result; // Return the result for further use
    } catch (error) {
        console.error("Error fetching LeetCode stats:", error.message);
        return {"status":"fail"}
    }
};