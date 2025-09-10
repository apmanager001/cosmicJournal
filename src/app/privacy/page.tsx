"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-white/70">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-xl p-8 max-w-4xl mx-auto">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-semibold text-white mb-4">
              1. Information We Collect
            </h2>
            <p className="text-white/90 mb-6">
              Cosmic Journal collects information you provide directly to us,
              such as when you create an account, use our services, or contact
              us for support. This includes:
            </p>
            <ul className="list-disc list-inside text-white/90 mb-6 space-y-2">
              <li>Account information (email address, name)</li>
              <li>Journal entries and habit tracking data</li>
              <li>Usage information and preferences</li>
              <li>Device information and IP address</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-white/90 mb-6">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-white/90 mb-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze trends and usage</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mb-4">
              3. Information Sharing
            </h2>
            <p className="text-white/90 mb-6">
              We do not sell, trade, or otherwise transfer your personal
              information to third parties without your consent, except as
              described in this policy. We may share your information in the
              following circumstances:
            </p>
            <ul className="list-disc list-inside text-white/90 mb-6 space-y-2">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
              <li>In connection with a business transfer</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mb-4">
              4. Data Security
            </h2>
            <p className="text-white/90 mb-6">
              We implement appropriate security measures to protect your
              personal information against unauthorized access, alteration,
              disclosure, or destruction. However, no method of transmission
              over the internet is 100% secure.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">
              5. Data Retention
            </h2>
            <p className="text-white/90 mb-6">
              We retain your personal information for as long as necessary to
              provide our services and fulfill the purposes outlined in this
              policy, unless a longer retention period is required by law.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">
              6. Your Rights
            </h2>
            <p className="text-white/90 mb-6">You have the right to:</p>
            <ul className="list-disc list-inside text-white/90 mb-6 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and data</li>
              <li>Opt out of certain communications</li>
              <li>Data portability</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mb-4">
              7. Third-Party Services
            </h2>
            <p className="text-white/90 mb-6">
              Our app may contain links to third-party websites or services. We
              are not responsible for the privacy practices of these third
              parties. We encourage you to read their privacy policies.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">
              8. Children&apos;s Privacy
            </h2>
            <p className="text-white/90 mb-6">
              Our services are not intended for children under 13 years of age.
              We do not knowingly collect personal information from children
              under 13.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">
              9. Changes to This Policy
            </h2>
            <p className="text-white/90 mb-6">
              We may update this privacy policy from time to time. We will
              notify you of any changes by posting the new policy on this page
              and updating the &quot;Last updated&quot; date.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">
              10. Contact Us
            </h2>
            <p className="text-white/90 mb-6">
              If you have any questions about this privacy policy, please
              contact us at:
            </p>
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white/90">
                Email: privacy@cosmicjournal.com
                <br />
                Address: [Your Company Address]
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
