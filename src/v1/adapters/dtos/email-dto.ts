export interface EmailDto {
    remetente: {
        host: string,
        service: string,
        port: number,
        secure: boolean,
        auth: {
            user: string,
            pass: string
        }
    };
    destinatario: {
        from: string,
        to: string,
        subject: string,
        text: string,
        Attachments: {
            filename: string,
            path: string
        },
        tls: { rejectUnauthorized: boolean }
    };

}