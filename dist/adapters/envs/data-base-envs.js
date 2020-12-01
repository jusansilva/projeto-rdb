"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataBaseEnv = void 0;
const DataBaseEnv = {
    URI: process.env.MONGO_URI || 'mongodb://ssmsolutions:Ssmsolutions_20@geonosis.mongodb.umbler.com:48797/ssmsolutions_db',
    DATABASE: process.env.MONGO_DATABASE || 'ssmsolutions_db',
};
exports.DataBaseEnv = DataBaseEnv;
//# sourceMappingURL=data-base-envs.js.map