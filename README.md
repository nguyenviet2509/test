# nodejs-env-test

Test project cho feature "Biến môi trường" (AES-256-GCM v2) của Cloud Panel agent.

## Mục đích
- Verify HOST + PORT auto-inject theo `access_mode`
- Verify user-defined env vars (KEY=value, DATABASE_URL=..., ...) inject đúng vào process
- Sensitive values (SECRET/KEY/TOKEN/PASSWORD) được mask khi hiển thị

## Run
```bash
pnpm install   # hoặc npm install
pnpm start     # hoặc node src/index.js
```

## Endpoints
- `GET /` — HTML page liệt kê toàn bộ env vars (mask sensitive)
- `GET /env` — JSON dump toàn bộ env vars
- `GET /env/:key` — JSON 1 env var cụ thể

## Test với agent
1. Tạo project trong Cloud Panel, runtime = Node.js, point vào folder này
2. Add env vars trong tab "Biến môi trường":
   ```
   DATABASE_URL=postgresql://localhost/test
   MY_SECRET=super-secret-value
   APP_NAME=hello
   ```
3. Start project → mở `http://<host>:<port>/` → verify
   - `HOST` + `PORT` đúng theo `access_mode`
   - `DATABASE_URL`, `APP_NAME` hiện rõ
   - `MY_SECRET` bị mask thành `su***ue`
