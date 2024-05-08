import mongoose from "mongoose";

const connection = async () => {
  await mongoose
    .connect(process.env.CONNECTION_URL_HOST)
    .then((res) => console.log("DB Success"))
    .catch((err) => console.log("fail", err));
};

export default connection ;
