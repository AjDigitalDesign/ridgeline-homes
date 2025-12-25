import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | Ridgeline Homes",
  description: "Learn about how Ridgeline Homes uses cookies on our website.",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16 xl:pt-20">
      {/* Hero Section */}
      <section className="bg-main-primary py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl lg:text-4xl font-bold text-white">
            Cookie Policy
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
              <h2>What Are Cookies?</h2>
              <p>
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.
              </p>

              <h2>How We Use Cookies</h2>
              <p>We use cookies for the following purposes:</p>

              <h3>Essential Cookies</h3>
              <p>
                These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas. The website cannot function properly without these cookies.
              </p>

              <h3>Analytics Cookies</h3>
              <p>
                These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website and user experience.
              </p>

              <h3>Functional Cookies</h3>
              <p>
                These cookies enable the website to remember choices you make (such as your username or preferences) and provide enhanced, more personalized features.
              </p>

              <h3>Marketing Cookies</h3>
              <p>
                These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for individual users.
              </p>

              <h2>Types of Cookies We Use</h2>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Cookie Type</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Purpose</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Session Cookies</td>
                    <td className="border border-gray-300 px-4 py-2">Enable core functionality</td>
                    <td className="border border-gray-300 px-4 py-2">Session</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Preference Cookies</td>
                    <td className="border border-gray-300 px-4 py-2">Remember your settings</td>
                    <td className="border border-gray-300 px-4 py-2">1 year</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Analytics Cookies</td>
                    <td className="border border-gray-300 px-4 py-2">Understand site usage</td>
                    <td className="border border-gray-300 px-4 py-2">2 years</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Authentication Cookies</td>
                    <td className="border border-gray-300 px-4 py-2">Keep you signed in</td>
                    <td className="border border-gray-300 px-4 py-2">30 days</td>
                  </tr>
                </tbody>
              </table>

              <h2>Third-Party Cookies</h2>
              <p>
                Some cookies on our site are set by third-party services. These may include:
              </p>
              <ul>
                <li>Google Analytics for website analytics</li>
                <li>Social media platforms for sharing features</li>
                <li>Mapping services for location features</li>
                <li>Authentication providers for login services</li>
              </ul>

              <h2>Managing Cookies</h2>
              <p>
                Most web browsers allow you to control cookies through their settings. You can typically:
              </p>
              <ul>
                <li>See what cookies are stored and delete them individually</li>
                <li>Block third-party cookies</li>
                <li>Block all cookies</li>
                <li>Delete all cookies when you close your browser</li>
              </ul>
              <p>
                Please note that blocking or deleting cookies may affect the functionality of our website and your user experience.
              </p>

              <h3>Browser-Specific Instructions</h3>
              <p>
                To manage cookies in your browser, consult your browser's help documentation or settings. Common browsers include Chrome, Firefox, Safari, and Edge.
              </p>

              <h2>Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated effective date.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have questions about our use of cookies, please contact us through our website contact form or by calling our main office.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
