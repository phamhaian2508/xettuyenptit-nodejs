# Xet Tuyen PTIT Node.js

Project gom 3 phan:

- `backend`: Express + MySQL + JWT
- `frontend`: React + Vite
- `database`: 1 file SQL duy nhat de tao bang va seed du lieu

## Trang thai hien tai

Repo da duoc bo sung luong admin co the chay tren kien truc hien co:

- Dang nhap admin bang tai khoan seed
- Dashboard tong quan
- Quan ly ho so, cap nhat trang thai
- Quan ly danh sach thi sinh, xem lich su ho so
- Xuat CSV cho ho so va thi sinh
- Thong tin ca nhan va doi mat khau qua `POST /api/user/me/change/password`
- Bo API du lieu cho thi sinh: huong dan, thong bao, dot tuyen sinh, nganh, ho so cua toi

Luu y:

- Frontend trong repo hien tai van duoc giu tren `React + Vite + React Router` de dam bao co ban chay duoc nhanh trong pham vi yeu cau nay.
- Chua refactor sang `UmiJS v3.5.41` va `styled-components` trong lan cap nhat nay.

## 1. Database

Thu muc `database` chi dung:

- `db.sql`: tao toan bo bang va seed du lieu demo

Nhung nhom bang chinh da co:

- `users`, `roles`, `user_roles`, `user_profiles`
- `candidates`
- `administrative_units`
- `admission_periods`
- `majors`
- `admission_applications`
- `application_guides`
- `notifications`
- `audit_logs`

Database mac dinh:

- `DB_NAME=xettuyenptitnodejs`

### Tai khoan seed

- Du lieu mau duoc tao trong `database/db.sql`.
- Khong nen cong khai thong tin dang nhap seed tren tai lieu hoac giao dien.
- Khi dung cho moi truong that, can thay toan bo mat khau mac dinh va xoay `JWT_SECRET`.

## 2. Chay backend

Sao chep `backend/.env.example` thanh `backend/.env`, sau do sua thong tin MySQL.

Bien moi truong quan trong:

- `PORT`: cong backend
- `ALLOWED_ORIGINS`: danh sach origin duoc phep qua CORS, tach boi dau phay
- `DOCUMENT_UPLOADS_DIR`: thu muc luu minh chung
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET`

```bash
cd backend
npm install
node src/index.js
```

Backend mac dinh chay tai `http://localhost:8080`.

## 3. Chay frontend

Sao chep `frontend/.env.example` thanh `frontend/.env`.

Quy tac cau hinh:

- De trong `VITE_API_URL` neu frontend va backend di qua cung domain/reverse proxy. Khi do frontend goi relative `/api`.
- Dung `VITE_DEV_PROXY_TARGET` cho moi truong dev tach cong, vi du `http://localhost:8080`.
- Dat `VITE_API_URL=https://your-domain/api` neu frontend build static va backend o domain khac.

```bash
cd frontend
npm install
npm run dev
```

Frontend mac dinh chay tai `http://localhost:5173`.

## 3.1 Chay tren cac moi truong

Local dev:

- Backend: `PORT=8080`
- Frontend: de `VITE_API_URL=` va `VITE_DEV_PROXY_TARGET=http://localhost:8080`

LAN / test noi bo:

- Backend: dat `ALLOWED_ORIGINS=http://<ip-may-ban>:5173`
- Frontend: mo Vite tren host mang noi bo, da duoc bat `host: true`

Production cung domain:

- Deploy frontend va backend sau reverse proxy
- Route `/api` tro vao backend
- De trong `VITE_API_URL=`
- Dat `ALLOWED_ORIGINS=https://your-domain`

Production tach domain:

- Frontend: `VITE_API_URL=https://api.your-domain/api`
- Backend: `ALLOWED_ORIGINS=https://app.your-domain`
- Neu dung HTTPS, bat `SECURE_COOKIES=true`

## 4. API chinh

Auth va tai khoan:

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/account/profile`
- `PUT /api/account/profile`
- `POST /api/user/me/change/password`

Du lieu thi sinh:

- `GET /api/huong-dan-su-dung/all`
- `GET /api/notification/me`
- `GET /api/dot-tuyen-sinh/all?namTuyenSinh=2025`
- `GET /api/nganh-chuyen-nganh/all`
- `GET /api/ho-so-xet-tuyen/thi-sinh/my/many`

API admin:

- `GET /api/admin/dashboard/summary`
- `GET /api/admin/applications`
- `GET /api/admin/applications/:id`
- `PATCH /api/admin/applications/:id/status`
- `GET /api/admin/candidates`
- `GET /api/admin/candidates/:id`
- `GET /api/admin/export/applications.csv`
- `GET /api/admin/export/candidates.csv`

## 5. Kiem tra da thuc hien

Da chay:

- syntax check backend source
- build frontend production thanh cong bang `npm.cmd run build`

Chua chay:

- smoke test backend ket noi MySQL thuc te, vi can database local theo `database/db.sql`
