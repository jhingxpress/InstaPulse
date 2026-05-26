# InstaPulse Admin Guide

This guide is for administrators managing the InstaPulse platform. It covers user management, KYC verification, order processing, and payment monitoring.

## Table of Contents

- [Admin Dashboard Overview](#admin-dashboard-overview)
- [User Management](#user-management)
- [KYC Verification](#kyc-verification)
- [Order Management](#order-management)
- [Payment Monitoring](#payment-monitoring)
- [Support Management](#support-management)
- [Best Practices](#best-practices)

## Admin Dashboard Overview

The admin dashboard provides a centralized interface for managing all aspects of the InstaPulse platform.

### Accessing the Dashboard

1. Log in with your admin credentials
2. Navigate to `/admin` or click "Admin Dashboard" in the navigation
3. Verify your admin role is active

### Dashboard Sections

- **Users**: View and manage all registered users
- **KYC Approvals**: Review and approve/reject KYC documents
- **Orders**: Manage customer orders
- **Payments**: Monitor payment transactions
- **Support**: Handle customer support requests

## User Management

### Viewing Users

1. Navigate to the Users section
2. Browse the user list with pagination
3. Use filters to find specific users:
   - By name
   - By email
   - By registration date
   - By status

### User Information

Each user profile displays:
- Personal information (name, email, phone)
- Registration date
- KYC status
- Active package
- Payment status
- Account status (active/suspended)

### Managing User Accounts

#### Suspending a User

1. Open the user's profile
2. Click "Suspend Account"
3. Provide a reason for suspension
4. Confirm the action

#### Reactivating a User

1. Open the suspended user's profile
2. Click "Reactivate Account"
3. Confirm the action

#### Deleting a User

⚠️ **Warning**: This action is irreversible.

1. Open the user's profile
2. Click "Delete Account"
3. Confirm the deletion
4. All associated data will be removed

## KYC Verification

### Review Queue

The KYC Approvals section shows all pending verifications in chronological order.

### Review Process

#### Step 1: Open Verification Request

1. Click on a pending verification
2. Review the submitted documents:
   - Government ID (front and back)
   - Proof of address
   - Selfie with ID

#### Step 2: Verify Documents

Check for:
- Document authenticity
- Clear, readable information
- Valid expiration date
- Matching information across documents
- Clear selfie with visible ID

#### Step 3: Make Decision

**Approve** if:
- All documents are valid
- Information is consistent
- Documents are clear and readable

**Reject** if:
- Documents are invalid or expired
- Information doesn't match
- Documents are unclear or incomplete
- Suspicious activity detected

#### Step 4: Provide Feedback (if rejecting)

When rejecting, provide:
- Clear reason for rejection
- Which documents need resubmission
- Instructions for correction

### Verification Timeline

- Aim to process within 24-48 hours
- Prioritize users with pending orders
- Communicate delays to users

## Order Management

### Viewing Orders

1. Navigate to the Orders section
2. Browse all customer orders
3. Filter by:
   - Order status (pending, processing, completed, cancelled)
   - Date range
   - Package type
   - Customer name

### Order Processing

#### New Orders

1. Review order details
2. Verify payment status
3. Check KYC status (if required)
4. Update order status to "Processing"
5. Schedule installation (if applicable)

#### Order Completion

1. Confirm installation/service delivery
2. Update order status to "Completed"
3. Send confirmation to customer
4. Update customer's active package

#### Order Cancellation

1. Review cancellation reason
2. Check refund eligibility
3. Process refund if applicable
4. Update order status to "Cancelled"
5. Notify customer

### Order Statuses

- **Pending**: Order placed, awaiting payment
- **Processing**: Payment received, being prepared
- **Completed**: Order fulfilled
- **Cancelled**: Order cancelled by customer or admin
- **Refunded**: Refund processed

## Payment Monitoring

### Viewing Payments

1. Navigate to the Payments section
2. View all payment transactions
3. Filter by:
   - Payment status (success, failed, pending)
   - Payment method
   - Date range
   - Amount

### Payment Methods

- GCash
- Maya
- Credit/Debit Card
- Online Banking

### Handling Payment Issues

#### Failed Payments

1. Identify the failed transaction
2. Check the error reason
3. Contact the customer
4. Guide them to retry payment
5. Escalate to PayMongo if needed

#### Disputed Payments

1. Review the dispute details
2. Gather evidence (order details, communication)
3. Respond to the dispute through PayMongo
4. Follow up until resolution

#### Refunds

1. Verify refund eligibility
2. Process refund through PayMongo
3. Update payment status
4. Notify customer
5. Record refund in system

### Payment Reconciliation

Regularly:
- Compare system records with PayMongo dashboard
- Identify discrepancies
- Reconcile unmatched transactions
- Generate financial reports

## Support Management

### Viewing Support Requests

1. Navigate to the Support section
2. View all customer messages
3. Filter by:
   - Status (open, in progress, resolved, closed)
   - Priority (low, medium, high, urgent)
   - Category
   - Date

### Handling Support Requests

#### Response Process

1. Read the customer's message
2. Review their account and order history
3. Categorize the issue
4. Set appropriate priority
5. Respond with a solution or next steps
6. Update status to "In Progress" or "Resolved"

#### Response Guidelines

- Respond within 24 hours for standard requests
- Respond within 4 hours for high-priority issues
- Respond immediately for urgent/emergency situations
- Be clear, professional, and helpful
- Provide step-by-step instructions when needed

#### Escalation

Escalate to senior staff when:
- Issue requires specialized knowledge
- Customer is dissatisfied with initial response
- Issue affects multiple users
- Technical problem requires developer intervention

### Support Categories

- **Technical**: System issues, bugs, errors
- **Billing**: Payment, invoices, refunds
- **Account**: Login, registration, settings
- **Package**: Upgrades, changes, features
- **Installation**: Setup, configuration
- **General**: Questions, feedback

## Best Practices

### Security

- Never share admin credentials
- Use strong, unique passwords
- Enable two-factor authentication
- Log out after each session
- Report suspicious activity immediately
- Regularly review access logs

### User Privacy

- Protect user data at all times
- Only access information when necessary
- Follow data protection regulations
- Don't share user information externally
- Anonymize data in reports

### Communication

- Be professional and courteous
- Respond promptly to inquiries
- Provide clear, accurate information
- Keep records of all communications
- Follow up on unresolved issues

### Workflow

- Process KYC verifications daily
- Review new orders regularly
- Monitor payment transactions
- Check support queue frequently
- Generate weekly reports

### Documentation

- Document unusual cases
- Keep records of decisions
- Update procedures as needed
- Share knowledge with team
- Maintain audit trails

## Troubleshooting

### Common Issues

#### User Can't Access Dashboard

- Check if account is suspended
- Verify KYC status
- Check for system errors
- Reset user password if needed

#### KYC Documents Not Loading

- Check Supabase Storage connection
- Verify file permissions
- Check file size limits
- Clear browser cache

#### Payment Not Reflected

- Check PayMongo webhook status
- Verify payment ID in system
- Check for processing delays
- Contact PayMongo support if needed

#### Support Messages Not Sending

- Check notification settings
- Verify email configuration
- Check Supabase database connection
- Review error logs

## System Maintenance

### Regular Tasks

- **Daily**: Review KYC queue, check new orders
- **Weekly**: Generate reports, reconcile payments
- **Monthly**: Review user accounts, audit access logs
- **Quarterly**: Review procedures, update documentation

### Backups

- Database backups are automatic
- Verify backup integrity regularly
- Test restore procedures
- Keep backup retention policy

### Updates

- Test updates in staging environment first
- Schedule updates during low-traffic periods
- Notify users of planned maintenance
- Monitor system after updates

## Contact Information

For admin-specific issues or questions:
- Email: admin@instapulse.site
- Phone: +63 939 920 8711

---

Thank you for your dedication to maintaining the InstaPulse platform!
