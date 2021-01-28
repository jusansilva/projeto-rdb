interface EmailEnvs {
    host: string;
    service: string;
    port: number;
    secure: boolean;
    auth: {
        user: string,
        pass: string
    },
    destinatario: {
        from: string,
        to: string,
        subject: string,
        text: string
    }
}

const EmailEnvs: EmailEnvs = {
    host: process.env.EMAIL_HOST,
    service: process.env.EMAIL_SERVICE,
    port: Number(process.env.EMAIL_PORT),
    secure: Boolean(process.env.EMAIL_SECURE) || false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    destinatario: {
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_TO,
        subject: process.env.EMAIL_SUBJECT,
        text: process.env.EMAIL_TEXT
    }
};

export { EmailEnvs };