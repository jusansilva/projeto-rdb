"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BilhetagemImportModel = void 0;
const mongoose = require("mongoose");
const Schema = new mongoose.Schema({
    carro: {
        type: String,
    },
    linha: {
        type: String,
    },
    data: {
        type: Date,
    },
    cartaoId: {
        type: String,
    },
    transacao: {
        type: String,
    },
    sentido: {
        type: String,
    },
    document: {
        type: String,
    }
}, {
    timestamps: true,
});
const BilhetagemImportModel = mongoose.model("BilhetagemImportModel", Schema, "bilhetagem", true);
exports.BilhetagemImportModel = BilhetagemImportModel;
//# sourceMappingURL=bilhetagem-import-model.js.map