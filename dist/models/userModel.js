"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Create a schema corresponding to the document interface.
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        uniqueCaseInsensitive: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    otp: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
