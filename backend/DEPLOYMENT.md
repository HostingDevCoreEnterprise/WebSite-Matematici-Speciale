# Deployment Guide: Matematici Speciale (Backend API)

This directory contains the Express.js API for the Matematici Speciale platform.

## Prerequisites
- A Render account (https://render.com)
- A Neon account (https://neon.tech)
- A repository containing this code

## Neon Database Configuration
1. **Create a Neon Project**: In the Neon dashboard, create a new project with PostgreSQL.
2. **Connection String**: Retrieve your connection string from the Dashboard (look for `DATABASE_URL`). It should look like `postgresql://user:password@host/dbname?sslmode=require`.
3. **Database Schema**: Execute the commands in `schema.sql` to create the required tables. You can use the Neon SQL editor or a tool like `psql`.
4. **Seed Data (Optional)**: If you need initial data, run `insert_data.sql` to populate the database with default announcements, materials, and questions.

## Render Configuration
Deploy as a **Web Service** on Render.

1. **Create a New Web Service** in your Render Dashboard.
2. **Connect Repository**: Select the repository that contains this project.
3. **Configuration**:
   - **Name**: `ms-api`
   - **Environment**: `Node`
   - **Branch**: `main`
   - **Root Directory**: `ms site/backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node servers.js`
4. **Environment Variables**:
   Add the following variables:
   - `DATABASE_URL`: [Your Neon Connection String]
   - `JWT_SECRET`: [A secure random string]
   - `PORT`: `4000` (Render will override this, but it's good practice)
5. **Deploy**: Click "Create Web Service".

## CORS & Domains
The API is configured in `servers.js` to allow CORS only from:
- `http://localhost:3000` (for local development)
- `https://matematicispeciale.site`
- `https://dashboard.matematicispeciale.site`

If you change domains, ensure you update `allowedOrigins` in `servers.js`.

## Post-Deployment Verification
- Send a GET request to `https://api.matematicispeciale.site/api/health` and expect a JSON response `{"ok": true, ...}`.
- Ensure the frontend can fetch data without CORS errors.
