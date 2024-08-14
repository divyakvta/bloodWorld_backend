"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
//User Signup
class UserController {
    signup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { name, email, password, confirmPassword } = req.body;
            if (password !== confirmPassword) {
                res.status(400).json({ error: 'Passwords do not match' });
                return;
            }
            try {
                const existingUser = yield userModel_1.default.findOne({ email });
                if (existingUser) {
                    res.status(400).json({ error: "Email already exists" });
                    return;
                }
                const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
                const newUser = new userModel_1.default({ name, email, password: hashedPassword });
                yield newUser.save();
                const token = jsonwebtoken_1.default.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.status(201).json({ token });
            }
            catch (error) {
                next(error);
            }
        });
    }
    //User Login
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const user = yield userModel_1.default.findOne({ email });
                console.log(user);
                if (!user) {
                    express_1.response.status(400).json({ error: 'Invalid credentials' });
                    return;
                }
                const isMatch = yield bcryptjs_1.default.compare(password, user.password);
                if (!isMatch) {
                    res.status(400).json({ error: 'Invalid credentials' });
                }
                const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.status(200).json({ token });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = UserController;
