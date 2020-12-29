interface AppEnvs {
    port: number;
    host: string;
}

const AppEnvs: AppEnvs = {
    port: Number(process.env.PORTA) || 3000,
    host: process.env.HOST || "0.0.0.0"
};

export { AppEnvs };