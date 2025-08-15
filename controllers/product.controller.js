
import Product from "../models/product.js";
import { cacheInvalidate } from "../middleware/cache.js";

export async function listProducts(req,res){
  const { q, minPrice, maxPrice, page=1, limit=10 } = req.query;
  const filter = {};
  if(q) filter.name = { $regex:q, $options:"i" };
  if(minPrice || maxPrice) filter.price = { ...(minPrice?{$gte:+minPrice}:{}) , ...(maxPrice?{$lte:+maxPrice}:{}) };
  const p = Math.max(1,+page), l = Math.max(1,+limit);
  const [items, total] = await Promise.all([
    Product.find(filter).sort({createdAt:-1}).skip((p-1)*l).limit(l),
    Product.countDocuments(filter)
  ]);
  res.json({ items, page:p, limit:l, total });
}
export async function getProduct(req,res){
  const item = await Product.findById(req.params.id);
  if(!item) return res.status(404).json({ message:"No encontrado" });
  res.json(item);
}
export async function createProduct(req,res){
  const { name, price, description } = req.body;
  if(!name || price==null) return res.status(400).json({ message:"name y price requeridos" });
  const item = await Product.create({ name, price, description });
  cacheInvalidate("/api/products");
  res.status(201).json(item);
}
export async function updateProduct(req,res){
  const { name, price, description } = req.body;
  const item = await Product.findByIdAndUpdate(req.params.id, { name, price, description }, { new:true });
  if(!item) return res.status(404).json({ message:"No encontrado" });
  cacheInvalidate("/api/products");
  res.json(item);
}
export async function deleteProduct(req,res){
  const out = await Product.findByIdAndDelete(req.params.id);
  if(!out) return res.status(404).json({ message:"No encontrado" });
  cacheInvalidate("/api/products");
  res.status(204).end();
}
