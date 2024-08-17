import mongoose from "mongoose";

export default async () => {
  await mongoose.connect(process.env.MONGODB_SRV, {
    keepAlive: true,
  });
  console.log("Connected to MongoDB");
};
