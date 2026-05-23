import Navigation from '@/components/Navigation'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-12 pt-28">
        <h1 className="text-4xl font-bold text-navy-900 mb-2">Terms and Conditions</h1>
        <p className="text-lg text-gray-500 mb-2">Emergency Alert &amp; Notification Services Platform</p>
        <p className="text-gray-600 mb-10">
          This Terms and Conditions Agreement ("Agreement") is entered into by and between the Client/Subscriber and InstaPulse (Service Provider).
        </p>

        <div className="prose prose-lg max-w-none text-gray-700">

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">1. Acceptance of Terms</h2>
            <p>
              By subscribing to, accessing, installing, or using any InstaPulse services, the Client agrees to be bound by this Agreement, including all policies, service descriptions, and applicable laws. Electronic acceptance (including checkbox "I Agree") shall have the same legal effect as a physical signature.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">2. Description of Service</h2>
            <p className="mb-4">
              InstaPulse is a real-time emergency alert and notification platform designed to improve safety, communication, and incident response coordination. Services may include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Emergency alert systems (button-based or app-based)</li>
              <li>Real-time location (GPS) tracking</li>
              <li>Monitoring dashboard access</li>
              <li>CCTV integration (where applicable)</li>
              <li>Communication and coordination tools</li>
              <li>Integration with authorized emergency response units and partner agencies</li>
            </ul>
            <p className="mt-4">The service is strictly designed for emergency and safety-related use.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">3. Packages and Service Offerings</h2>
            <p>
              The Client may subscribe to available service packages as published on the official website. Each package may vary in included devices, features, installation scope, monitoring level, and subscription fees. The selected package shall form part of this Agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">4. Installation and Implementation</h2>
            <p className="mb-4">The Service Provider shall be responsible for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>System setup and configuration</li>
              <li>Device installation (if included)</li>
              <li>Service activation</li>
              <li>Integration with monitoring systems</li>
            </ul>
            <p className="mt-4">Installation schedules are subject to coordination with the Client and site readiness.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">5. Subscription Term</h2>
            <p>
              The Client shall make a one-time payment for the selected device or chosen package. Upon full payment, InstaPulse will proceed with system installation and activation of the subscribed services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">6. Payment Terms</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All fees shall be based on the selected InstaPulse package</li>
              <li>Payment must be made prior to activation unless otherwise agreed in writing</li>
              <li>Fees are non-refundable once installation or activation has started</li>
              <li>Late payments may result in service interruption or suspension</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">7. Maintenance and Support</h2>
            <p className="mb-4">
              InstaPulse provides ongoing system monitoring, technical assistance, software updates, and preventive maintenance to ensure the reliability and proper functioning of all installed devices. This includes system performance checks, troubleshooting, and monthly on-site inspection of installed equipment.
            </p>
            <p className="mb-4">
              A mandatory monthly maintenance fee of <strong>₱500.00 (Five Hundred Pesos)</strong> per system shall be charged. This fee covers system monitoring, technical support, software maintenance, and monthly on-site inspection of installed equipment.
            </p>
            <p>
              Failure to settle the required maintenance fee may result in temporary suspension of system monitoring services, restricted access, or interruption of service until all outstanding balances are fully paid.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">8. Client Responsibilities</h2>
            <p className="mb-4">The Client agrees to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the service only for legitimate emergency and safety purposes</li>
              <li>Provide accurate information during registration</li>
              <li>Safeguard devices, credentials, and access systems</li>
              <li>Allow reasonable access for installation and maintenance</li>
              <li>Report any technical issues or unauthorized use immediately</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">9. Acceptable Use Policy</h2>
            <p className="mb-4">The Client shall NOT:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Trigger false or malicious alerts</li>
              <li>Use the system for harassment, fraud, or illegal activities</li>
              <li>Tamper with devices or software</li>
              <li>Attempt unauthorized access or hacking</li>
              <li>Misuse emergency alert functions for non-emergency purposes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">10. False Alert and Misuse Policy</h2>
            <p>
              Repeated false alerts may result in warnings, suspension, or termination of service. InstaPulse reserves the right to determine whether an alert is false or abusive based on system logs and verification tools. Severe or intentional misuse may result in reporting to appropriate authorities and legal action under applicable laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">11. Service Performance</h2>
            <p>
              InstaPulse shall exert reasonable efforts to maintain continuous system availability, timely alert processing, and reliable uptime. However, performance may be affected by internet connectivity, device limitations, network congestion, power interruptions, or force majeure events.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">12. Use with Partner Authorities</h2>
            <p>
              The Client acknowledges that InstaPulse may coordinate alerts with law enforcement agencies, emergency response units, local government units, and authorized public safety organizations. Such coordination is for support purposes only and does not guarantee immediate response.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">13. Device Ownership and Responsibility</h2>
            <p>
              Ownership terms shall be specified in the service agreement or invoice. The Client is responsible for proper care, preventing damage or misuse, and reporting loss or malfunction. Repair or replacement costs due to negligence shall be charged to the Client.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">14. Data Privacy and Security</h2>
            <p className="mb-4">
              InstaPulse complies with Republic Act No. 10173 and related regulations. The Client agrees that InstaPulse may collect and process:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personal information</li>
              <li>Location data (GPS)</li>
              <li>Device information and system logs</li>
              <li>Emergency alert data and communication records</li>
            </ul>
            <p className="mt-4">This data is used for emergency response support, system operation, security, and legal compliance.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">15. Limitation of Liability</h2>
            <p className="mb-4">
              InstaPulse is a support-based emergency technology platform and does <strong>NOT</strong> guarantee immediate physical response, prevention of harm, continuous uninterrupted service, or accuracy of third-party actions.
            </p>
            <p>
              InstaPulse shall not be liable for delays, system downtime, network disruptions, or force majeure events. Maximum liability shall be limited to the amount paid by the Client for the current subscription period.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">16. Suspension and Termination</h2>
            <p className="mb-4">InstaPulse may suspend or terminate service for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Non-payment</li>
              <li>Violation of this Agreement</li>
              <li>System misuse</li>
              <li>Detected security risks</li>
            </ul>
            <p className="mt-4">
              The Client may terminate by providing written notice, settling outstanding balances, and returning installed equipment if applicable.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">17. Intellectual Property</h2>
            <p>
              All systems, software, designs, branding, applications, and technology remain the exclusive property of InstaPulse. No part of the system may be copied, modified, distributed, or reverse-engineered without written consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">18. Amendments</h2>
            <p>
              InstaPulse reserves the right to update or modify this Agreement at any time. Changes shall take effect upon posting on the official website or notification to users. Continued use of the service constitutes acceptance of updated terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">19. Governing Law</h2>
            <p>
              This Agreement shall be governed by the laws of the Republic of the Philippines.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">20. Dispute Resolution</h2>
            <p>
              Disputes shall be resolved through negotiation, mediation, or court proceedings if necessary. Venue shall be within the appropriate courts of jurisdiction in the Philippines.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">21. Effectivity</h2>
            <p>
              This Agreement becomes effective upon subscription, installation, activation, or use of the service, whichever comes first.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">22. Acceptance</h2>
            <p>
              By subscribing to InstaPulse services, the Client confirms that they have read, understood, and agreed to all terms and conditions stated herein.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">Contact Us</h2>
            <p>
              For questions about these Terms and Conditions, please contact us through our{' '}
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
