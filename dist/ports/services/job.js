"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jobs = void 0;
const envs_1 = require("../../adapters/envs");
const monq_1 = require("monq");
class Jobs {
    handle(data) {
        const mongoConnectionString = `${envs_1.DataBaseEnv.URI}/jobs`;
        const client = monq_1.monq(mongoConnectionString);
        let saveBilhetagem = client.worker(['saveBilhetagem']);
        saveBilhetagem.register({
            bilhetagem: function (params, callback) {
                try {
                    var reversed = params.text.split('').reverse().join('');
                    callback(null, reversed);
                }
                catch (err) {
                    callback(err);
                }
            }
        });
        saveBilhetagem.start();
    }
}
exports.Jobs = Jobs;
//# sourceMappingURL=job.js.map