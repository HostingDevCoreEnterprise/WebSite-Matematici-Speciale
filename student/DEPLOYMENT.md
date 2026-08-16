# Deployment Guide: Matematici Speciale (Frontend)

This directory contains the static frontend for the Matematici Speciale platform.

## Prerequisites
- A Render account (https://render.com)
- A repository containing this code
- Access to your domain DNS settings (`matematicispeciale.site`)
- The backend API must be deployed and available at `https://api.matematicispeciale.site`.

## Render Configuration
Deploy as a **Static Site** on Render.

1. **Create a New Static Site** in your Render Dashboard.
2. **Connect Repository**: Select the repository that contains this project.
3. **Configuration**:
   - **Name**: `ms-frontend`
   - **Branch**: `main`
   - **Root Directory**: `ms site/student`
   - **Build Command**: Leave empty.
   - **Publish Directory**: `.`
4. **Deploy**: Click "Create Static Site".

## DNS Configuration (matematicispeciale.site)
Configure your custom domain in Render:

1. Go to your Static Site settings > **Custom Domains**.
2. Add `matematicispeciale.site` and `www.matematicispeciale.site`.
3. Add the DNS records (CNAME for `www` and ALIAS/ANAME/A for `@`) provided by Render in your domain registrar's DNS settings.

## Environment & Configuration
The frontend configuration is hardcoded in `index.html` (and other files) inside `window.MS_CONFIG`. It has been pre-configured to:
- `apiBase`: `https://api.matematicispeciale.site`
- `adminBase`: `https://dashboard.matematicispeciale.site`

## Post-Deployment Verification
- Visit `https://matematicispeciale.site` and verify the content loads.
- Ensure API calls to the backend succeed (check browser console for CORS errors).
- Submit `https://matematicispeciale.site/sitemap.xml` to Google Search Console.
