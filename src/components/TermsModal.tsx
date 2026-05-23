'use client'

import { X } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function TermsModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col z-10">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-gray-900">InstaPulse Terms and Conditions</h2>
            <p className="text-xs text-gray-500">Emergency Alert &amp; Notification Services Platform</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-4 flex-shrink-0">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-6 py-4 text-sm text-gray-700 space-y-5">
          <p className="italic text-gray-500">
            This Terms and Conditions Agreement ("Agreement") is entered into by and between the Client/Subscriber and InstaPulse (Service Provider).
          </p>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">1. Acceptance of Terms</h3>
            <p>By subscribing to, accessing, installing, or using any InstaPulse services, the Client agrees to be bound by this Agreement, including all policies, service descriptions, and applicable laws. Electronic acceptance (including checkbox "I Agree") shall have the same legal effect as a physical signature.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">2. Description of Service</h3>
            <p>InstaPulse is a real-time emergency alert and notification platform designed to improve safety, communication, and incident response coordination. Services may include:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Emergency alert systems (button-based or app-based)</li>
              <li>Real-time location (GPS) tracking</li>
              <li>Monitoring dashboard access</li>
              <li>CCTV integration (where applicable)</li>
              <li>Communication and coordination tools</li>
              <li>Integration with authorized emergency response units and partner agencies</li>
            </ul>
            <p className="mt-1">The service is strictly designed for emergency and safety-related use.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">3. Packages and Service Offerings</h3>
            <p>The Client may subscribe to available service packages as published on the official website. Each package may vary in included devices, features, installation scope, monitoring level, and subscription fees. The selected package shall form part of this Agreement.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">4. Installation and Implementation</h3>
            <p>The Service Provider shall be responsible for system setup and configuration, device installation (if included), service activation, and integration with monitoring systems. Installation schedules are subject to coordination with the Client and site readiness.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">5. Subscription Term and Renewal</h3>
            <p className="mb-1">The Client shall make a one-time payment for the selected device or chosen package. Upon full payment, InstaPulse will proceed with system installation and activation of the subscribed services.</p>
            <p>Once the devices are installed and the system is activated, the Client shall be subject to a mandatory monthly maintenance fee as stated in Section 7 (Maintenance and Support) to ensure continuous system monitoring, technical support, and physical inspection of installed equipment.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">6. Payment Terms</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>All fees shall be based on the selected InstaPulse package</li>
              <li>Payment must be made prior to activation unless otherwise agreed in writing</li>
              <li>Fees are non-refundable once installation or activation has started</li>
              <li>Late payments may result in service interruption or suspension</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">7. Maintenance and Support</h3>
            <p className="mb-1">Depending on the selected package, InstaPulse may provide system monitoring support, technical assistance, software updates, and preventive maintenance. This includes ongoing system performance checks, troubleshooting, and scheduled inspections to ensure all installed devices remain functional and reliable.</p>
            <p className="mb-1">All subscribed services are subject to a mandatory monthly maintenance fee of <strong>₱500.00 (Five Hundred Pesos)</strong> per system. This fee covers continuous system monitoring, technical support, software maintenance, and periodic physical checking of installed devices and equipment.</p>
            <p>Failure to settle the required maintenance fee may result in temporary suspension of system monitoring services, limited access, or service interruption until outstanding balances are fully paid.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">8. Client Responsibilities</h3>
            <p>The Client agrees to:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Use the service only for legitimate emergency and safety purposes</li>
              <li>Provide accurate information during registration</li>
              <li>Safeguard devices, credentials, and access systems</li>
              <li>Allow reasonable access for installation and maintenance</li>
              <li>Report any technical issues or unauthorized use immediately</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">9. Acceptable Use Policy</h3>
            <p>The Client shall NOT:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Trigger false or malicious alerts</li>
              <li>Use the system for harassment, fraud, or illegal activities</li>
              <li>Tamper with devices or software</li>
              <li>Attempt unauthorized access or hacking</li>
              <li>Misuse emergency alert functions for non-emergency purposes</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">10. False Alert and Misuse Policy</h3>
            <p>Repeated false alerts may result in warnings, suspension, or termination of service. InstaPulse reserves the right to determine whether an alert is false or abusive based on system logs and verification tools. Severe or intentional misuse may result in reporting to appropriate authorities and legal action under applicable laws.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">11. Service Performance</h3>
            <p>InstaPulse shall exert reasonable efforts to maintain continuous system availability, timely alert processing, and reliable uptime. However, performance may be affected by internet connectivity, device limitations, network congestion, power interruptions, or force majeure events.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">12. Use with Partner Authorities</h3>
            <p>The Client acknowledges that InstaPulse may coordinate alerts with law enforcement agencies, emergency response units, local government units, and authorized public safety organizations. Such coordination is for support purposes only and does not guarantee immediate response.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">13. Device Ownership and Responsibility</h3>
            <p>Ownership terms shall be specified in the service agreement or invoice. The Client is responsible for proper care, preventing damage or misuse, and reporting loss or malfunction. Repair or replacement costs due to negligence shall be charged to the Client.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">14. Data Privacy and Security</h3>
            <p>InstaPulse complies with Republic Act No. 10173 and related regulations. The Client agrees that InstaPulse may collect and process personal information, location data (GPS), device information, system logs, emergency alert data, and communication records for emergency response support, system operation, security, and legal compliance.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">15. Limitation of Liability</h3>
            <p>InstaPulse is a support-based emergency technology platform and does NOT guarantee immediate physical response, prevention of harm, continuous uninterrupted service, or accuracy of third-party actions. InstaPulse shall not be liable for delays, system downtime, network disruptions, or force majeure events. Maximum liability shall be limited to the amount paid by the Client for the current subscription period.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">16. Suspension and Termination</h3>
            <p>InstaPulse may suspend or terminate service for non-payment, violation of this Agreement, system misuse, or detected security risks. The Client may terminate by providing written notice, settling outstanding balances, and returning installed equipment if applicable.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">17. Intellectual Property</h3>
            <p>All systems, software, designs, branding, applications, and technology remain the exclusive property of InstaPulse. No part of the system may be copied, modified, distributed, or reverse-engineered without written consent.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">18. Amendments</h3>
            <p>InstaPulse reserves the right to update or modify this Agreement at any time. Changes shall take effect upon posting on the official website or notification to users. Continued use of the service constitutes acceptance of updated terms.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">19. Governing Law</h3>
            <p>This Agreement shall be governed by the laws of the Republic of the Philippines.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">20. Dispute Resolution</h3>
            <p>Disputes shall be resolved through negotiation, mediation, or court proceedings if necessary. Venue shall be within the appropriate courts of jurisdiction in the Philippines.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">21. Effectivity</h3>
            <p>This Agreement becomes effective upon subscription, installation, activation, or use of the service, whichever comes first.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">22. Acceptance</h3>
            <p>By subscribing to InstaPulse services, the Client confirms that they have read, understood, and agreed to all terms and conditions stated herein.</p>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex justify-between items-center bg-gray-50 rounded-b-2xl">
          <p className="text-xs text-gray-400">Last updated: May 2026</p>
          <button
            onClick={onClose}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 text-sm font-semibold"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  )
}
