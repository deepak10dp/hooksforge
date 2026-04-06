# 🚀 Hooksforge Deployment Guide

## Option 1: Deploy to Vercel (RECOMMENDED - Easiest & Free)

### Why Vercel?
- ✅ **FREE forever** for hobby projects
- ✅ **Automatic HTTPS** (secure)
- ✅ **Connect your domain** easily
- ✅ **Auto-deploys** from GitHub
- ✅ **Fast global CDN**

### Steps to Deploy on Vercel:

#### 1. **Prepare Your Code**
Your code is already deployment-ready! ✅

#### 2. **Push to GitHub** (if not already)
```bash
# On your local machine (after downloading code from Emergent)
git init
git add .
git commit -m "Initial commit - Hooksforge"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hooksforge.git
git push -u origin main
```

#### 3. **Deploy to Vercel**
1. Go to **https://vercel.com**
2. Click **"Sign Up"** (use GitHub account)
3. Click **"New Project"**
4. Import your GitHub repository
5. Vercel will auto-detect React + FastAPI
6. Click **"Deploy"**

#### 4. **Environment Variables** (IMPORTANT)
In Vercel dashboard, add these:

**Backend Environment Variables:**
```
EMERGENT_LLM_KEY=sk-emergent-2281894C8Ba9628A18
MONGO_URL=your_mongodb_connection_string
DB_NAME=hooksforge_db
CORS_ORIGINS=*
```

**Frontend Environment Variables:**
```
REACT_APP_BACKEND_URL=https://your-app.vercel.app
```

#### 5. **Connect Your Domain** (hooksforge domain)
1. In Vercel dashboard → Settings → Domains
2. Add your domain: `hooksforge.com`
3. Follow DNS instructions provided
4. Update nameservers in your domain registrar

**Done! Your site will be live at:** `https://hooksforge.com` ✅

---

## Option 2: Deploy to Netlify (Also Free & Easy)

### Steps:
1. Go to **https://netlify.com**
2. Sign up with GitHub
3. Click **"Add new site"** → Import from GitHub
4. Choose your repository
5. Build settings:
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/build`
6. Add environment variables (same as Vercel)
7. Deploy!

**Connect domain same way as Vercel**

---

## Option 3: Deploy to Google Cloud (Advanced)

### Using Google App Engine:

1. **Install Google Cloud SDK**
2. **Create app.yaml** for backend
3. **Deploy backend:**
   ```bash
   gcloud app deploy
   ```
4. **Deploy frontend** to Firebase Hosting
5. **Connect domain**

**Note:** More complex, costs may apply

---

## 📊 Make Your Website Appear on Google Search

### 1. **Submit to Google Search Console**

1. Go to **https://search.google.com/search-console**
2. Add your property: `https://hooksforge.com`
3. Verify ownership (multiple methods available)
4. Submit sitemap: `https://hooksforge.com/sitemap.xml`

### 2. **Create a Sitemap** (Add to your project)

Create `/app/frontend/public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://hooksforge.com/</loc>
    <lastmod>2025-04-06</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://hooksforge.com/privacy</loc>
    <lastmod>2025-04-06</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

### 3. **Add SEO Meta Tags** (Already should be there, but verify)

Update `/app/frontend/public/index.html`:

```html
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  
  <!-- SEO Meta Tags -->
  <title>Hooksforge - Viral Hook Generator | Create Scroll-Stopping Content</title>
  <meta name="description" content="Generate viral social media hooks, captions, and video ideas instantly. AI-powered hook generator for Instagram, YouTube, and TikTok creators." />
  <meta name="keywords" content="hook generator, viral hooks, social media content, Instagram hooks, YouTube hooks, content creator tools" />
  
  <!-- Open Graph (for sharing on social media) -->
  <meta property="og:title" content="Hooksforge - Viral Hook Generator" />
  <meta property="og:description" content="Create scroll-stopping hooks for your content in seconds" />
  <meta property="og:image" content="https://hooksforge.com/og-image.png" />
  <meta property="og:url" content="https://hooksforge.com" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Hooksforge - Viral Hook Generator" />
  <meta name="twitter:description" content="Create scroll-stopping hooks for your content" />
  <meta name="twitter:image" content="https://hooksforge.com/og-image.png" />
</head>
```

### 4. **Create robots.txt** 

Create `/app/frontend/public/robots.txt`:

```txt
User-agent: *
Allow: /
Sitemap: https://hooksforge.com/sitemap.xml
```

---

## 🎯 Quick Checklist for Going Live

### Before Deployment:
- [x] Code is deployment-ready (✅ Already done!)
- [x] Environment variables configured
- [x] Domain purchased (hooksforge.com)
- [ ] Add sitemap.xml
- [ ] Add SEO meta tags
- [ ] Add robots.txt
- [ ] Create og-image.png (1200x630px)

### After Deployment:
- [ ] Test the live site
- [ ] Submit to Google Search Console
- [ ] Share on social media
- [ ] Monitor analytics

---

## 📈 Get Traffic to Your Website

### 1. **Social Media**
- Share on Instagram: @hooksforge
- Post on Twitter/X
- Create demo videos on YouTube
- Post in creator communities

### 2. **Content Marketing**
- Write blog posts about hook writing
- Create tutorials
- Share success stories

### 3. **SEO Optimization**
- Use relevant keywords
- Create quality backlinks
- Regular content updates

---

## 💡 Recommended: Use Vercel

**Why Vercel is best for Hooksforge:**
- Deploy in 5 minutes
- Free SSL certificate
- Automatic deployments from GitHub
- Perfect for React + FastAPI apps
- Great performance globally

**Your deployment URL will be:**
- Development: `https://hooksforge.vercel.app`
- Production: `https://hooksforge.com` (after domain connection)

---

## 🆘 Need Help?

**Common Issues:**
1. **Build fails**: Check environment variables
2. **API not working**: Verify REACT_APP_BACKEND_URL
3. **Domain not connecting**: Wait 24-48 hours for DNS propagation

**Resources:**
- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- Google Search Console: https://search.google.com/search-console

---

## ✅ Next Steps

1. **Choose deployment platform** (Recommend: Vercel)
2. **Push code to GitHub**
3. **Deploy to Vercel**
4. **Connect your domain**
5. **Add SEO files** (sitemap, robots.txt)
6. **Submit to Google Search Console**
7. **Share with the world!** 🚀

Your Hooksforge app is ready to go live!
