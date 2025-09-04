'use client';
import HeroBg from '@/components/HeroBg';

export default function TermsPage() {
  return (
    <HeroBg>
      <div className="p-8">
        <div className="max-w-3xl mx-auto">
          <div className="card space-y-4">
            <h1 className="text-2xl font-bold">Terms of Service</h1>
            <p><strong>Effective Date:</strong> September 2025</p>

            <p>
              Welcome to PeakForm. By using PeakForm, you agree to these Terms of Service.
              Please read them carefully.
            </p>

            <h2 className="text-xl font-semibold">1. Eligibility</h2>
            <p>
              You must be at least 16 years old to use PeakForm. By using the service,
              you confirm that you meet this requirement.
            </p>

            <h2 className="text-xl font-semibold">2. Account Registration</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>You must provide a valid email address to create an account.</li>
              <li>You are responsible for maintaining the security of your account and for all activities that occur under it.</li>
            </ul>

            <h2 className="text-xl font-semibold">3. Use of the Service</h2>
            <p>You agree to use PeakForm only for lawful purposes and in accordance with these Terms. Specifically:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>You may log your own training, nutrition, and wellbeing data.</li>
              <li>You may not attempt to access or interfere with other users’ data.</li>
              <li>You may not use PeakForm to transmit malicious code or engage in activity that disrupts the service.</li>
            </ul>

            <h2 className="text-xl font-semibold">4. Data and Privacy</h2>
            <p>
              Our collection and use of personal information is described in the{' '}
              <a className="underline" href="/privacy">Privacy Policy</a>. By using PeakForm,
              you consent to the collection and use of information as outlined there.
            </p>

            <h2 className="text-xl font-semibold">5. Service Availability</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>We aim to provide reliable service, but PeakForm is provided on an “as is” and “as available” basis.</li>
              <li>We may modify, suspend, or discontinue the service at any time without prior notice.</li>
            </ul>

            <h2 className="text-xl font-semibold">6. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, PeakForm and its operators are not liable for any indirect,
              incidental, or consequential damages arising from your use of the service.
              PeakForm does not provide medical or professional advice; information in the app should not replace
              guidance from qualified professionals.
            </p>

            <h2 className="text-xl font-semibold">7. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account if you violate these Terms
              or if we believe it is necessary to protect the security and integrity of the service.
            </p>

            <h2 className="text-xl font-semibold">8. Changes to These Terms</h2>
            <p>
              We may update these Terms of Service from time to time. If we make significant changes,
              we will notify you by email or within the app.
            </p>

            <h2 className="text-xl font-semibold">9. Contact</h2>
            <p>
              If you have any questions about these Terms, please contact us at{' '}
              <a className="underline" href="mailto:francesco@werunultras.com">francesco@werunultras.com</a>.
            </p>
          </div>
        </div>
      </div>
    </HeroBg>
  );
}