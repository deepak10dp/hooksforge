# 🗄️ MongoDB Setup Guide for Hooksforge

## Step-by-Step: Get Your FREE MongoDB Database

### Option 1: MongoDB Atlas (RECOMMENDED - FREE Forever)

MongoDB Atlas gives you a **FREE 512MB database** - perfect for Hooksforge!

---

## 📋 STEP-BY-STEP GUIDE

### **Step 1: Create MongoDB Atlas Account**

1. Go to: **https://www.mongodb.com/cloud/atlas/register**
2. Click **"Try Free"**
3. Sign up with:
   - Email
   - Or Google account (easier!)

---

### **Step 2: Create a FREE Cluster**

1. After signing in, you'll see "Create a deployment"
2. Choose **"M0 FREE"** option
   - ✅ 512MB storage
   - ✅ FREE forever
   - ✅ Perfect for your app

3. **Select Region:**
   - Choose closest to you (e.g., Mumbai, Singapore)
   - Keep cluster name as default or name it: `hooksforge-cluster`

4. Click **"Create Deployment"**
   - Wait 1-3 minutes for cluster to be ready

---

### **Step 3: Create Database User**

You'll see a popup asking to create a user:

1. **Username:** `hooksforge_user` (or any name you want)
2. **Password:** Click "Autogenerate Secure Password"
   - **IMPORTANT:** Copy this password! You'll need it!
   - Example: `xK9mP2nQ7vL4`

3. Click **"Create Database User"**

**SAVE THESE:**
```
Username: hooksforge_user
Password: xK9mP2nQ7vL4
```

---

### **Step 4: Set Up Network Access**

1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"**
   - This adds: `0.0.0.0/0`
   - ✅ Allows Railway/Vercel to connect
4. Click **"Confirm"**

---

### **Step 5: Get Your Connection String**

1. Click **"Database"** in left sidebar
2. Click **"Connect"** button (on your cluster)
3. Choose **"Drivers"**
4. Select **"Python"** and version **"3.12 or later"**
5. **Copy the connection string!**

It will look like this:
```
mongodb+srv://hooksforge_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

---

### **Step 6: Customize Your Connection String**

**Original:**
```
mongodb+srv://hooksforge_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**Replace `<password>` with your actual password:**
```
mongodb+srv://hooksforge_user:xK9mP2nQ7vL4@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**This is your MONGO_URL!** ✅

---

## ✅ Your Environment Variables

Now you have everything you need:

### **For Railway Backend:**

```bash
EMERGENT_LLM_KEY=sk-emergent-2281894C8Ba9628A18

MONGO_URL=mongodb+srv://hooksforge_user:xK9mP2nQ7vL4@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority

DB_NAME=hooksforge_db

CORS_ORIGINS=*
```

### **Explanation:**

1. **EMERGENT_LLM_KEY**
   - This is your AI key (already provided)
   - Used for GPT-5.2 hook generation
   - ✅ Already in your backend/.env

2. **MONGO_URL**
   - Your MongoDB connection string
   - Replace with the one from MongoDB Atlas
   - Include your username and password

3. **DB_NAME**
   - Name of your database
   - Use: `hooksforge_db`
   - MongoDB will create it automatically

4. **CORS_ORIGINS**
   - Controls which websites can access your API
   - `*` means allow all (fine for now)
   - Later change to: `https://hooksforge.com`

---

## 🚀 How to Add Environment Variables in Railway

### **When deploying to Railway:**

1. **Go to your Railway project**
2. Click on your **backend service**
3. Click **"Variables"** tab
4. Click **"+ New Variable"**
5. Add each variable:

**Variable 1:**
```
Name: EMERGENT_LLM_KEY
Value: sk-emergent-2281894C8Ba9628A18
```

**Variable 2:**
```
Name: MONGO_URL
Value: mongodb+srv://hooksforge_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**Variable 3:**
```
Name: DB_NAME
Value: hooksforge_db
```

**Variable 4:**
```
Name: CORS_ORIGINS
Value: *
```

6. Click **"Deploy"** - Railway will restart with new variables!

---

## 🔍 Verify MongoDB Connection

### **Test your connection:**

1. In MongoDB Atlas dashboard
2. Click **"Browse Collections"**
3. You should see `hooksforge_db` appear after first API call
4. Collections will be created automatically:
   - (Currently your app doesn't heavily use DB, but it's ready!)

---

## 🆘 Troubleshooting

### **Error: "Authentication failed"**
- ✅ Double-check username and password
- ✅ Make sure you replaced `<password>` in connection string

### **Error: "IP not whitelisted"**
- ✅ Go to Network Access in MongoDB Atlas
- ✅ Add `0.0.0.0/0` to allow all IPs

### **Error: "Connection timeout"**
- ✅ Check your MONGO_URL is correct
- ✅ Verify cluster is running (green dot in Atlas)

---

## 💡 Quick Copy-Paste Template

**For Railway Environment Variables:**

```bash
# Copy this and fill in your details:

EMERGENT_LLM_KEY=sk-emergent-2281894C8Ba9628A18

MONGO_URL=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority

DB_NAME=hooksforge_db

CORS_ORIGINS=*

PORT=8001
```

---

## 🎯 Summary

1. ✅ Sign up at **MongoDB Atlas** (free)
2. ✅ Create **M0 Free cluster**
3. ✅ Create **database user** with password
4. ✅ Allow **network access** (0.0.0.0/0)
5. ✅ Copy **connection string**
6. ✅ Replace **<password>** with actual password
7. ✅ Add to **Railway environment variables**
8. ✅ Deploy! 🚀

**Total time: 5-10 minutes!**

---

## 🔗 Important Links

- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas/register
- **Railway:** https://railway.app
- **Vercel:** https://vercel.com

---

## ✅ Next Steps After Setup

1. Deploy backend to Railway with these variables
2. Deploy frontend to Vercel
3. Test your app
4. Connect your domain
5. Go live! 🎉

**Your Hooksforge app will be fully functional!**
