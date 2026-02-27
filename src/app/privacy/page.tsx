import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | VibeyCoder",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-vc-bg text-vc-text-secondary font-mono flex flex-col">
      <div className="flex-1 max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-vc-text font-sans mb-6">Privacy Policy</h1>
        <p className="text-xs text-vc-text-ghost mb-8">Last updated: February 27, 2026</p>

        <div className="space-y-6 text-sm text-vc-text-muted leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-vc-text font-sans mb-2">Overview</h2>
            <p>
              VibeyCoder (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates vibeycoder.ai. This page informs you of our
              policies regarding the collection, use, and disclosure of personal data when you use
              our service.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-vc-text font-sans mb-2">Information We Collect</h2>
            <p>We collect minimal information necessary to provide the service:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong className="text-vc-text">Name:</strong> A display name you choose when starting the bootcamp.</li>
              <li><strong className="text-vc-text">Email address:</strong> Collected only if you choose to create an account to sync progress across devices.</li>
              <li><strong className="text-vc-text">Progress data:</strong> Which tasks and lessons you&apos;ve completed. This is stored locally in your browser and, if you create an account, in our database.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-vc-text font-sans mb-2">How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To personalize your learning experience (greeting you by name).</li>
              <li>To save and sync your progress across devices (if you create an account).</li>
              <li>To send important service updates (not marketing emails).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-vc-text font-sans mb-2">Data Storage</h2>
            <p>
              Your data is stored using Firebase (operated by Google). Data is encrypted in transit
              and at rest. We do not sell, trade, or share your personal information with third
              parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-vc-text font-sans mb-2">Users Under 18</h2>
            <p>
              VibeyCoder is designed for teens learning to code. If you are under 13 years old, please
              have a parent or guardian create an account on your behalf. We comply with applicable
              children&apos;s privacy regulations including COPPA. Parents or guardians may contact us at
              any time to review, delete, or stop the collection of their child&apos;s information.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-vc-text font-sans mb-2">Cookies & Local Storage</h2>
            <p>
              We use browser localStorage to save your progress and preferences locally. We do not
              use third-party tracking cookies or analytics tools. No advertising cookies are used.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-vc-text font-sans mb-2">Data Deletion</h2>
            <p>
              You may request deletion of your account and all associated data at any time by
              contacting us. Upon request, we will delete your data from our systems within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-vc-text font-sans mb-2">Contact</h2>
            <p>
              For questions about this privacy policy or to request data deletion, please contact us
              at <span className="text-vc-cyan">privacy@vibeycoder.ai</span>.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
