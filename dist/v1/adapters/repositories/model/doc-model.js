"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocModel = void 0;
const mongoose = require("mongoose");
const Schema = new mongoose.Schema({
    speciality: {
        type: Object,
        required: true,
    },
    holder: {
        type: String,
        required: true,
    },
    schedules: [String],
    scheduled_to: {
        type: String,
        required: true,
    },
    status: {
        type: String,
    },
    requester: {
        type: Object,
        required: true,
    },
    supporter: {
        type: Object,
    },
}, {
    timestamps: true,
});
const DocModel = mongoose.model("DocModel", Schema, "Doc", true);
exports.DocModel = DocModel;
//# sourceMappingURL=doc-model.js.map