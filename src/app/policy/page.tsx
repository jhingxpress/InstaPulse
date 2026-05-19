import Navigation from '@/components/Navigation'

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">InstaPulse Policy</h1>
          <p className="text-gray-500">Emergency Alert and Notification Services Policy</p>
        </div>

        <div className="space-y-8 text-gray-700">
          <p className="font-semibold text-gray-800 border-l-4 border-red-600 pl-4">
            "InstaPulse Platform Policy on Emergency Alert and Notification Services"
          </p>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">I. Title</h2>
            <p>This Policy shall be known as the "InstaPulse Platform Policy on Emergency Alert and Notification Services."</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">II. Purpose</h2>
            <p className="mb-2">This Policy is established to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Define the operational policies governing the use of the InstaPulse platform and related services</li>
              <li>Promote responsible and lawful use of emergency alert and notification technologies</li>
              <li>Establish procedures for emergency reporting, monitoring, and coordination</li>
              <li>Protect the privacy, security, and integrity of user information and system data</li>
              <li>Prevent misuse, abuse, unauthorized access, and false reporting through the platform</li>
              <li>Define the responsibilities of users, partners, administrators, and service providers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">III. Legal Basis</h2>
            <p>This Policy is guided by and shall operate in accordance with applicable laws, rules, and regulations of the Republic of the Philippines, including but not limited to Republic Act No. 10173, Republic Act No. 10175, applicable laws relating to public safety, cybersecurity, electronic communications, and information systems, and relevant rules and advisories issued by government agencies and law enforcement authorities.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">IV. Scope and Coverage</h2>
            <p className="mb-2">This Policy shall apply to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>All users, subscribers, and participants utilizing the InstaPulse platform</li>
              <li>Partner organizations, establishments, and affiliated entities</li>
              <li>Authorized administrators, operators, and technical personnel</li>
              <li>Devices, software, infrastructure, systems, applications, and services operated under InstaPulse</li>
              <li>Emergency alert and notification services provided through the platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">V. Definition of Terms</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>InstaPulse</strong> – A technology platform providing real-time alert, notification, monitoring, communication, and emergency coordination services.</li>
              <li><strong>Platform</strong> – The software systems, web applications, mobile applications, devices, infrastructure, databases, and related technologies operated by InstaPulse.</li>
              <li><strong>User</strong> – Any individual, establishment, organization, or entity registered or authorized to access and use the platform.</li>
              <li><strong>Alert</strong> – An electronic notification, distress signal, or emergency report transmitted through the platform.</li>
              <li><strong>Emergency Incident</strong> – Any situation involving potential threats to life, property, public safety, security, or urgent assistance.</li>
              <li><strong>False Alert</strong> – Any alert transmitted intentionally, negligently, maliciously, accidentally, or without a legitimate emergency basis.</li>
              <li><strong>Administrator</strong> – Authorized personnel responsible for monitoring, managing, maintaining, or supporting the platform.</li>
              <li><strong>Partner Agency</strong> – Any government office, law enforcement unit, emergency response agency, local government unit, or authorized organization coordinating with InstaPulse.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">VI. Policy Statement</h2>
            <p>InstaPulse shall operate as a technology-based emergency alert and notification platform designed to enhance communication, incident reporting, monitoring, coordination, and public safety support. The platform may facilitate coordination with partner agencies, emergency responders, law enforcement units, local government units, private organizations, and authorized stakeholders for legitimate emergency and public safety purposes. All users are required to utilize the platform responsibly, lawfully, and in accordance with this Policy and applicable laws.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">VII. General Guidelines</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>InstaPulse services may operate twenty-four (24) hours a day, subject to system maintenance, operational limitations, and technical conditions</li>
              <li>Alerts transmitted through the platform may be subject to verification, monitoring, validation, or coordination procedures</li>
              <li>Users shall provide accurate and updated registration information when required</li>
              <li>Users shall not use the platform for false reporting, fraudulent activities, harassment, illegal activities, unauthorized access attempts, or malicious system interference</li>
              <li>InstaPulse reserves the right to suspend or terminate accounts, restrict access, investigate suspicious activities, and cooperate with lawful investigations and government authorities</li>
              <li>Participation in the platform constitutes acceptance of this Policy and related terms, conditions, and privacy provisions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">VIII. Operational Procedures</h2>
            <h3 className="font-semibold text-gray-800 mb-1 mt-3">A. Alert Transmission</h3>
            <p>Users may transmit alerts through authorized devices, applications, or integrated systems. The platform may collect user identification, device information, GPS or location data, alert timestamps, and incident-related information.</p>
            <h3 className="font-semibold text-gray-800 mb-1 mt-3">B. Alert Monitoring and Coordination</h3>
            <p>Authorized administrators or monitoring personnel may review and assess incoming alerts. Where applicable, alerts may be coordinated with emergency responders, law enforcement agencies, partner organizations, and local authorities. Verification procedures may include system validation, CCTV monitoring, GPS verification, and direct communication with users.</p>
            <h3 className="font-semibold text-gray-800 mb-1 mt-3">C. Incident Handling</h3>
            <p>Verified incidents may be endorsed or coordinated with appropriate response entities. False, malicious, or abusive alerts may result in account suspension, restriction, or legal action.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">IX. User Responsibilities</h2>
            <p className="mb-2">Users of InstaPulse shall:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Use the platform responsibly and lawfully</li>
              <li>Report only legitimate incidents or emergencies</li>
              <li>Protect account credentials and registered devices</li>
              <li>Maintain accurate registration information</li>
              <li>Immediately report unauthorized access or suspicious activities</li>
              <li>Cooperate with legitimate verification or investigation procedures</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">X. Data Privacy and Security</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>InstaPulse is committed to protecting user data and maintaining confidentiality, integrity, and security of information processed through the platform</li>
              <li>Data collection and processing shall comply with Republic Act No. 10173 and other applicable laws</li>
              <li>Users consent to the collection, storage, processing, and use of data necessary for platform operations, emergency coordination, incident monitoring, system security, and legal compliance</li>
              <li>InstaPulse may collect personal information, device information, location data, usage logs, and communication records related to platform operations</li>
              <li>Access to data shall be restricted to authorized personnel and legitimate operational purposes only</li>
              <li>InstaPulse shall implement reasonable organizational, technical, and physical safeguards against unauthorized access, data breaches, loss or destruction of data, cybersecurity threats, and unauthorized disclosure</li>
              <li>Data may be disclosed only with user consent, when required by law, pursuant to lawful orders, or for legitimate emergency response or public safety operations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">XI. Limitation of Liability</h2>
            <p>InstaPulse is intended solely as a support platform for communication, alert transmission, monitoring, and coordination purposes. While reasonable efforts shall be exerted to maintain reliable operations, InstaPulse does not guarantee immediate response, continuous connectivity, uninterrupted service, prevention of harm or loss, or accuracy of third-party response actions.</p>
            <p className="mt-2">Services may be affected by internet connectivity, power interruptions, GPS limitations, device failures, network congestion, force majeure events, cybersecurity incidents, or circumstances beyond reasonable control. InstaPulse, its owners, administrators, employees, affiliates, partners, and service providers shall not be liable for delays, service interruptions, technical failures, user misuse, inaccurate information submitted by users, or actions or omissions of third parties or responding entities.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">XII. Prohibited Acts</h2>
            <p className="mb-2">The following acts are strictly prohibited:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Intentional triggering of false alerts</li>
              <li>Fraudulent or malicious use of the platform</li>
              <li>Unauthorized access or attempted access</li>
              <li>Hacking, reverse engineering, or interference with systems</li>
              <li>Distribution of malware or harmful software</li>
              <li>Use of the platform for unlawful purposes</li>
              <li>Unauthorized disclosure or misuse of confidential information</li>
              <li>Tampering with devices, systems, or infrastructure</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">XIII. Enforcement and Penalties</h2>
            <p className="mb-2">Violations of this Policy may result in:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Warning or suspension</li>
              <li>Permanent account termination</li>
              <li>Restriction of platform access</li>
              <li>Administrative action</li>
              <li>Civil or criminal proceedings under applicable laws</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">XIV. Intellectual Property</h2>
            <p>All software, branding, systems, applications, source codes, designs, databases, content, infrastructure, and technologies associated with InstaPulse remain the intellectual property of InstaPulse unless otherwise stated in a written agreement. No part of the platform may be copied, modified, reproduced, distributed, reverse engineered, or commercially exploited without prior written authorization.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">XV. Partnership and Coordination</h2>
            <p>InstaPulse may establish coordination, partnerships, integrations, or collaborative arrangements with government agencies, law enforcement units, local government units, emergency responders, private organizations, and community stakeholders. Such partnerships shall remain subject to applicable laws, agreements, operational protocols, and lawful authority.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">XVI. Policy Amendments</h2>
            <p>InstaPulse reserves the right to amend, revise, modify, or update this Policy at any time to ensure compliance with applicable laws, operational requirements, technological developments, and security standards. Updated versions shall become effective upon publication or official posting within the platform or website.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">XVII. Effectivity</h2>
            <p>This Policy shall take effect immediately upon publication and shall remain valid unless amended, modified, or repealed by InstaPulse management.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">XVIII. Contact Information</h2>
            <p>For inquiries, concerns, incident reports, or policy-related matters, users may contact InstaPulse Support and Administration through the official website or by submitting a support ticket from the user dashboard.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">XIX. Acknowledgment</h2>
            <p>By accessing, registering, or using the InstaPulse platform, the user acknowledges that they have read, understood, and agreed to comply with this Policy and all applicable terms, conditions, and laws.</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">Last updated: May 2026 · InstaPulse</p>
        </div>
      </div>
    </div>
  )
}
