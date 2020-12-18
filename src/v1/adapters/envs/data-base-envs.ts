interface DataBaseEnv {
  URI: string;
  DATABASE: string;
}

const DataBaseEnv: DataBaseEnv = {
  URI: process.env.MONGO_URI || 'mongodb://ssmsolutions:Ssmsolutions_20@geonosis.mongodb.umbler.com:48797/ssmsolutions_db',
  DATABASE: process.env.MONGO_DATABASE || 'ssmsolutions_db',
};

export { DataBaseEnv };