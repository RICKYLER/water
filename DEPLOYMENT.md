# Deployment Guide - Water Refilling Station App

This guide will help you deploy the Water Refilling Station Next.js application to Netlify.

## Prerequisites

- A Netlify account (free at [netlify.com](https://netlify.com))
- Your project code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
- Node.js 18+ installed locally for testing

## Deployment Steps

### 1. Prepare Your Repository

Ensure your code is pushed to a Git repository with the following files:
- `netlify.toml` (already configured)
- `.env.example` (for environment variable reference)
- `package.json` with build scripts

### 2. Connect to Netlify

1. Log in to your [Netlify dashboard](https://app.netlify.com)
2. Click "New site from Git"
3. Choose your Git provider (GitHub, GitLab, or Bitbucket)
4. Select your repository
5. Configure build settings:
   - **Build command**: `npm run build` (auto-detected from netlify.toml)
   - **Publish directory**: `.next` (auto-detected from netlify.toml)
   - **Node version**: 18 (configured in netlify.toml)

### 3. Environment Variables

If your app requires environment variables:

1. Go to Site settings → Environment variables
2. Add the required variables based on `.env.example`:
   - `NEXT_PUBLIC_APP_URL`: Your Netlify site URL
   - Add any other variables your app needs

### 4. Deploy

1. Click "Deploy site"
2. Netlify will automatically:
   - Install dependencies
   - Run the build command
   - Deploy your site
   - Provide you with a URL

### 5. Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Add your custom domain
3. Configure DNS settings as instructed by Netlify

## Build Configuration

The `netlify.toml` file includes:

- **Next.js Plugin**: Automatically handles Next.js optimization
- **Security Headers**: XSS protection, content type options, etc.
- **Caching**: Optimized caching for static assets
- **Redirects**: SPA routing support

## Troubleshooting

### Build Fails

1. Check the build logs in Netlify dashboard
2. Ensure all dependencies are in `package.json`
3. Test build locally: `npm run build`
4. Check Node.js version compatibility

### Environment Variables

1. Verify all required environment variables are set
2. Check variable names match exactly (case-sensitive)
3. Restart deployment after adding variables

### Performance Issues

1. Enable Netlify's asset optimization
2. Use Netlify Analytics for monitoring
3. Consider enabling Netlify's CDN features

## Post-Deployment

1. Test all functionality on the live site
2. Set up monitoring and analytics
3. Configure any necessary webhooks
4. Set up branch deploys for staging if needed

## Continuous Deployment

Netlify automatically redeploys when you push to your connected Git branch:

- **Production**: Usually `main` or `master` branch
- **Preview**: Pull requests get preview deployments
- **Branch deploys**: Configure additional branches if needed

## Support

- [Netlify Documentation](https://docs.netlify.com/)
- [Next.js on Netlify](https://docs.netlify.com/frameworks/next-js/)
- [Netlify Community](https://community.netlify.com/)

---

**Note**: This application uses local storage for data persistence. For production use, consider integrating with a database service like Supabase, PlanetScale, or MongoDB Atlas.