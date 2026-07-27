import Link from 'next/link'

interface TermsContentProps {
  compact?: boolean
}

export default function TermsContent({ compact = false }: TermsContentProps) {
  const headingClass = compact
    ? 'font-bold text-gray-900 mb-1'
    : 'text-2xl font-bold text-navy-900 mb-4'
  const sectionClass = compact ? '' : 'mb-8'
  const bodyText = compact ? '' : 'text-gray-700'
  const listClass = compact
    ? 'list-disc pl-5 space-y-1'
    : 'list-disc pl-6 space-y-2'

  return (
    <div className={compact ? 'space-y-5 text-sm text-gray-700' : 'space-y-8 text-gray-700'}>
      <p className={compact ? 'italic text-gray-500' : 'text-gray-600'}>
        This Terms and Conditions Agreement (&quot;Agreement&quot;) is entered into by and between the Client/Subscriber and InstaPulse (Service Provider). Electronic acceptance (including checkbox &quot;I Agree&quot;) shall have the same legal effect as a physical signature.
      </p>

      <section className={sectionClass}>
        <h2 className={headingClass}>1. Acceptance of Terms</h2>
        <p className={bodyText}>
          By subscribing to, accessing, installing, or using any InstaPulse services, the Client agrees to be bound by this Agreement, including all policies, service descriptions, and applicable laws. Electronic acceptance (including checkbox &quot;I Agree&quot;) shall have the same legal effect as a physical signature.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>2. Description of Service</h2>
        <p className={`${bodyText} mb-4`}>
          InstaPulse is a real-time emergency alert and notification platform designed to improve safety, communication, and incident response coordination. Services may include:
        </p>
        <ul className={listClass}>
          <li>Emergency alert systems (button-based or app-based)</li>
          <li>Real-time location (GPS) tracking</li>
          <li>Monitoring dashboard access</li>
          <li>CCTV integration (where applicable)</li>
          <li>Communication and coordination tools</li>
          <li>Integration with authorized emergency response units and partner agencies</li>
        </ul>
        <p className={`${bodyText} mt-4`}>The service is strictly designed for emergency and safety-related use.</p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>3. Packages and Service Offerings</h2>
        <p className={bodyText}>
          The Client may subscribe to available service packages as published on the official website. Each package may vary in included devices, features, installation scope, monitoring level, and subscription fees. The selected package shall form part of this Agreement.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>4. Installation and Implementation</h2>
        <p className={`${bodyText} mb-4`}>The Service Provider shall be responsible for:</p>
        <ul className={listClass}>
          <li>System setup and configuration</li>
          <li>Device installation (if included)</li>
          <li>Service activation</li>
          <li>Integration with monitoring systems</li>
        </ul>
        <p className={`${bodyText} mt-4`}>Installation schedules are subject to coordination with the Client and site readiness.</p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>5. Subscription Term</h2>
        <p className={bodyText}>
          The Client shall make a one-time payment for the selected device or chosen package. Upon full payment, InstaPulse will proceed with system installation and activation of the subscribed services.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>6. Payment Terms</h2>
        <ul className={listClass}>
          <li>All fees shall be based on the selected InstaPulse package</li>
          <li>Payment must be made prior to activation unless otherwise agreed in writing</li>
          <li>Fees are non-refundable once installation or activation has started</li>
          <li>Late payments may result in service interruption or suspension</li>
        </ul>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>7. Maintenance and Support</h2>
        <p className={`${bodyText} mb-4`}>
          InstaPulse provides ongoing system monitoring, technical assistance, software updates, and preventive maintenance to ensure the reliability and proper functioning of all installed devices. This includes system performance checks, troubleshooting, and monthly on-site inspection of installed equipment.
        </p>
        <p className={`${bodyText} mb-4`}>
          A mandatory monthly maintenance fee of <strong>₱500.00 (Five Hundred Pesos)</strong> per system shall be charged. This fee covers system monitoring, technical support, software maintenance, and monthly on-site inspection of installed equipment.
        </p>
        <p className={bodyText}>
          Failure to settle the required maintenance fee may result in temporary suspension of system monitoring services, restricted access, or interruption of service until all outstanding balances are fully paid.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>8. Client Responsibilities</h2>
        <p className={`${bodyText} mb-4`}>The Client agrees to:</p>
        <ul className={listClass}>
          <li>Use the service only for legitimate emergency and safety purposes</li>
          <li>Provide accurate information during registration</li>
          <li>Safeguard devices, credentials, and access systems</li>
          <li>Allow reasonable access for installation and maintenance</li>
          <li>Report any technical issues or unauthorized use immediately</li>
        </ul>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>9. Acceptable Use Policy</h2>
        <p className={`${bodyText} mb-4`}>The Client shall NOT:</p>
        <ul className={listClass}>
          <li>Trigger false or malicious alerts</li>
          <li>Use the system for harassment, fraud, or illegal activities</li>
          <li>Tamper with devices or software</li>
          <li>Attempt unauthorized access or hacking</li>
          <li>Misuse emergency alert functions for non-emergency purposes</li>
        </ul>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>10. False Alert and Misuse Policy</h2>
        <p className={bodyText}>
          Repeated false alerts may result in warnings, suspension, or termination of service. InstaPulse reserves the right to determine whether an alert is false or abusive based on system logs and verification tools. Severe or intentional misuse may result in reporting to appropriate authorities and legal action under applicable laws.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>11. Service Performance</h2>
        <p className={bodyText}>
          InstaPulse shall exert reasonable efforts to maintain continuous system availability, timely alert processing, and reliable uptime. However, performance may be affected by internet connectivity, device limitations, network congestion, power interruptions, or force majeure events.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>12. Use with Partner Authorities</h2>
        <p className={bodyText}>
          The Client acknowledges that InstaPulse may coordinate alerts with law enforcement agencies, emergency response units, local government units, and authorized public safety organizations. Such coordination is for support purposes only and does not guarantee immediate response.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>13. Device Ownership and Responsibility</h2>
        <p className={bodyText}>
          Ownership terms shall be specified in the service agreement or invoice. The Client is responsible for proper care, preventing damage or misuse, and reporting loss or malfunction. Repair or replacement costs due to negligence shall be charged to the Client.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>14. Data Privacy and Security</h2>
        <p className={`${bodyText} mb-4`}>
          InstaPulse complies with Republic Act No. 10173 and related regulations. The Client agrees that InstaPulse may collect and process:
        </p>
        <ul className={listClass}>
          <li>Personal information</li>
          <li>Location data (GPS)</li>
          <li>Device information and system logs</li>
          <li>Emergency alert data and communication records</li>
        </ul>
        <p className={`${bodyText} mt-4`}>This data is used for emergency response support, system operation, security, and legal compliance.</p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>15. Limitation of Liability</h2>
        <p className={`${bodyText} mb-4`}>
          InstaPulse is a support-based emergency technology platform and does <strong>NOT</strong> guarantee immediate physical response, prevention of harm, continuous uninterrupted service, or accuracy of third-party actions.
        </p>
        <p className={bodyText}>
          InstaPulse shall not be liable for delays, system downtime, network disruptions, or force majeure events. Maximum liability shall be limited to the amount paid by the Client for the current subscription period.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>16. Suspension and Termination</h2>
        <p className={`${bodyText} mb-4`}>InstaPulse may suspend or terminate service for:</p>
        <ul className={listClass}>
          <li>Non-payment</li>
          <li>Violation of this Agreement</li>
          <li>System misuse</li>
          <li>Detected security risks</li>
        </ul>
        <p className={`${bodyText} mt-4`}>
          The Client may terminate by providing written notice, settling outstanding balances, and returning installed equipment if applicable.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>17. Intellectual Property</h2>
        <p className={bodyText}>
          All systems, software, designs, branding, applications, and technology remain the exclusive property of InstaPulse. No part of the system may be copied, modified, distributed, or reverse-engineered without written consent.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>18. Amendments</h2>
        <p className={bodyText}>
          InstaPulse reserves the right to update or modify this Agreement at any time. Changes shall take effect upon posting on the official website or notification to users. Continued use of the service constitutes acceptance of updated terms.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>19. Governing Law</h2>
        <p className={bodyText}>
          This Agreement shall be governed by the laws of the Republic of the Philippines.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>20. Dispute Resolution</h2>
        <p className={bodyText}>
          Disputes shall be resolved through negotiation, mediation, or court proceedings if necessary. Venue shall be within the appropriate courts of jurisdiction in the Philippines.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>21. Effectivity</h2>
        <p className={bodyText}>
          This Agreement becomes effective upon subscription, installation, activation, or use of the service, whichever comes first.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>22. Acceptance</h2>
        <p className={bodyText}>
          By subscribing to InstaPulse services, the Client confirms that they have read, understood, and agreed to all terms and conditions stated herein.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>Contact Us</h2>
        <p className={bodyText}>
          For questions about these Terms and Conditions, please contact us at{' '}
          <a href="mailto:support@instapulse.site" className="text-red-600 hover:text-red-700 underline">support@instapulse.site</a>
          {' '}or through our{' '}
          <Link href="/contact" className="text-red-600 hover:text-red-700 underline">contact page</Link>.
        </p>
        <p className={`${bodyText} mt-2`}>
          Website: <a href="https://instapulse.site" className="text-red-600 hover:text-red-700 underline">instapulse.site</a>
        </p>
        <p className={`${bodyText} mt-2`}>
          Address: 1st Crumb Street, Zone 3, 8002 City of Digos, Davao del Sur, Philippines
        </p>
      </section>
    </div>
  )
}
