"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GpsImportModel = void 0;
const mongoose = require("mongoose");
const Schema = new mongoose.Schema({
    data_final: {
        type: Date,
    },
    AVL: {
        type: String,
    },
    carro: {
        type: String,
    },
    latitude: {
        type: String,
    },
    longitude: {
        type: String,
    },
    ponto_notavel: {
        type: String,
    },
    desc_ponto_notavel: {
        type: String,
    },
    linha: {
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
const GpsImportModel = mongoose.model("GpsImportModel", Schema, "gps", true);
exports.GpsImportModel = GpsImportModel;
//# sourceMappingURL=gps-import-model.js.map