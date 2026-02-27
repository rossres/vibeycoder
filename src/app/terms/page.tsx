import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | VibeyCoder",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-vc-bg text-vc-text-secondary font-mono flex flex-col">
      <div className="flex-1 max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-vc-text font-sans mb-6">Terms of Service</h1>
        <p className="text-xs text-vc-text-ghost mb-8">Last updated: February 27, 2026</p>

        <div className="space-y-6 text-sm text-vc-text-muted leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-vc-text font-sans mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing and using VibeyCoder (&quot;vibeycoder.ai&quot;), you accept and agree to be bound by
              these Terms of Service. If you are under 18, a parent or legal guardian must agree to
              these terms on your behalf.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-vc-text font-sans mb-2">2. Description of Service</h2>
            <p>
              VibeyCoder provides a free, self-paced AI coding bootcamp curriculum designed for teens
              and beginners. The service includes structured lessons, task tracking, and progress
              persistence.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-vc-text font-sans mb-2">3. User Accounts</h2>
            <p>
              Account creation is optional. You may use the service with just a name. If you choose
              to create an account, you are responsible for maintaining the security of your password
              and account. You must provide accurate information when creating an account.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-vc-text font-sans mb-2">4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Use the service for any unlawful purpose.</li>
              <li>Attempt to gain unauthorized access to any part of the service.</li>
              <li>Interfere with or disrupt the service or servers.</li>
              <li>Share your account credentials with others.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-vc-text font-sans mb-2">5. Intellectual Property</h2>
            <p>
              All content, curriculum materials, and code provided through VibeyCoder are the
              property of VibeyCoder and are protected by copyright. You may use the curriculum
              for personal learning purposes but may not redistribute, resell, or republish the
              content without permission.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-vc-text font-sans mb-2">6. Third-Party Services</h2>
            <p>
              The curriculum references third-party tools and services (such as AI platforms, code
              editors, and hosting services). VibeyCoder is not affiliated with these services and
              is not responsible for their terms, content, or availability.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-vc-text font-sans mb-2">7. Disclaimer of Warranties</h2>
            <p>
              The service is provided &quot;as is&quot; without warranty of any kind, express or implied.
              We do not guarantee that the service will be uninterrupted, error-free, or that any
              specific learning outcomes will be achieved.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-vc-text font-sans mb-2">8. Limitation of Liability</h2>
            <p>
              VibeyCoder shall not be liable for any indirect, incidental, special, consequential,
              or punitive damages resulting from your use of or inability to use the service.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-vc-text font-sans mb-2">9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will provide notice of
              significant changes by updating the &quot;Last updated&quot; date. Continued use of the service
              after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-vc-text font-sans mb-2">10. Termination</h2>
            <p>
              We may terminate or suspend your access to the service at any time, without prior
              notice, for conduct that we believe violates these terms or is harmful to other users
              or the service.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-vc-text font-sans mb-2">11. Contact</h2>
            <p>
              For questions about these terms, contact us at{" "}
              <span className="text-vc-cyan">hello@vibeycoder.ai</span>.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
