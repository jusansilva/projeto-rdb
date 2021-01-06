import * as nodemailer from 'nodemailer';
import { EmailDto } from 'v1/adapters/dtos';

export class EmailUtils {
    
    public async sendEmail(dto: EmailDto): Promise<Boolean> {

        const remetente = nodemailer.createTransport(dto.remetente);

        const result = await remetente.sendMail(dto.destinatario, function (error) {
            if (error) {
                console.log(error);
                return false;
            } else {
                console.log("Email enviado com sucesso.");
                return true;
            }
        });
        return result;
    }

}