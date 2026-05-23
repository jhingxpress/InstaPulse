import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How InstaPulse Works | Emergency Alert Response System',
  description:
    'Discover the 6-step emergency response process of InstaPulse — from triggering an alert to rapid unit deployment. Advanced emergency alert technology for faster police and responder dispatch.',
}

export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
