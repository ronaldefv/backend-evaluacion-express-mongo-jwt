
const api = (p, opts={}) =>
  fetch(p, { ...opts, headers:{
    "Content-Type":"application/json",
    ...(opts.headers||{}),
    ...(localStorage.token ? { Authorization: "Bearer "+localStorage.token } : {})
  }}).then(async r => (r.headers.get("content-type")||"").includes("application/json") ? r.json() : {status:r.status,text:await r.text()});

document.getElementById("btn-register").onclick = async ()=>{
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-pass").value;
  const role = document.getElementById("reg-role").value;
  const out = await api("/api/auth/register",{ method:"POST", body: JSON.stringify({email,password,role}) });
  document.getElementById("reg-out").textContent = JSON.stringify(out,null,2);
};

document.getElementById("btn-login").onclick = async ()=>{
  const email = document.getElementById("log-email").value.trim();
  const password = document.getElementById("log-pass").value;
  const res = await fetch("/api/auth/login",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({email,password}) });
  const out = await res.json().catch(()=>({message:"Respuesta no JSON"}));
  if(res.ok && out && out.token){ localStorage.token = out.token; document.getElementById("log-out").textContent = "✅ Token guardado"; }
  else{ document.getElementById("log-out").textContent = "❌ " + (out.message || "Error de login"); }
};
document.getElementById("btn-logout").onclick = ()=>{ localStorage.removeItem("token"); document.getElementById("log-out").textContent="Logout OK"; };

document.getElementById("btn-list").onclick = async ()=>{
  const params = new URLSearchParams();
  const q = document.getElementById("q").value.trim();
  const min = document.getElementById("min").value;
  const max = document.getElementById("max").value;
  if(q) params.set("q", q);
  if(min) params.set("minPrice", min);
  if(max) params.set("maxPrice", max);
  const out = await api("/api/products" + (params.toString()? ("?"+params.toString()):""));
  document.getElementById("list-out").textContent = JSON.stringify(out,null,2);
};

document.getElementById("btn-create").onclick = async ()=>{
  const name = document.getElementById("p-name").value;
  const price = Number(document.getElementById("p-price").value);
  const description = document.getElementById("p-desc").value;
  const out = await api("/api/products",{ method:"POST", body: JSON.stringify({name,price,description}) });
  document.getElementById("create-out").textContent = JSON.stringify(out,null,2);
};
