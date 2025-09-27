#!/usr/bin/env node

/**
 * Pre-deployment check script for Netlify
 * Run this before deploying to ensure everything is ready
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Netlify Deployment Pre-Check\n');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'next.config.mjs',
  'netlify.toml',
  'app/layout.tsx'
];

console.log('📁 Checking required files...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING!`);
    process.exit(1);
  }
});

// Check package.json scripts
console.log('\n📦 Checking package.json scripts...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

if (packageJson.scripts.build) {
  console.log('✅ Build script found');
} else {
  console.log('❌ Build script missing!');
  process.exit(1);
}

if (packageJson.scripts.start) {
  console.log('✅ Start script found');
} else {
  console.log('❌ Start script missing!');
  process.exit(1);
}

// Test build process
console.log('\n🔨 Testing build process...');
try {
  execSync('npm run build', { stdio: 'pipe' });
  console.log('✅ Build successful!');
} catch (error) {
  console.log('❌ Build failed!');
  console.log(error.stdout?.toString());
  console.log(error.stderr?.toString());
  process.exit(1);
}

// Check .next directory
if (fs.existsSync('.next')) {
  console.log('✅ .next directory created');
} else {
  console.log('❌ .next directory not found!');
  process.exit(1);
}

// Check netlify.toml configuration
console.log('\n⚙️ Checking Netlify configuration...');
const netlifyConfig = fs.readFileSync('netlify.toml', 'utf8');

if (netlifyConfig.includes('publish = ".next"')) {
  console.log('✅ Publish directory configured');
} else {
  console.log('❌ Publish directory not configured!');
  process.exit(1);
}

if (netlifyConfig.includes('command = "npm run build"')) {
  console.log('✅ Build command configured');
} else {
  console.log('❌ Build command not configured!');
  process.exit(1);
}

if (netlifyConfig.includes('@netlify/plugin-nextjs')) {
  console.log('✅ Next.js plugin configured');
} else {
  console.log('❌ Next.js plugin not configured!');
  process.exit(1);
}

console.log('\n🎉 All checks passed! Your app is ready for Netlify deployment.');
console.log('\n📋 Next steps:');
console.log('1. Push your code to GitHub');
console.log('2. Connect your GitHub repo to Netlify');
console.log('3. Deploy your site');
console.log('\n📖 See NETLIFY_DEPLOYMENT_GUIDE.md for detailed instructions.');