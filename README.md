# InstaPulse Website

A professional business website for InstaPulse - an emergency alert and rapid response system. Built with Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, and Supabase.

## Features

- **Landing Page**: Modern hero section, introduction, key benefits, and call-to-action
- **Product Packages**: SaaS-style pricing cards with package comparison
- **Authentication**: Login and register pages with Supabase auth
- **KYC Verification**: Document upload system for identity verification
- **Client Dashboard**: Package info, payment status, KYC status, and account settings
- **Admin Dashboard**: User management, KYC approvals, order management, and payment monitoring
- **Checkout Page**: PayMongo payment integration with multiple payment methods
- **Contact Page**: Contact form, location map, and social media links
- **Responsive Design**: Mobile-first approach with hamburger menu for mobile devices
- **Animations**: Smooth Framer Motion animations throughout the site
- **Security**: Row-level security (RLS) policies in Supabase

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend**: Supabase (Authentication, Database, Storage)
- **Payment**: PayMongo API
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ installed
- Supabase account (for backend services)
- PayMongo account (for payment processing)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd instapulse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_PAYMONGO_PUBLIC_KEY=your_paymongo_public_key
PAYMONGO_SECRET_KEY=your_paymongo_secret_key
```

### 4. Set up Supabase

1. Create a new project in [Supabase](https://supabase.com)
2. Run the SQL schema from `supabase/schema.sql` in the Supabase SQL Editor
3. Enable Storage and create a bucket named `kyc-documents`
4. Configure Storage policies for the bucket

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
instapulse/
├── src/
│   ├── app/
│   │   ├── admin/          # Admin dashboard
│   │   ├── checkout/       # Checkout page
│   │   ├── contact/        # Contact page
│   │   ├── dashboard/      # Client dashboard
│   │   ├── kyc/            # KYC verification page
│   │   ├── login/          # Login page
│   │   ├── packages/       # Product packages page
│   │   ├── register/       # Register page
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Landing page
│   ├── components/
│   │   └── Navigation.tsx  # Navigation component
│   ├── lib/
│   │   ├── supabase.ts     # Supabase client
│   │   └── utils.ts        # Utility functions
│   ├── styles/
│   │   └── globals.css     # Global styles
│   └── types/
│       └── database.ts     # TypeScript types
├── supabase/
│   └── schema.sql          # Database schema
├── public/                 # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Database Schema

The database includes the following tables:

- **users**: User profiles and KYC status
- **packages**: Security package offerings
- **package_items**: Items included in each package
- **orders**: Customer orders
- **payments**: Payment records
- **kyc_documents**: KYC verification documents

See `supabase/schema.sql` for the complete schema with RLS policies.

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to add these in your Vercel project settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_PAYMONGO_PUBLIC_KEY`
- `PAYMONGO_SECRET_KEY`

## Payment Integration

The checkout page integrates with PayMongo for payment processing. Supported payment methods:

- GCash
- Maya
- Credit/Debit Card
- Online Banking

To set up PayMongo:

1. Create a PayMongo account
2. Get your API keys from the dashboard
3. Add keys to environment variables
4. Implement payment processing in API routes

## Security Features

- Row-Level Security (RLS) policies in Supabase
- Secure file upload to Supabase Storage
- Environment variable protection
- Input validation and sanitization
- KYC verification system

## Customization

### Colors

The color scheme is defined in `tailwind.config.ts`:

- Primary: Dark Navy Blue (#0f172a)
- Accent: Red (#dc2626)
- Background: White and Gray

### Fonts

The project uses the Inter font family via Google Fonts.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For support, contact admin@instapulse.site or visit the contact page.

---

Built with ❤️ for InstaPulse
