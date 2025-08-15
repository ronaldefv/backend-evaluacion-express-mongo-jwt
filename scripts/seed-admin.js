
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
dotenv.config();

async function main(){
  if(!process.env.MONGODB_URI){ console.error("Falta MONGODB_URI"); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);
  const email="admin@example.com"; const pass="Admin123!";
  const exists = await User.findOne({ email });
  if(!exists){
    const passwordHash = await bcrypt.hash(pass,10);
    await User.create({ email, passwordHash, role:"admin" });
    console.log(`✅ Admin creado: ${email} (pass: ${pass})`);
  }else{
    console.log("ℹ️ Admin ya existe");
  }
  await mongoose.disconnect();
}
main().catch(err=>{ console.error(err); process.exit(1); });
