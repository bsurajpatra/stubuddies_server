const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/,
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Preferred not to say'],
        required: true,
    },
    // Commented out: OTP field
    /*
    otp: {
        type: String,
        validate: {
            validator: function(v) {
                return /^\d{6}$/.test(v); // Example: validate OTP to be a 6-digit number
            },
            message: props => `${props.value} is not a valid OTP!`
        },
    },
    expiresAt: {
        type: Date,
    },
    */
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
