# JoJoScentSation

A production-ready ecommerce storefront built with Next.js 15, TypeScript, Tailwind CSS, MongoDB Atlas, NextAuth, Cloudinary, Paystack, and Vercel.

## Features

- Customer storefront and product catalog
- Product pages with add-to-cart flow
- Shopping cart and checkout
- Order management and stock tracking
- Admin dashboard with role-based authentication
- Cloudinary-hosted perfume images
- MongoDB Atlas storage for products, users, orders, inventory

## Environment Variables

Create a `.env` file with:

```
MONGODB_URI=your_mongodb_atlas_connection_string
NEXTAUTH_URL=https://your-production-domain.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key
```

> Note: `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` is exposed to the browser and is required for Paystack checkout.

## Deployment

Deploy to Vercel and configure the environment variables in your Vercel dashboard. Do not commit `.env` or any API keys to source control.

## Production Readiness Checklist

- [x] Build passes with `npm run build`
- [x] No hardcoded secrets in source files
- [x] Reusable toast notifications and confirmation modal implemented
- [x] Accessible error boundary available
- [x] Cloudinary image uploads use signed server-side uploads
- [x] Role-based admin protection for API routes
- [x] Environment variables documented

## Run Locally

```bash
npm install
npm run dev
```

## Deployment

Deploy to Vercel and set the environment variables in your Vercel project.
