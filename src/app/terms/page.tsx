"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
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
          <h1 className="text-4xl font-bold text-white mb-2">
            Terms of Service
          </h1>
          <p className="text-white/70">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-xl p-8 max-w-4xl mx-auto">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-semibold text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-white/90 mb-6">
              By accessing and using Cosmic Journal, you accept and agree to be
              bound by the terms and provision of this agreement. If you do not
              agree to abide by the above, please do not use this service.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">
              2. Description of Service
            </h2>
            <p className="text-white/90 mb-6">
              Cosmic Journal is a habit tracking and journaling application that
              allows users to:
            </p>
            <ul className="list-disc list-inside text-white/90 mb-6 space-y-2">
              <li>Track daily habits and build consistency</li>
              <li>Write and manage journal entries</li>
              <li>Set personal goals and monitor progress</li>
              <li>Access premium features through subscription</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mb-4">
              3. User Accounts
            </h2>
            <p className="text-white/90 mb-6">
              To use certain features of our service, you must register for an
              account. You agree to:
            </p>
            <ul className="list-disc list-inside text-white/90 mb-6 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your password</li>
              <li>
                Accept responsibility for all activities under your account
              </li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mb-4">
              4. Acceptable Use
            </h2>
            <p className="text-white/90 mb-6">
              You agree not to use the service to:
            </p>
            <ul className="list-disc list-inside text-white/90 mb-6 space-y-2">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit harmful or malicious code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of the service</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mb-4">
              5. Content and Data
            </h2>
            <p className="text-white/90 mb-6">
              You retain ownership of all content you create and store in Cosmic
              Journal. By using our service, you grant us a limited license to
              store, process, and display your content as necessary to provide
              the service.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">
              6. Subscription and Payment
            </h2>
            <p className="text-white/90 mb-6">
              Some features require a paid subscription. By subscribing, you
              agree to:
            </p>
            <ul className="list-disc list-inside text-white/90 mb-6 space-y-2">
              <li>Pay all applicable fees and taxes</li>
              <li>Automatic renewal unless cancelled</li>
              <li>No refunds for partial periods</li>
              <li>Price changes with 30 days notice</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mb-4">
              7. Privacy
            </h2>
            <p className="text-white/90 mb-6">
              Your privacy is important to us. Please review our Privacy Policy,
              which also governs your use of the service, to understand our
              practices.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">
              8. Intellectual Property
            </h2>
            <p className="text-white/90 mb-6">
              The service and its original content, features, and functionality
              are owned by Cosmic Journal and are protected by international
              copyright, trademark, patent, trade secret, and other intellectual
              property laws.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">
              9. Termination
            </h2>
            <p className="text-white/90 mb-6">
              We may terminate or suspend your account immediately, without
              prior notice, for conduct that we believe violates these terms or
              is harmful to other users, us, or third parties.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">
              10. Disclaimers
            </h2>
            <p className="text-white/90 mb-6">
              The service is provided &quot;as is&quot; without warranties of
              any kind. We disclaim all warranties, express or implied,
              including but not limited to merchantability, fitness for a
              particular purpose, and non-infringement.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">
              11. Limitation of Liability
            </h2>
            <p className="text-white/90 mb-6">
              In no event shall Cosmic Journal be liable for any indirect,
              incidental, special, consequential, or punitive damages, including
              without limitation, loss of profits, data, use, goodwill, or other
              intangible losses.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">
              12. Governing Law
            </h2>
            <p className="text-white/90 mb-6">
              These terms shall be governed by and construed in accordance with
              the laws of [Your Jurisdiction], without regard to its conflict of
              law provisions.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">
              13. Changes to Terms
            </h2>
            <p className="text-white/90 mb-6">
              We reserve the right to modify these terms at any time. We will
              notify users of any material changes by posting the new terms on
              this page and updating the &quot;Last updated&quot; date.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">
              14. Contact Information
            </h2>
            <p className="text-white/90 mb-6">
              If you have any questions about these terms, please contact us at:
            </p>
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white/90">
                Email: legal@cosmicjournal.com
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
