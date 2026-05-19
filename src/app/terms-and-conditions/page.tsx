import Navigation from '@/components/Navigation'

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">InstaPulse Terms and Conditions</h1>
          <p className="text-gray-500">Emergency Alert &amp; Notification Services Platform</p>
        </div>

        <div className="space-y-8 text-gray-700">
          <p className="italic text-gray-500 border-l-4 border-red-600 pl-4">
            This Terms and Conditions Agreement ("Agreement") is entered into by and between the Client/Subscriber and InstaPulse (Service Provider). Electronic acceptance (including checkbox "I Agree") shall have the same legal effect as a physical signature.
          </p>

          {[
            {
              title: "1. Acceptance of Terms",
              content: "By subscribing to, accessing, installing, or using any InstaPulse services, the Client agrees to be bound by this Agreement, including all policies, service descriptions, and applicable laws."
            },
            {
              title: "2. Description of Service",
              content: "InstaPulse is a real-time emergency alert and notification platform designed to improve safety, communication, and incident response coordination. Services may include: emergency alert systems (button-based or app-based), real-time location (GPS) tracking, monitoring dashboard access, CCTV integration (where applicable), communication and coordination tools, and integration with authorized emergency response units and partner agencies, including law enforcement and local authorities where applicable. The service is strictly designed for emergency and safety-related use."
            },
            {
              title: "3. Packages and Service Offerings",
              content: "The Client may subscribe to available service packages as published on the official website. Each package may vary in included devices and hardware, features and system access, installation scope, monitoring and support level, and subscription fees and renewal terms. The selected package shall be specified in the Client's order form, invoice, or subscription confirmation and shall form part of this Agreement."
            },
            {
              title: "4. Installation and Implementation",
              content: "The Service Provider shall be responsible for system setup and configuration, device installation (if included in the package), activation of services, and integration with monitoring systems and supported infrastructure. Installation schedules are subject to coordination with the Client and site readiness."
            },
          ].map(s => (
            <section key={s.title}>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h2>
              <p>{s.content}</p>
            </section>
          ))}

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">5. Subscription Term and Renewal</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Subscription validity depends on the selected package (monthly or annual)</li>
              <li>Renewal is required to continue service access</li>
              <li>Failure to renew may result in service suspension, device deactivation, or limited system access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">6. Payment Terms</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>All fees shall be based on the selected InstaPulse package</li>
              <li>Payment must be made prior to activation unless otherwise agreed in writing</li>
              <li>Fees are non-refundable once installation or activation has started</li>
              <li>Late payments may result in service interruption or suspension</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">7. Maintenance and Support</h2>
            <p>Depending on the selected package, InstaPulse may provide system monitoring support, technical assistance, software updates, and preventive maintenance. Some packages may include maintenance fees, while others may charge separately as indicated in the official pricing page.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">8. Client Responsibilities</h2>
            <p className="mb-2">The Client agrees to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Use the service only for legitimate emergency and safety purposes</li>
              <li>Provide accurate information during registration</li>
              <li>Safeguard devices, credentials, and access systems</li>
              <li>Allow reasonable access for installation and maintenance</li>
              <li>Report any technical issues or unauthorized use immediately</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">9. Acceptable Use Policy</h2>
            <p className="mb-2">The Client shall NOT:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Trigger false or malicious alerts</li>
              <li>Use the system for harassment, fraud, or illegal activities</li>
              <li>Tamper with devices or software</li>
              <li>Attempt unauthorized access or hacking</li>
              <li>Misuse emergency alert functions for non-emergency purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">10. False Alert and Misuse Policy</h2>
            <p>Repeated false alerts may result in warnings, suspension, or termination of service. InstaPulse reserves the right to determine whether an alert is false or abusive based on system logs, verification tools, and incident reports. Severe or intentional misuse may result in reporting to appropriate authorities and legal action under applicable laws.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">11. Service Performance</h2>
            <p>InstaPulse shall exert reasonable efforts to maintain continuous system availability (24/7 where applicable), timely alert processing and monitoring, and reliable communication and system uptime. However, actual performance may be affected by internet connectivity, device limitations, network congestion, power interruptions, external system dependencies, or force majeure events.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">12. Use with Partner Authorities</h2>
            <p>The Client acknowledges that InstaPulse may coordinate alerts and system outputs with law enforcement agencies, emergency response units, local government units, and other authorized public safety organizations. Such coordination is for support and assistance purposes only and does not guarantee immediate response, as operational decisions remain with the responding agencies.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">13. Device Ownership and Responsibility</h2>
            <p>Depending on the package, devices may be owned by InstaPulse or the Client. Ownership terms shall be specified in the service agreement or invoice. The Client is responsible for proper care and safekeeping, preventing damage or misuse, and reporting loss or malfunction. Repair or replacement costs due to negligence shall be charged to the Client.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">14. Data Privacy and Security</h2>
            <p>InstaPulse complies with Republic Act No. 10173 and related regulations. The Client agrees that InstaPulse may collect and process personal information, location data (GPS), device information, system logs, emergency alert data, and communication records related to service use. Data shall be used only for emergency response support, system operation and monitoring, security and fraud prevention, and legal compliance. Data may be shared only when required by law, necessary for emergency response coordination, or authorized by the Client or lawful order.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">15. Limitation of Liability</h2>
            <p>InstaPulse is a support-based emergency technology platform. The Service Provider does NOT guarantee immediate physical response from any agency, prevention of harm, injury, loss, or damage, continuous uninterrupted service, or accuracy of third-party actions or decisions. InstaPulse shall not be liable for delays in response or processing, system downtime or technical failures, network or internet disruptions, misuse of the system by users, or force majeure events. Maximum liability, if any, shall be limited to the amount paid by the Client for the current subscription period.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">16. Suspension and Termination</h2>
            <p>InstaPulse may suspend or terminate service if there is non-payment, the Client violates this Agreement, there is system misuse or fraud, or security risks are detected. The Client may terminate service by providing written notice, settling outstanding balances, and returning installed equipment if applicable.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">17. Intellectual Property</h2>
            <p>All systems, software, designs, branding, applications, and technology remain the exclusive property of InstaPulse. No part of the system may be copied, modified, distributed, or reverse-engineered without written consent.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">18. Amendments</h2>
            <p>InstaPulse reserves the right to update or modify this Agreement and its policies at any time. Changes shall take effect upon posting on the official website or notification to users. Continued use of the service constitutes acceptance of updated terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">19. Governing Law</h2>
            <p>This Agreement shall be governed by the laws of the Republic of the Philippines.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">20. Dispute Resolution</h2>
            <p>Disputes shall be resolved through negotiation, mediation, or court proceedings if necessary. Venue shall be within the appropriate courts of jurisdiction in the Philippines.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">21. Effectivity</h2>
            <p>This Agreement becomes effective upon subscription, installation, activation, or use of the service, whichever comes first.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">22. Acceptance</h2>
            <p>By subscribing to InstaPulse services, the Client confirms that they have read, understood, and agreed to all terms and conditions stated herein.</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">Last updated: May 2026 · InstaPulse</p>
        </div>
      </div>
    </div>
  )
}
