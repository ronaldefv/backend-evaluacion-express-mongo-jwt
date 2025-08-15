
# Backend Evaluación — Express + Mongo + JWT + Roles + CRUD

## Requisitos
- Node.js 18+ y npm
- MongoDB local (`mongodb://127.0.0.1:27017`)
- (Opcional) MongoDB Compass

## Setup
```bash
npm install
cp .env.example .env
# Edita .env y cambia JWT_SECRET
```

## Semilla (admin)
```bash
npm run seed
# Crea admin@example.com / Admin123!
```

## Ejecutar
```bash
npm run dev
# API: http://localhost:3000
# UI de prueba: http://localhost:3000/app
```

## Endpoints
- **Auth**
  - POST `/api/auth/register` { email, password, role? }
  - POST `/api/auth/login` { email, password } -> token
  - POST `/api/auth/logout`
- **Productos** (requiere token)
  - GET `/api/products` (q, minPrice, maxPrice, page, limit) [caché 10s]
  - GET `/api/products/:id`
  - POST `/api/products` *(admin)*
  - PUT `/api/products/:id` *(admin)*
  - DELETE `/api/products/:id` *(admin)*
"# backend-evaluacion-express-mongo-jwt" 
