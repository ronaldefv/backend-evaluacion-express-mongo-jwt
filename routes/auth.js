
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = Router();

router.post("/register", async (req,res)=>{
  try{
    const { email, password, role="user" } = req.body;
    if(!email || !password) return res.status(400).json({message:"email y password requeridos"});
    const exists = await User.findOne({ email });
    if(exists) return res.status(409).json({ message:"Email ya registrado" });
    const passwordHash = await bcrypt.hash(password,10);
    const user = await User.create({ email, passwordHash, role });
    res.status(201).json({ id:user._id, email:user.email, role:user.role });
  }catch(e){ res.status(500).json({ message:e.message }); }
});

router.post("/login", async (req,res)=>{
  try{
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(401).json({ message:"Credenciales inválidas" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if(!ok) return res.status(401).json({ message:"Credenciales inválidas" });
    const token = jwt.sign({ id:user._id.toString(), email:user.email, role:user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1h" });
    res.json({ token, user:{ id:user._id, email:user.email, role:user.role } });
  }catch(e){ res.status(500).json({ message:e.message }); }
});

router.post("/logout", (_req,res)=>res.json({ok:true}));

export default router;
