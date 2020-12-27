"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinhaModel = void 0;
const mongoose = require("mongoose");
const Schema = new mongoose.Schema({
    area: {
        type: String,
        required: true,
    },
    descricao: {
        type: String,
        required: true,
    },
    empresa: {
        type: String,
        required: true,
    },
    empresa_1: {
        type: String,
        required: true,
    },
    id_linha_sbe: {
        type: String,
        required: true,
    },
    linha: {
        type: String,
        required: true,
    },
    lote: {
        type: String,
        required: true,
    },
    tipo: {
        type: String,
    }
}, {
    timestamps: true,
});
const LinhaModel = mongoose.model("LinhaModel", Schema, "linha", true);
exports.LinhaModel = LinhaModel;
//# sourceMappingURL=linha-model.js.map