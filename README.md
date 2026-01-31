# Mosaic Backend

Backend service for the Mosaic project. This repository includes the REST API (auth, data access) and the AI module that will power microlearning with RAG.

## Requirements

- Node.js 20+
- MySQL 8+

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file (copy from `.env.example`) and fill the values:

   ```env
   NODE_ENV=development
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=mosaic
   DB_USER=root
   DB_PASSWORD=password
   JWT_SECRET=supersecret
   JWT_EXPIRES_IN=7d
   ```

3. Build and run migrations (migrations are TypeScript and run from `dist`):

   ```bash
   npm run db:migrate
   ```

4. Start the API:
   ```bash
   npm run dev
   ```

## API Routes

Base path: `/api/v1`

- `POST /auth/register`
- `POST /auth/login`
- `GET /health`
- `GET /protected/test`

## Notes

- Responses are standardized with: `message`, `data`, `success`, `statusCode`.
- The AI module is part of this backend and will be integrated in the next steps.
