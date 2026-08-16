# Deployment Guide: Matematici Speciale (Admin Dashboard)

This directory contains the static frontend for the Matematici Speciale Admin Dashboard.

## Prerequisites
- A Render account (https://render.com)
- A repository containing this code
- Access to your domain DNS settings (`dashboard.matematicispeciale.site`)
- The backend API must be deployed and available at `https://api.matematicispeciale.site`.

## Render Configuration
Deploy as a **Static Site** on Render.

1. **Create a New Static Site** in your Render Dashboard.
2. **Connect Repository**: Select the repository that contains this project.
3. **Configuration**:
   - **Name**: `ms-admin`
   - **Branch**: `main`
   - **Root Directory**: `ms site/admin`
   - **Build Command**: Leave empty.
   - **Publish Directory**: `.`
4. **Deploy**: Click "Create Static Site".

## DNS Configuration (dashboard.matematicispeciale.site)
Configure your custom domain in Render:

1. Go to your Static Site settings > **Custom Domains**.
2. Add `dashboard.matematicispeciale.site`.
3. Add the DNS records (CNAME) provided by Render in your domain registrar's DNS settings.

## Environment & Configuration
The frontend configuration is hardcoded in `index.html` inside `window.MS_CONFIG`. It has been pre-configured to:
- `apiBase`: `https://api.matematicispeciale.site`

## Post-Deployment Verification
- Visit `https://dashboard.matematicispeciale.site` and verify the content loads.
- Ensure API calls to the backend succeed and that you can login using admin credentials.
- `robots.txt` is configured to `Disallow: /` to prevent indexing of the dashboard.
