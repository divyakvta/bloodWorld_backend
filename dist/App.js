"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
dotenv_1.default.config();
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || 3000;
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
        (0, db_1.default)();
    }
    initializeMiddlewares() {
        this.app.use((0, cors_1.default)({
            origin: process.env.CLIENT_URL,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, cookie_parser_1.default)());
    }
    initializeRoutes() {
        this.app.use('/api/users', userRoutes_1.default);
        this.app.get('/', (req, res) => res.send('Server is Ready'));
    }
    initializeErrorHandling() {
        this.app.use(errorMiddleware_1.notFound);
        this.app.use(errorMiddleware_1.errorHandler);
    }
    listen() {
        this.app.listen(this.port, () => console.log(`Server Connected to the port ${this.port}`));
    }
}
const app = new App();
app.listen();
