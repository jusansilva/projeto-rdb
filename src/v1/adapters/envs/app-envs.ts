interface AppEnvs {
    port: number;
    host: string;
    algorithm: string;
    password: string;
    IV_LENGTH: number;
    ENCRYPTION_KEY: string;
}

const AppEnvs: AppEnvs = {
    port: Number(process.env.PORTA) || 3000,
    host: process.env.HOST || "0.0.0.0",
    algorithm: process.env.ALGORITH || 'aes-256-ctr',
    password: process.env.PASSWORD || 'd6F3Efeq',
    IV_LENGTH: Number(process.env.IV_LENGTH) ||  16,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || "rdb2020",
};

export { AppEnvs };