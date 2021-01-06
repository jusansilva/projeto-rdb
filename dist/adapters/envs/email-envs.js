"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailEnvs = void 0;
const EmailEnvs = {
    host: process.env.EMAIL_HOST,
    service: process.env.EMAIL_SERVICE,
    port: Number(process.env.EMAIL_PORT),
    secure: Boolean(process.env.EMAIL_SECURE),
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
exports.EmailEnvs = EmailEnvs;
//# sourceMappingURL=email-envs.js.map