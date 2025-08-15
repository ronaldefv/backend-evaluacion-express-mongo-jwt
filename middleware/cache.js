
const store = new Map();
export default function cache(ttl=10000){
  return (req,res,next)=>{
    if(req.method!=="GET"||ttl<=0) return next();
    const key = req.originalUrl;
    const hit = store.get(key);
    const now = Date.now();
    if(hit && hit.exp>now) return res.json(hit.data);
    const orig = res.json.bind(res);
    res.json = (data)=>{ store.set(key,{exp:now+ttl,data}); return orig(data); };
    next();
  };
}
export function cacheInvalidate(prefix=""){
  for(const k of Array.from(store.keys())) if(!prefix || k.startsWith(prefix)) store.delete(k);
}
