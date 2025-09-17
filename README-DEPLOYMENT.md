# Vercel Deployment Guide

## Pre-deployment Checklist

✅ **Files Added/Modified for Vercel:**
- `vercel.json` - Vercel configuration
- `.vercelignore` - Files to ignore during deployment
- Updated `server.js` - Proper route handling
- Updated `script.js` - Dynamic API URL
- Updated `package.json` - Build scripts

## Deployment Steps

### 1. Install Vercel CLI (if not already installed)
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy to Vercel
```bash
vercel
```

### 4. Set Environment Variables
In your Vercel dashboard, go to your project settings and add:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Your JWT secret key
- `OPENAI_API_KEY` - Your OpenAI API key (optional)
- `NODE_ENV` - Set to `production`

### 5. Redeploy (if needed)
```bash
vercel --prod
```

## Important Notes

- **API URLs**: The app automatically detects if it's running locally or in production
- **Static Files**: All files in `/public` are served as static assets
- **Database**: Make sure your MongoDB URI is accessible from Vercel
- **Environment Variables**: Set all required env vars in Vercel dashboard

## Troubleshooting

### If you see only HTML without functionality:
1. Check browser console for API errors
2. Verify environment variables are set in Vercel
3. Ensure MongoDB connection is working

### If API routes don't work:
1. Check that `vercel.json` is properly configured
2. Verify all API routes start with `/api/`
3. Check server logs in Vercel dashboard

## Testing After Deployment

1. Visit your deployed URL
2. Test login/register functionality
3. Test career browsing
4. Test chatbot functionality
5. Check all sections work properly

Your project should now be fully functional on Vercel! 🚀