import mongoose from 'mongoose';

const loginNotificationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    loginTime: {
        type: Date,
        required: true,
    },
});

const LoginNotification = mongoose.model('LoginNotification', loginNotificationSchema);

export default LoginNotification;
