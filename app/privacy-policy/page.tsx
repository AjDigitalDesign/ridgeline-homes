import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Ridgeline Homes",
  description: "Read the privacy policy for Ridgeline Homes website and learn how we collect, use, and protect your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16 xl:pt-20">
      {/* Hero Section */}
      <section className="bg-main-primary py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl lg:text-4xl font-bold text-white">
            Privacy Policy
          </h1>
          <p className="text-white/80 mt-2">
            Last updated: December 2024
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 lg:p-12">
            <div className="prose prose-lg max-w-none">
              <h2>Introduction</h2>
              <p>
                Ridgeline Homes ("we," "our," or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
              </p>

              <h2>Information We Collect</h2>
              <h3>Personal Information</h3>
              <p>We may collect personal information that you voluntarily provide, including:</p>
              <ul>
                <li>Name and contact information (email, phone number, address)</li>
                <li>Inquiry and interest preferences</li>
                <li>Information submitted through forms</li>
                <li>Account registration information</li>
              </ul>

              <h3>Automatically Collected Information</h3>
              <p>When you visit our website, we may automatically collect:</p>
              <ul>
                <li>IP address and browser type</li>
                <li>Device information</li>
                <li>Pages visited and time spent</li>
                <li>Referring website</li>
                <li>Cookies and similar technologies</li>
              </ul>

              <h2>How We Use Your Information</h2>
              <p>We may use the information we collect to:</p>
              <ul>
                <li>Respond to your inquiries and requests</li>
                <li>Provide information about our homes and communities</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Analyze usage patterns and trends</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2>Information Sharing</h2>
              <p>We may share your information with:</p>
              <ul>
                <li>Service providers who assist with our operations</li>
                <li>Preferred lenders (with your consent)</li>
                <li>Real estate agents and sales teams</li>
                <li>Legal and regulatory authorities when required</li>
              </ul>
              <p>We do not sell your personal information to third parties.</p>

              <h2>Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your experience on our website. You can control cookies through your browser settings, but disabling cookies may affect site functionality.
              </p>

              <h2>Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>

              <h2>Your Rights</h2>
              <p>Depending on your location, you may have rights to:</p>
              <ul>
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt out of marketing communications</li>
                <li>Object to certain processing activities</li>
              </ul>

              <h2>Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites and encourage you to review their privacy policies.
              </p>

              <h2>Children's Privacy</h2>
              <p>
                Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
              </p>

              <h2>Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated effective date.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or our privacy practices, please contact us through our website contact form or by calling our main office.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
