export interface EmailDto {
    remetente: {
        host: string,
        //service: string,
        port: number,
        secureConnection: boolean,
        auth: {
            user: string,
            pass: string
        }
    };
    destinatario: {
        pool: boolean,
        from: string,
        to: string,
        subject: string,
        text: string,
        Attachments: {
            filename: string,
            path: string
        },
        tls: {  ciphers?: string,
            rejectUnauthorized?: boolean,
            secure: boolean,
            ignoreTLS: boolean}
    };

}