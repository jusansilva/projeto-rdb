"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaixaHorarioModel = void 0;
const mongoose = require("mongoose");
const Schema = new mongoose.Schema({
    faixa_horario: {
        type: String,
        required: true,
    },
    faixa_num: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true,
});
const FaixaHorarioModel = mongoose.model("FaixaHorarioModel", Schema, "faixa_horario", true);
exports.FaixaHorarioModel = FaixaHorarioModel;
//# sourceMappingURL=faixa-horario-model.js.map