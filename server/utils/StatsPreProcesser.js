export const preprocessStats = (response, leetcodeId, date) => {
    return {
        date: date,
        leetcode_count: response.totalSolved,
        leetcode_easy: response.easySolved,
        leetcode_medium: response.mediumSolved,
        leetcode_hard: response.hardSolved,
        leetcode_id: leetcodeId,
    };
};
