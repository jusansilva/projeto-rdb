interface DataBaseEnv {
  URI: string;
  DATABASE: string;
}

const DataBaseEnv: DataBaseEnv = {
  URI: process.env.MONGO_URI || 'mongodb:kamino.mongodb.umbler.com:53225',
  DATABASE: process.env.MONGO_DATABASE || 'ssmsolutions_db',
};

export { DataBaseEnv };