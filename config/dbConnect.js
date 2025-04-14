import mongoose from "mongoose";
const ConnectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("DB CONNECTED");
  });
   try{
    await mongoose.connect(process.env.MONGO_URI);
   }catch(err){
    console.log(err.message)
   }
  };

  export default ConnectDB