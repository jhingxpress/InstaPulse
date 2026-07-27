interface PolicyContentProps {
  compact?: boolean
}

export default function PolicyContent({ compact = false }: PolicyContentProps) {
  const headingClass = compact
    ? 'font-bold text-gray-900 mb-1'
    : 'text-2xl font-bold text-navy-900 mb-4'
  const subHeadingClass = compact
    ? 'font-semibold text-gray-800 mb-1 mt-2'
    : 'font-semibold text-gray-800 mb-1 mt-3'
  const sectionClass = compact ? '' : 'mb-8'
  const bodyText = compact ? '' : 'text-gray-700'
  const listClass = compact
    ? 'list-disc pl-5 space-y-1'
    : 'list-disc pl-6 space-y-2'

  return (
    <div className={compact ? 'space-y-5 text-sm text-gray-700' : 'space-y-8 text-gray-700'}>
      <p className={compact ? 'font-semibold text-gray-800' : 'font-semibold text-gray-800 border-l-4 border-red-600 pl-4'}>
        &quot;InstaPulse Platform Policy on Emergency Alert and Notification Services&quot;
      </p>

      <section className={sectionClass}>
        <h2 className={headingClass}>I. Title</h2>
        <p className={bodyText}>
          This Policy shall be known as the &quot;InstaPulse Platform Policy on Emergency Alert and Notification Services.&quot;
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>II. Purpose</h2>
        <p className={`${bodyText} mb-2`}>This Policy is established to:</p>
        <ul className={listClass}>
          <li>Define the operational policies governing the use of the InstaPulse platform and related services</li>
          <li>Promote responsible and lawful use of emergency alert and notification technologies</li>
          <li>Establish procedures for emergency reporting, monitoring, and coordination</li>
          <li>Protect the privacy, security, and integrity of user information and system data</li>
          <li>Prevent misuse, abuse, unauthorized access, and false reporting through the platform</li>
          <li>Define the responsibilities of users, partners, administrators, and service providers</li>
        </ul>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>III. Legal Basis</h2>
        <p className={bodyText}>
          This Policy is guided by and shall operate in accordance with applicable laws, rules, and regulations of the Republic of the Philippines, including but not limited to Republic Act No. 10173, Republic Act No. 10175, applicable laws relating to public safety, cybersecurity, electronic communications, and information systems, and relevant rules and advisories issued by government agencies and law enforcement authorities.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>IV. Scope and Coverage</h2>
        <p className={`${bodyText} mb-2`}>This Policy shall apply to:</p>
        <ul className={listClass}>
          <li>All users, subscribers, and participants utilizing the InstaPulse platform</li>
          <li>Partner organizations, establishments, and affiliated entities</li>
          <li>Authorized administrators, operators, and technical personnel</li>
          <li>Devices, software, infrastructure, systems, applications, and services operated under InstaPulse</li>
          <li>Emergency alert and notification services provided through the platform</li>
        </ul>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>V. Definition of Terms</h2>
        <ul className={listClass}>
          <li><strong>InstaPulse</strong> &ndash; A technology platform providing real-time alert, notification, monitoring, communication, and emergency coordination services.</li>
          <li><strong>Platform</strong> &ndash; The software systems, web applications, mobile applications, devices, infrastructure, databases, and related technologies operated by InstaPulse.</li>
          <li><strong>User</strong> &ndash; Any individual, establishment, organization, or entity registered or authorized to access and use the platform.</li>
          <li><strong>Alert</strong> &ndash; An electronic notification, distress signal, or emergency report transmitted through the platform.</li>
          <li><strong>Emergency Incident</strong> &ndash; Any situation involving potential threats to life, property, public safety, security, or urgent assistance.</li>
          <li><strong>False Alert</strong> &ndash; Any alert transmitted intentionally, negligently, maliciously, accidentally, or without a legitimate emergency basis.</li>
          <li><strong>Administrator</strong> &ndash; Authorized personnel responsible for monitoring, managing, maintaining, or supporting the platform.</li>
          <li><strong>Partner Agency</strong> &ndash; Any government office, law enforcement unit, emergency response agency, local government unit, or authorized organization coordinating with InstaPulse.</li>
        </ul>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>VI. Policy Statement</h2>
        <p className={bodyText}>
          InstaPulse shall operate as a technology-based emergency alert and notification platform designed to enhance communication, incident reporting, monitoring, coordination, and public safety support. The platform may facilitate coordination with partner agencies, emergency responders, law enforcement units, local government units, private organizations, and authorized stakeholders for legitimate emergency and public safety purposes. All users are required to utilize the platform responsibly, lawfully, and in accordance with this Policy and applicable laws.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>VII. General Guidelines</h2>
        <ul className={listClass}>
          <li>InstaPulse services may operate twenty-four (24) hours a day, subject to system maintenance, operational limitations, and technical conditions</li>
          <li>Alerts transmitted through the platform may be subject to verification, monitoring, validation, or coordination procedures</li>
          <li>Users shall provide accurate and updated registration information when required</li>
          <li>Users shall not use the platform for false reporting, fraudulent activities, harassment, illegal activities, unauthorized access attempts, or malicious system interference</li>
          <li>InstaPulse reserves the right to suspend or terminate accounts, restrict access, investigate suspicious activities, and cooperate with lawful investigations and government authorities</li>
          <li>Participation in the platform constitutes acceptance of this Policy and related terms, conditions, and privacy provisions</li>
        </ul>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>VIII. Operational Procedures</h2>
        <h3 className={subHeadingClass}>A. Alert Transmission</h3>
        <p className={bodyText}>
          Users may transmit alerts through authorized devices, applications, or integrated systems. The platform may collect user identification, device information, GPS or location data, alert timestamps, and incident-related information.
        </p>
        <h3 className={subHeadingClass}>B. Alert Monitoring and Coordination</h3>
        <p className={bodyText}>
          Authorized administrators or monitoring personnel may review and assess incoming alerts. Where applicable, alerts may be coordinated with emergency responders, law enforcement agencies, partner organizations, and local authorities. Verification procedures may include system validation, CCTV monitoring, GPS verification, and direct communication with users.
        </p>
        <h3 className={subHeadingClass}>C. Incident Handling</h3>
        <p className={bodyText}>
          Verified incidents may be endorsed or coordinated with appropriate response entities. False, malicious, or abusive alerts may result in account suspension, restriction, or legal action.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>IX. User Responsibilities</h2>
        <p className={`${bodyText} mb-2`}>Users of InstaPulse shall:</p>
        <ul className={listClass}>
          <li>Use the platform responsibly and lawfully</li>
          <li>Report only legitimate incidents or emergencies</li>
          <li>Protect account credentials and registered devices</li>
          <li>Maintain accurate registration information</li>
          <li>Immediately report unauthorized access or suspicious activities</li>
          <li>Cooperate with legitimate verification or investigation procedures</li>
        </ul>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>X. Data Privacy and Security</h2>
        <ul className={listClass}>
          <li>InstaPulse is committed to protecting user data and maintaining confidentiality, integrity, and security of information processed through the platform</li>
          <li>Data collection and processing shall comply with Republic Act No. 10173 and other applicable laws</li>
          <li>Users consent to the collection, storage, processing, and use of data necessary for platform operations, emergency coordination, incident monitoring, system security, and legal compliance</li>
          <li>InstaPulse may collect personal information, device information, location data, usage logs, and communication records related to platform operations</li>
          <li>Access to data shall be restricted to authorized personnel and legitimate operational purposes only</li>
          <li>InstaPulse shall implement reasonable organizational, technical, and physical safeguards against unauthorized access, data breaches, loss or destruction of data, cybersecurity threats, and unauthorized disclosure</li>
          <li>Data may be disclosed only with user consent, when required by law, pursuant to lawful orders, or for legitimate emergency response or public safety operations</li>
        </ul>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>XI. Limitation of Liability</h2>
        <p className={bodyText}>
          InstaPulse is intended solely as a support platform for communication, alert transmission, monitoring, and coordination purposes. While reasonable efforts shall be exerted to maintain reliable operations, InstaPulse does not guarantee immediate response, continuous connectivity, uninterrupted service, prevention of harm or loss, or accuracy of third-party response actions.
        </p>
        <p className={`${bodyText} mt-2`}>
          Services may be affected by internet connectivity, power interruptions, GPS limitations, device failures, network congestion, force majeure events, cybersecurity incidents, or circumstances beyond reasonable control. InstaPulse, its owners, administrators, employees, affiliates, partners, and service providers shall not be liable for delays, service interruptions, technical failures, user misuse, inaccurate information submitted by users, or actions or omissions of third parties or responding entities.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>XII. Prohibited Acts</h2>
        <p className={`${bodyText} mb-2`}>The following acts are strictly prohibited:</p>
        <ul className={listClass}>
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

      <section className={sectionClass}>
        <h2 className={headingClass}>XIII. Enforcement and Penalties</h2>
        <p className={`${bodyText} mb-2`}>Violations of this Policy may result in:</p>
        <ul className={listClass}>
          <li>Warning or suspension</li>
          <li>Permanent account termination</li>
          <li>Restriction of platform access</li>
          <li>Administrative action</li>
          <li>Civil or criminal proceedings under applicable laws</li>
        </ul>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>XIV. Intellectual Property</h2>
        <p className={bodyText}>
          All software, branding, systems, applications, source codes, designs, databases, content, infrastructure, and technologies associated with InstaPulse remain the intellectual property of InstaPulse unless otherwise stated in a written agreement. No part of the platform may be copied, modified, reproduced, distributed, reverse engineered, or commercially exploited without prior written authorization.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>XV. Partnership and Coordination</h2>
        <p className={bodyText}>
          InstaPulse may establish coordination, partnerships, integrations, or collaborative arrangements with government agencies, law enforcement units, local government units, emergency responders, private organizations, and community stakeholders. Such partnerships shall remain subject to applicable laws, agreements, operational protocols, and lawful authority.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>XVI. Policy Amendments</h2>
        <p className={bodyText}>
          InstaPulse reserves the right to amend, revise, modify, or update this Policy at any time to ensure compliance with applicable laws, operational requirements, technological developments, and security standards. Updated versions shall become effective upon publication or official posting within the platform or website.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>XVII. Effectivity</h2>
        <p className={bodyText}>
          This Policy shall take effect immediately upon publication and shall remain valid unless amended, modified, or repealed by InstaPulse management.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>XVIII. Contact Information</h2>
        <p className={bodyText}>
          For inquiries, concerns, incident reports, or policy-related matters, users may contact InstaPulse Support and Administration through the following:
        </p>
        <ul className={`${listClass} mt-2`}>
          <li>Email: <a href="mailto:support@instapulse.site" className="text-red-600 hover:text-red-700 underline">support@instapulse.site</a></li>
          <li>Website: <a href="https://instapulse.site" className="text-red-600 hover:text-red-700 underline">instapulse.site</a></li>
          <li>Address: 1st Crumb Street, Zone 3, 8002 City of Digos, Davao del Sur, Philippines</li>
        </ul>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>XIX. Acknowledgment</h2>
        <p className={bodyText}>
          By accessing, registering, or using the InstaPulse platform, the user acknowledges that they have read, understood, and agreed to comply with this Policy and all applicable terms, conditions, and laws.
        </p>
      </section>
    </div>
  )
}
