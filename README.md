# node-di-option-cjs

CommonJS project (no TypeScript). Build with webpack to produce a CommonJS bundle `dist/server.cjs`.
Run with `npm run build` then `npm run start`.

Structure:
- src/server.js        -> entry (starts server)
- src/createApp.js     -> builds express app
- src/startup/initContainer.js -> background DB init + proxy router
- src/di/container.js  -> builds DI container, authenticates
- src/* other modules as needed


docker exec -i mysqldb mysql -uappuser -papppassword123 appdb -e "
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);"

docker compose up -d
docker compose down
