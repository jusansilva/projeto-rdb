interface AppEnvs {
    port: number;
    host: string;
}

const AppEnvs: AppEnvs = {
    port: Number(process.env.PORTA) || 3001,
    host: process.env.HOST || "0.0.0.0"
};

export { AppEnvs };