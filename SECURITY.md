# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | ✅        |
| < 1.0   | ❌        |

## Reporting a Vulnerability

If you discover a security vulnerability in InstaPulse, please report it responsibly.

### How to Report

**Email:** admin@instapulse.site

**Subject:** Security Vulnerability Report - [Brief Description]

Please include:
- A description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Any suggested fixes (if available)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Investigation**: Within 7 business days
- **Resolution**: As soon as feasible based on severity

### What to Expect

1. We will acknowledge receipt of your report
2. We will investigate the vulnerability
3. We will work on a fix
4. We will notify you when the fix is deployed
5. We may credit you in the release notes (with your permission)

## Security Best Practices

### For Developers

- Never commit sensitive data (API keys, passwords, tokens)
- Use environment variables for all sensitive configuration
- Keep dependencies updated
- Follow the principle of least privilege
- Review code for common vulnerabilities (XSS, SQL injection, etc.)
- Test authentication and authorization flows
- Validate and sanitize all user inputs

### For Users

- Use strong, unique passwords
- Enable two-factor authentication when available
- Keep your browser and operating system updated
- Be cautious of phishing attempts
- Report suspicious activity immediately

## Security Features

### Implemented

- **Row-Level Security (RLS)**: Database access controls via Supabase
- **Secure File Upload**: Documents uploaded to private Supabase Storage
- **Environment Variables**: Sensitive data never committed to code
- **Input Validation**: All user inputs are validated and sanitized
- **KYC Verification**: Identity verification for users
- **HTTPS**: All communications encrypted in transit

### Payment Security

- PayMongo integration for secure payment processing
- No credit card data stored on our servers
- PCI DSS compliant payment processing
- Secure checkout flow

## Dependency Management

We regularly update dependencies to address security vulnerabilities. Automated dependency scanning is recommended.

## Security Audits

This project is designed with security in mind, but formal security audits are not currently scheduled. If you're interested in sponsoring a security audit, please contact us.

## Disclosure Policy

We follow responsible disclosure practices:

1. Give vendors time to fix vulnerabilities before public disclosure
2. Coordinate public disclosure with the vendor
3. Provide sufficient information for users to understand and mitigate risks
4. Credit security researchers who follow responsible disclosure

## License

This security policy is provided as-is without warranty of any kind.

---

Thank you for helping keep InstaPulse secure!
