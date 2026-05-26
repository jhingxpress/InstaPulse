# Changelog

All notable changes to the InstaPulse project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- YouTube link to social media section on contact page
- Updated Facebook link to new share URL

### Changed
- Removed Messenger link from social media section

## [1.0.0] - 2026-05-27

### Added
- Initial release of InstaPulse website
- Landing page with hero section and key benefits
- Product packages page with SaaS-style pricing
- User authentication (login/register) with Supabase
- KYC verification system with document upload
- Client dashboard with package info and payment status
- Admin dashboard with user management and KYC approvals
- Checkout page with PayMongo payment integration
- Contact page with location map and social media links
- Responsive design with mobile navigation
- Framer Motion animations throughout
- Row-level security (RLS) policies in Supabase
- Support for GCash, Maya, Credit/Debit Card, and Online Banking payments

### Security
- Implemented secure file upload to Supabase Storage
- Environment variable protection
- Input validation and sanitization
- KYC verification system for user identity

---

## Version Format

- **Major**: Breaking changes or major new features
- **Minor**: New features, backwards compatible
- **Patch**: Bug fixes, backwards compatible
