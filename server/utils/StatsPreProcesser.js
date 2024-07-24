export const preprocessStats = (response, leetcodeId, date) => {
    return {
        date: date,
        leetcode_count: response[0],
        leetcode_easy: response[3],
        leetcode_medium: response[2],
        leetcode_hard: response[1],
        leetcode_id: leetcodeId,
    };
};
