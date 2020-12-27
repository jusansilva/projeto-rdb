"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarrosModel = void 0;
const mongoose = require("mongoose");
const Schema = new mongoose.Schema({
    carro: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});
const CarrosModel = mongoose.model("CarrosModel", Schema, "carros", true);
exports.CarrosModel = CarrosModel;
//# sourceMappingURL=carros-model.js.map