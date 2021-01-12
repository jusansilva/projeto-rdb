"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelationshipModel = void 0;
const mongoose = require("mongoose");
const Schema = new mongoose.Schema({
    data_gps: {
        type: Date,
    },
    carro: {
        type: String,
    },
    linha: {
        type: String,
    },
    AVL: {
        type: String,
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
    }
}, {
    timestamps: true,
});
const RelationshipModel = mongoose.model("RelationshipModel", Schema, "relationship", true);
exports.RelationshipModel = RelationshipModel;
//# sourceMappingURL=relationship-model.js.map