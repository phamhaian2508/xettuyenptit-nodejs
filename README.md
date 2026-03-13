# Xet tuyen PTIT Node.js + React

Project nay da duoc tach thanh 2 phan:

- `backend`: Express + MySQL + JWT
- `frontend`: React + Vite

## Chuc nang da chuyen

- Dang nhap tai duong dan `/user/login`
- Man hinh muc dich tai `/mucdich`
- Man hinh danh sach ho so tai `/danhsachhoso`
- Man hinh account center tai `/account/center`
- Tab doi mat khau tai `/account/center?tab=password`
- Ket noi lai MySQL theo schema cu trong `database/db.sql`

## 1. Tao database

Chay file [database/db.sql](/c:/Users/AnhTuan/Desktop/xettuyenptitnodejs/database/db.sql) tren MySQL.

Database mac dinh:

- `DB_NAME=estateadvance`

Tai khoan seed trong SQL:

- `username: 037204009534`
- `password: Tuan0303#`

## 2. Chay backend

Sao chep `backend/.env.example` thanh `backend/.env` va sua thong tin MySQL.

```bash
cd backend
npm install
npm run dev
```

Backend mac dinh chay tai `http://localhost:8080`.

## 3. Chay frontend

Sao chep `frontend/.env.example` thanh `frontend/.env`.

```bash
cd frontend
npm install
npm run dev
```

Frontend mac dinh chay tai `http://localhost:5173`.

## API backend

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/account/profile`
- `PUT /api/account/profile`
- `PUT /api/account/password`

## Ghi chu

- Backend doc duoc mat khau cu dang `{noop}` cua Spring Security.
- Neu doi mat khau trong giao dien moi, backend se luu dang `{bcrypt}`.
