import Navigation from '@/components/Navigation'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-navy-900 mb-8">Terms and Conditions</h1>
        
        <div className="prose prose-lg max-w-none text-gray-700">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using InstaPulse services, you agree to be bound by these Terms and Conditions. 
              If you do not agree with any part of these terms, you must not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">2. Services Provided</h2>
            <p>
              InstaPulse provides security packages including alert systems, CCTV cameras, and alert buttons 
              for residential and commercial use. All packages are subject to availability and installation 
              requirements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">3. Payment Terms</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All payments must be made in Philippine Pesos (₱)</li>
              <li>Payment methods include GCash, bank transfer, and other supported payment channels</li>
              <li>Orders are confirmed only upon successful payment</li>
              <li>Refunds are subject to our refund policy and approval by management</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">4. Installation and Service</h2>
            <p>
              Professional installation is included in all packages. Installation scheduling will be arranged 
              after order confirmation. Installation timelines may vary based on location and availability.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">5. User Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and complete information during registration</li>
              <li>Ensure the installation location is accessible and ready for service</li>
              <li>Report any issues with the system promptly through our support channel</li>
              <li>Use the security system responsibly and in accordance with applicable laws</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">6. Warranty and Support</h2>
            <p>
              All equipment comes with a manufacturer warranty as specified in your package details. 
              Technical support is available through our support ticket system. Response times may vary.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">7. Maintenance and Support</h2>
            <p className="mb-4">
              Depending on the selected package, InstaPulse may provide system monitoring support, technical assistance, software updates, and preventive maintenance. This includes ongoing system performance checks, troubleshooting, and scheduled inspections to ensure all installed devices remain functional and reliable.
            </p>
            <p className="mb-4">
              All subscribed services are subject to a mandatory monthly maintenance fee of <strong>₱500.00 (Five Hundred Pesos)</strong> per system. This fee covers continuous system monitoring, technical support, software maintenance, and periodic physical checking of installed devices and equipment.
            </p>
            <p>
              Failure to settle the required maintenance fee may result in temporary suspension of system monitoring services, limited access, or service interruption until outstanding balances are fully paid.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">8. Limitation of Liability</h2>
            <p>
              InstaPulse shall not be liable for any indirect, incidental, special, or consequential damages 
              arising from the use or inability to use our services. Our total liability shall not exceed the 
              amount paid for the specific service in question.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">9. Termination</h2>
            <p>
              We reserve the right to suspend or terminate services for violation of these terms, 
              fraudulent activity, or at our discretion with appropriate notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">10. Changes to Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of our services after changes 
              constitutes acceptance of the updated terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">11. Contact Us</h2>
            <p>
              For questions about these Terms and Conditions, please contact us through our 
              <Link href="/contact" className="text-red-600 hover:text-red-700">contact page</Link> or 
              submit a support ticket from your dashboard.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">12. Governing Law</h2>
            <p>
              These Terms and Conditions are governed by the laws of the Republic of the Philippines. 
              Any disputes shall be resolved in the appropriate courts of the Philippines.
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
