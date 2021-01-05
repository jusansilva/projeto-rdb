"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose = require("mongoose");
const Schema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String
    }
}, {
    timestamps: true,
});
const UserModel = mongoose.model("UserModel", Schema, "user", true);
exports.UserModel = UserModel;
//# sourceMappingURL=user-model.js.map