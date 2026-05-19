import Navigation from '@/components/Navigation'
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-navy-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none text-gray-700">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, including when you create an account, 
              make a purchase, or contact us for support. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Name, email address, phone number, and physical address</li>
              <li>Payment information (processed securely through third-party payment providers)</li>
              <li>Installation location details</li>
              <li>Support ticket history and communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Process and fulfill your orders</li>
              <li>Schedule and coordinate installations</li>
              <li>Provide customer support and respond to your inquiries</li>
              <li>Send important notifications about your account and services</li>
              <li>Improve our services and develop new features</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">3. Information Sharing</h2>
            <p>
              We do not sell your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>With service providers who perform services on our behalf (e.g., payment processors, installation technicians)</li>
              <li>When required by law or to protect our rights, property, or safety</li>
              <li>With your consent for specific purposes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Secure transmission of data using encryption</li>
              <li>Restricted access to personal information to authorized personnel only</li>
              <li>Regular security assessments and updates</li>
              <li>Compliance with industry-standard security practices</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your personal information (subject to legal obligations)</li>
              <li>Opt out of marketing communications</li>
              <li>Withdraw consent where applicable</li>
            </ul>
            <p className="mt-2">
              To exercise these rights, contact us through our 
              <Link href="/contact" className="text-red-600 hover:text-red-700">contact page</Link> or submit a support ticket.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">6. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to improve your experience, analyze usage patterns, 
              and for security purposes. You can manage cookie preferences through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">7. Third-Party Services</h2>
            <p>
              Our services integrate with third-party providers including payment processors (e.g., GCash, bank systems). 
              These providers have their own privacy policies which we encourage you to review.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">8. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide our services and 
              comply with legal obligations. When you delete your account, we will delete or anonymize 
              your personal information unless retention is required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">9. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 18. We do not knowingly collect 
              personal information from children under 18.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">10. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of significant changes 
              by posting the new policy on our website and sending you an email notification.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">11. Contact Us</h2>
            <p>
              For questions about this Privacy Policy or our data practices, please contact us through our 
              <Link href="/contact" className="text-red-600 hover:text-red-700">contact page</Link> or 
              submit a support ticket from your dashboard.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">Last updated: May 2026</p>
        </div>
      </div>
    </div>
  )
}
