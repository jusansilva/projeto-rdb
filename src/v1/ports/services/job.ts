import { DataBaseEnv } from '../../adapters/envs';
import { monq } from 'monq';

export class Jobs {
    handle(data) {
        const mongoConnectionString = `${DataBaseEnv.URI}/jobs`;
        const client = monq(mongoConnectionString);
        let saveBilhetagem = client.worker(['saveBilhetagem']);
        saveBilhetagem.register({
            bilhetagem: function (params, callback) {
                try {
                    var reversed = params.text.split('').reverse().join('');
                    callback(null, reversed);
                } catch (err) {
                    callback(err);
                }
            }

        });

        saveBilhetagem.start();



    }
}