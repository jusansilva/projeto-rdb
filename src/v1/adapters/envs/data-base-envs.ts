interface DataBaseEnv {
  URI: string;
  DATABASE: string;
}

const DataBaseEnv: DataBaseEnv = {
  URI: process.env.MONGO_URI,
  DATABASE: process.env.MONGO_DATABASE,
};

export { DataBaseEnv };