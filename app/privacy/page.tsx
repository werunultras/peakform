'use client';
import HeroBg from '@/components/HeroBg';

export default function PrivacyPolicy() {
  return (
    <HeroBg>
      <div className="p-8">
        <div className="max-w-3xl mx-auto">
          <div className="card space-y-4">
            <h1 className="text-2xl font-bold">Privacy Policy</h1>
            <p><strong>Effective Date:</strong> September 2025</p>
            <p>
              At PeakForm, your privacy is important to us. This Privacy Policy explains what information we collect, how we use it, and the choices you have when using PeakForm.
            </p>

            <h2 className="text-xl font-semibold">1. Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Account Information:</strong> Your email address, used only to create your account and authenticate you via a magic link.</li>
              <li><strong>Diary Entries:</strong> Data you log about your training, nutrition, mindset, and sleep.</li>
              <li><strong>Usage Data:</strong> Basic technical information (e.g., browser type, device type, approximate time of access) collected automatically for performance and security purposes.</li>
            </ul>

            <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
            <p>We use your information only to provide and improve the PeakForm service:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>To allow you to log, view, and manage your training diary.</li>
              <li>To sync your data across devices via our cloud database.</li>
              <li>To secure your account and maintain service availability.</li>
              <li>To improve the app and add new features.</li>
            </ul>
            <p>We do not sell or share your personal information with advertisers or third parties for marketing.</p>

            <h2 className="text-xl font-semibold">3. Data Storage and Security</h2>
            <p>All data is stored in our managed cloud database (Supabase). We use encryption in transit (HTTPS) and implement security best practices. While we work hard to protect your information, no system is completely secure.</p>

            <h2 className="text-xl font-semibold">4. Data Retention</h2>
            <p>We retain your diary entries and account information until you delete them or request deletion of your account.</p>

            <h2 className="text-xl font-semibold">5. Your Choices</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>You can access, edit, or delete your entries at any time from the diary.</li>
              <li>You can request complete deletion of your account and associated data by contacting us at <a className="underline" href="mailto:francesco@werunultras.com">francesco@werunultras.com</a>.</li>
            </ul>

            <h2 className="text-xl font-semibold">6. Children’s Privacy</h2>
            <p>PeakForm is not intended for use by children under 16. We do not knowingly collect personal data from children.</p>

            <h2 className="text-xl font-semibold">7. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. If we make significant changes, we will notify you by email or within the app.</p>

            <h2 className="text-xl font-semibold">8. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy or your data, please contact us at: <a className="underline" href="mailto:francesco@werunultras.com">francesco@werunultras.com</a></p>
          </div>
        </div>
      </div>
    </HeroBg>
  );
}