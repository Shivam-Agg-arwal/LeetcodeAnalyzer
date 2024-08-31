const BASE_URL = process.env.REACT_APP_API_URL;

export const authenticationEndpoints = {
    LOGIN_API: `${BASE_URL}authentication/login`,
    SIGNUP_API: `${BASE_URL}authentication/signin`,
    SEND_OTP_API: `${BASE_URL}authentication/sendOtp`,
    RESETPASSWORD_API:`${BASE_URL}authentication/resetPassword`,
    RESETPASSTOKEN_API:`${BASE_URL}authentication/resetPasswordToken`,
};

export const managementEndpoints = {
    ADD_ID_API: `${BASE_URL}management/AddLeetcodeId`,
    REMOVE_ID_API: `${BASE_URL}management/RemoveLeetcodeId`,
    FETCH_DATA_API: `${BASE_URL}management/fetchData`
};
