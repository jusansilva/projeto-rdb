"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartaoModel = void 0;
const mongoose = require("mongoose");
const Schema = new mongoose.Schema({
    tipo_cartao: {
        type: String,
        required: true,
    },
    valor: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});
const CartaoModel = mongoose.model("CartaoModel", Schema, "cartao", true);
exports.CartaoModel = CartaoModel;
//# sourceMappingURL=cartao-model.js.map