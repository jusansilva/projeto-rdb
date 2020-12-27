"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViagemModel = void 0;
const mongoose = require("mongoose");
const Schema = new mongoose.Schema({
    data: {
        type: Date,
        required: true,
    },
    faixa_horaria: {
        type: String,
        required: true,
    },
    hora_final: {
        type: String,
        required: true,
    },
    hora_inicio: {
        type: String,
        required: true,
    },
    intervalo_veiculo: {
        type: String,
        required: true,
    },
    linha: {
        type: String,
        required: true,
    },
    media_faixa_horaria: {
        type: String,
    },
    media_velocidade_faixa: {
        type: String,
    },
    prefixo: {
        type: String,
    },
    tempo_programado: {
        type: String,
    },
    tempo_realizado: {
        type: String,
    },
    tipo_evento: {
        type: String,
    },
    tipo_pico: {
        type: String
    },
    velocidade: {
        type: String,
    }
}, {
    timestamps: true,
});
const ViagemModel = mongoose.model("ViagemModel", Schema, "Viagem", true);
exports.ViagemModel = ViagemModel;
//# sourceMappingURL=viagem-model.js.map