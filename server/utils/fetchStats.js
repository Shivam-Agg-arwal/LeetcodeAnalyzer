export const fetchLeetcodeStats = async (username) => {
    try {
        const endpoint = process.env.BASE_URL;
        // const endpoint = "";
        const query = `
            {
                userContestRanking(username: "${username}") {
                    rating
                }
                matchedUser(username: "${username}") {
                    username
                    submitStats: submitStatsGlobal {
                        acSubmissionNum {
                            count
                        }
                    }
                }
            }
        `;

        const url = `${endpoint}?query=${encodeURIComponent(query)}`;

        // console.log(url);


        const response = await fetch(url, {
            method: "GET",
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching LeetCode stats:", error.message);
        return { status: "fail" };
    }
};
