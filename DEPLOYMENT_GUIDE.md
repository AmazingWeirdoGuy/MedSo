# ISB Medical Society - Deployment Guide

Complete step-by-step instructions to deploy your website to Vercel with Decap CMS.

## Prerequisites

- GitHub account
- Vercel account (free tier works perfectly)
- Git installed on your computer

---

## Step 1: Create a New GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the **+** icon in the top right → **New repository**
3. Configure your repository:
   - **Repository name**: `isb-medical-society` (or your preferred name)
   - **Visibility**: Choose **Public** (required for free Decap CMS)
   - **DO NOT** initialize with README, .gitignore, or license
4. Click **Create repository**
5. **Important**: Keep this page open - you'll need the repository URL

---

## Step 2: Push Your Code to GitHub

### Option A: If starting fresh from Replit

1. Open the Shell/Terminal in Replit
2. Initialize git (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - ISB Medical Society website"
   ```

3. Connect to your GitHub repository:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```
   
   Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual values.

### Option B: If working locally

1. Download all files from Replit
2. Open terminal in the project folder
3. Run the same git commands as Option A above

---

## Step 3: Set Up GitHub OAuth for Decap CMS

Decap CMS uses GitHub OAuth for authentication. You need to create an OAuth app:

1. Go to GitHub → **Settings** → **Developer settings** → **OAuth Apps**
2. Click **New OAuth App**
3. Fill in the details:
   - **Application name**: `ISB Medical Society CMS`
   - **Homepage URL**: `https://YOUR_SITE_NAME.vercel.app` (you'll update this after deploying)
   - **Authorization callback URL**: `https://api.netlify.com/auth/done`
     - (Yes, use Netlify's URL - it's compatible with Decap CMS on any host)
4. Click **Register application**
5. **Important**: Copy the **Client ID** immediately
6. Click **Generate a new client secret** and copy the **Client Secret**
7. **Save these values** - you'll need them for Vercel

---

## Step 4: Deploy to Vercel

### 4.1: Import Your Repository

1. Go to [Vercel](https://vercel.com) and log in
2. Click **Add New** → **Project**
3. Import your GitHub repository:
   - Click **Import** next to your `isb-medical-society` repository
   - If you don't see it, click **Adjust GitHub App Permissions** to grant access

### 4.2: Configure Build Settings

Vercel should auto-detect these settings, but verify:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist/public`
- **Install Command**: `npm install`

### 4.3: Add Environment Variables

Click **Environment Variables** and add these:

| Name | Value |
|------|-------|
| `VITE_GITHUB_REPO` | `YOUR_USERNAME/YOUR_REPO_NAME` |
| `VITE_GITHUB_BRANCH` | `main` |

Replace with your actual GitHub username and repository name.

### 4.4: Deploy

1. Click **Deploy**
2. Wait 2-3 minutes for the build to complete
3. Once done, click **Visit** to see your live site
4. **Copy your Vercel URL** (e.g., `https://isb-medical-society.vercel.app`)

---

## Step 5: Update GitHub OAuth App

Now update your OAuth app with the real Vercel URL:

1. Go back to GitHub → **Settings** → **Developer settings** → **OAuth Apps**
2. Click on your **ISB Medical Society CMS** app
3. Update the **Homepage URL** to your Vercel URL
4. **Keep** the Authorization callback URL as `https://api.netlify.com/auth/done`
5. Click **Update application**

---

## Step 6: Configure Decap CMS OAuth

You need to tell Decap CMS about your OAuth credentials:

1. Go to your live site: `https://YOUR_SITE.vercel.app/admin`
2. Click **Login with GitHub**
3. The first time, you'll need to use a **Git Gateway** alternative:

### Update the CMS config file in your repository:

Edit `client/public/admin/config.yml` and update the backend section:

```yaml
backend:
  name: github
  repo: YOUR_USERNAME/YOUR_REPO_NAME
  branch: main
  base_url: https://api.netlify.com
  auth_endpoint: auth
```

Then add these to your Vercel environment variables:

| Name | Value |
|------|-------|
| `VITE_OAUTH_CLIENT_ID` | Your GitHub OAuth Client ID |

**Important Note**: For security, the Client Secret should not be exposed. Decap CMS with GitHub backend works client-side with just the Client ID when using Netlify's OAuth service.

### Alternative: Use Netlify Identity (Recommended for simplicity)

If GitHub OAuth is complex, use Netlify Identity:

1. Create a free Netlify account
2. Create a new site (just for Identity service - no deployment needed)
3. Enable Identity service in Netlify
4. Update `client/public/admin/config.yml`:

```yaml
backend:
  name: git-gateway
  branch: main

# Add this line at the top level
```

Then add the Netlify Identity widget script in your `index.html`.

---

## Step 7: Test the Admin Interface

1. Visit `https://YOUR_SITE.vercel.app/admin`
2. Click **Login with GitHub**
3. Authorize the application
4. You should now see the Decap CMS admin interface

You can now edit:
- **Members** - Add/edit/delete member profiles
- **News** - Publish news articles
- **Hero Images** - Update homepage carousel
- **Programs** - Manage educational programs
- **Member Classes** - Edit member categories

---

## Step 8: Set Up Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click **Settings** → **Domains**
3. Add your custom domain (e.g., `isbmedicalsociety.org`)
4. Follow Vercel's DNS configuration instructions
5. Update your GitHub OAuth app Homepage URL to use the custom domain

---

## How Content Updates Work

1. **Edit content** in the CMS at `/admin`
2. Click **Save** (creates a draft)
3. Click **Publish** (commits to GitHub)
4. **Vercel automatically rebuilds** (takes 1-2 minutes)
5. Changes appear live on your site

---

## Troubleshooting

### "Config file not found" error
- Make sure `client/public/admin/config.yml` exists
- Check that the file is in the `dist/public/admin` folder after build

### "OAuth Error" when logging in
- Verify GitHub OAuth Client ID is correct
- Check that callback URL is exactly `https://api.netlify.com/auth/done`
- Make sure repository is public (private repos require paid Decap CMS)

### Changes not appearing after publish
- Wait 2-3 minutes for Vercel rebuild
- Check Vercel deployment logs
- Verify content files in `/content` directory were updated on GitHub

### Build fails on Vercel
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

---

## Important Notes

✅ **Zero cost hosting** - Everything is free (Vercel free tier + GitHub + Decap CMS)

✅ **No database needed** - All content in JSON files in the repository

✅ **Git-based workflow** - Every content change is a git commit (full version history)

✅ **Automatic deployments** - Push to GitHub → Vercel rebuilds automatically

⏱️ **Update timing** - Content changes take 1-2 minutes to go live (not instant)

🔒 **GitHub authentication** - Only GitHub collaborators can access `/admin`

---

## Quick Reference

- **Live Site**: `https://YOUR_SITE.vercel.app`
- **Admin CMS**: `https://YOUR_SITE.vercel.app/admin`
- **Repository**: `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME`
- **Content Files**: `/content` directory in repository

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review browser console for errors
3. Verify all environment variables are set correctly
4. Ensure GitHub OAuth app configuration matches your URLs

---

**Your ISB Medical Society website is now live! 🎉**
