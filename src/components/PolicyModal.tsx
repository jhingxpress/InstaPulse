'use client'

import { X } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function PolicyModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col z-10">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-gray-900">InstaPulse Policy</h2>
            <p className="text-xs text-gray-500">Emergency Alert and Notification Services Policy</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-4 flex-shrink-0">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-6 py-4 text-sm text-gray-700 space-y-5">
          <p className="font-semibold text-gray-800">
            "InstaPulse Platform Policy on Emergency Alert and Notification Services"
          </p>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">I. Title</h3>
            <p>This Policy shall be known as the "InstaPulse Platform Policy on Emergency Alert and Notification Services."</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">II. Purpose</h3>
            <p>This Policy is established to:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Define the operational policies governing the use of the InstaPulse platform and related services</li>
              <li>Promote responsible and lawful use of emergency alert and notification technologies</li>
              <li>Establish procedures for emergency reporting, monitoring, and coordination</li>
              <li>Protect the privacy, security, and integrity of user information and system data</li>
              <li>Prevent misuse, abuse, unauthorized access, and false reporting through the platform</li>
              <li>Define the responsibilities of users, partners, administrators, and service providers</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">III. Legal Basis</h3>
            <p>This Policy is guided by and shall operate in accordance with applicable laws of the Republic of the Philippines, including but not limited to Republic Act No. 10173, Republic Act No. 10175, and applicable laws relating to public safety, cybersecurity, electronic communications, and information systems.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">IV. Scope and Coverage</h3>
            <p>This Policy shall apply to all users, subscribers, and participants utilizing the InstaPulse platform; partner organizations, establishments, and affiliated entities; authorized administrators, operators, and technical personnel; and all devices, software, infrastructure, systems, and services operated under InstaPulse.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">V. Definition of Terms</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>InstaPulse</strong> – A technology platform providing real-time alert, notification, monitoring, communication, and emergency coordination services.</li>
              <li><strong>Platform</strong> – The software systems, web and mobile applications, devices, infrastructure, and related technologies operated by InstaPulse.</li>
              <li><strong>User</strong> – Any individual, establishment, organization, or entity registered or authorized to access and use the platform.</li>
              <li><strong>Alert</strong> – An electronic notification, distress signal, or emergency report transmitted through the platform.</li>
              <li><strong>Emergency Incident</strong> – Any situation involving potential threats to life, property, public safety, security, or urgent assistance.</li>
              <li><strong>False Alert</strong> – Any alert transmitted intentionally, negligently, maliciously, or without a legitimate emergency basis.</li>
              <li><strong>Administrator</strong> – Authorized personnel responsible for monitoring, managing, or supporting the platform.</li>
              <li><strong>Partner Agency</strong> – Any government office, law enforcement unit, emergency response agency, or authorized organization coordinating with InstaPulse.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">VI. Policy Statement</h3>
            <p>InstaPulse shall operate as a technology-based emergency alert and notification platform designed to enhance communication, incident reporting, monitoring, coordination, and public safety support. All users are required to utilize the platform responsibly, lawfully, and in accordance with this Policy and applicable laws.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">VII. General Guidelines</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>InstaPulse services may operate twenty-four (24) hours a day, subject to system maintenance and technical conditions</li>
              <li>Alerts transmitted through the platform may be subject to verification, monitoring, or validation procedures</li>
              <li>Users shall provide accurate and updated registration information</li>
              <li>Users shall not use the platform for false reporting, fraudulent activities, harassment, illegal activities, unauthorized access attempts, or malicious system interference</li>
              <li>InstaPulse reserves the right to suspend or terminate accounts, restrict access, investigate suspicious activities, and cooperate with lawful investigations</li>
              <li>Participation in the platform constitutes acceptance of this Policy and related terms, conditions, and privacy provisions</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">VIII. Operational Procedures</h3>
            <p className="font-semibold mt-1">A. Alert Transmission</p>
            <p>Users may transmit alerts through authorized devices, applications, or integrated systems. The platform may collect user identification, device information, GPS or location data, alert timestamps, and incident-related information.</p>
            <p className="font-semibold mt-2">B. Alert Monitoring and Coordination</p>
            <p>Authorized administrators or monitoring personnel may review and assess incoming alerts. Where applicable, alerts may be coordinated with emergency responders, law enforcement agencies, partner organizations, and local authorities. Verification procedures may include system validation, CCTV monitoring, GPS verification, and direct communication with users.</p>
            <p className="font-semibold mt-2">C. Incident Handling</p>
            <p>Verified incidents may be endorsed or coordinated with appropriate response entities. False, malicious, or abusive alerts may result in account suspension, restriction, or legal action.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">IX. User Responsibilities</h3>
            <p>Users of InstaPulse shall: use the platform responsibly and lawfully; report only legitimate incidents or emergencies; protect account credentials and registered devices; maintain accurate registration information; immediately report unauthorized access or suspicious activities; and cooperate with legitimate verification or investigation procedures.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">X. Data Privacy and Security</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>InstaPulse is committed to protecting user data and maintaining confidentiality, integrity, and security</li>
              <li>Data collection and processing shall comply with Republic Act No. 10173 and applicable laws</li>
              <li>Users consent to the collection, storage, processing, and use of data necessary for platform operations, emergency coordination, incident monitoring, system security, and legal compliance</li>
              <li>Access to data shall be restricted to authorized personnel and legitimate operational purposes only</li>
              <li>InstaPulse shall implement reasonable safeguards against unauthorized access, data breaches, and cybersecurity threats</li>
              <li>Data may be disclosed only with user consent, when required by law, pursuant to lawful orders, or for legitimate emergency response operations</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">XI. Limitation of Liability</h3>
            <p>InstaPulse is intended solely as a support platform for communication, alert transmission, monitoring, and coordination purposes. While reasonable efforts shall be exerted to maintain reliable operations, InstaPulse does not guarantee immediate response, continuous connectivity, uninterrupted service, prevention of harm or loss, or accuracy of third-party response actions.</p>
            <p className="mt-1">Services may be affected by internet connectivity, power interruptions, GPS limitations, device failures, network congestion, force majeure events, cybersecurity incidents, or circumstances beyond reasonable control.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">XII. Prohibited Acts</h3>
            <p>The following are strictly prohibited: intentional triggering of false alerts; fraudulent or malicious use of the platform; unauthorized access or attempted access; hacking, reverse engineering, or interference with systems; distribution of malware or harmful software; use of the platform for unlawful purposes; unauthorized disclosure or misuse of confidential information; and tampering with devices, systems, or infrastructure.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">XIII. Enforcement and Penalties</h3>
            <p>Violations of this Policy may result in warning or suspension, permanent account termination, restriction of platform access, administrative action, or civil or criminal proceedings under applicable laws.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">XIV. Intellectual Property</h3>
            <p>All software, branding, systems, applications, source codes, designs, databases, content, infrastructure, and technologies associated with InstaPulse remain the intellectual property of InstaPulse. No part of the platform may be copied, modified, reproduced, distributed, reverse engineered, or commercially exploited without prior written authorization.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">XV. Partnership and Coordination</h3>
            <p>InstaPulse may establish coordination, partnerships, integrations, or collaborative arrangements with government agencies, law enforcement units, local government units, emergency responders, private organizations, and community stakeholders. Such partnerships shall remain subject to applicable laws, agreements, and operational protocols.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">XVI. Policy Amendments</h3>
            <p>InstaPulse reserves the right to amend, revise, modify, or update this Policy at any time. Updated versions shall become effective upon publication or official posting within the platform or website.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">XVII. Effectivity</h3>
            <p>This Policy shall take effect immediately upon publication and shall remain valid unless amended, modified, or repealed by InstaPulse management.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">XVIII. Contact Information</h3>
            <p>For inquiries, concerns, incident reports, or policy-related matters, users may contact InstaPulse Support and Administration through the official website or submit a support ticket from the dashboard.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-1">XIX. Acknowledgment</h3>
            <p>By accessing, registering, or using the InstaPulse platform, the user acknowledges that they have read, understood, and agreed to comply with this Policy and all applicable terms, conditions, and laws.</p>
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
