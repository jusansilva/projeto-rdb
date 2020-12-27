interface AppEnvs {
    port: number;
    host: string;
}

const AppEnvs: AppEnvs = {
    port: Number(process.env.PORT) || 3000,
    host: process.env.HOST || "localhost"
};

export { AppEnvs };