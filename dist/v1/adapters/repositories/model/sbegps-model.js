"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SbegpsModel = void 0;
const mongoose = require("mongoose");
const Schema = new mongoose.Schema({
    carro: {
        type: String,
        required: true,
    },
    cod_linha_sbe: {
        type: String,
        required: true,
    },
    data: {
        type: Date,
        required: true,
    },
    hora_cartao: {
        type: String,
        required: true,
    },
    id_cartao: {
        type: String,
        required: true,
    },
    latitude: {
        type: String,
        required: true,
    },
    latitude2: {
        type: String,
        required: true,
    },
    linha: {
        type: String,
    },
    linha_sbe: {
        type: String,
    },
    logintude: {
        type: String,
    },
    logintude2: {
        type: String,
    },
    sentido: {
        type: String,
    },
    tamanho: {
        type: String,
    },
    tipo_cartao: {
        type: String,
    }
}, {
    timestamps: true,
});
const SbegpsModel = mongoose.model("SbegpsModel", Schema, "sbegps", true);
exports.SbegpsModel = SbegpsModel;
//# sourceMappingURL=sbegps-model.js.map