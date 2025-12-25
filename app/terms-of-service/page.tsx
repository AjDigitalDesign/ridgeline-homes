import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Ridgeline Homes",
  description: "Read the terms of service for using the Ridgeline Homes website.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16 xl:pt-20">
      {/* Hero Section */}
      <section className="bg-main-primary py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl lg:text-4xl font-bold text-white">
            Terms of Service
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
              <h2>Agreement to Terms</h2>
              <p>
                By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this site.
              </p>

              <h2>Use of Website</h2>
              <p>
                This website is provided for informational purposes regarding Ridgeline Homes communities, homes, and services. You may use this site for your personal, non-commercial use only.
              </p>
              <p>You agree not to:</p>
              <ul>
                <li>Use the site for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to any portion of the site</li>
                <li>Interfere with the proper working of the site</li>
                <li>Copy, distribute, or modify any part of the site without permission</li>
              </ul>

              <h2>Property Information</h2>
              <p>
                All information regarding homes, pricing, availability, features, and specifications is subject to change without notice. Images, renderings, and floor plans are for illustrative purposes only and may not represent the actual home. Square footage is approximate and may vary.
              </p>

              <h2>No Warranty</h2>
              <p>
                This website and all information, content, materials, and services included on or otherwise made available to you through this site are provided on an "as is" and "as available" basis. Ridgeline Homes makes no representations or warranties of any kind, express or implied.
              </p>

              <h2>Limitation of Liability</h2>
              <p>
                Ridgeline Homes shall not be liable for any damages of any kind arising from the use of this site, including but not limited to direct, indirect, incidental, punitive, and consequential damages.
              </p>

              <h2>Intellectual Property</h2>
              <p>
                All content on this website, including text, graphics, logos, images, and software, is the property of Ridgeline Homes or its content suppliers and is protected by copyright and other intellectual property laws.
              </p>

              <h2>Links to Third-Party Sites</h2>
              <p>
                This website may contain links to third-party websites. These links are provided for your convenience only. Ridgeline Homes has no control over and assumes no responsibility for the content, privacy policies, or practices of any third-party sites.
              </p>

              <h2>Changes to Terms</h2>
              <p>
                Ridgeline Homes reserves the right to modify these terms at any time. Your continued use of the site following any changes constitutes your acceptance of the new terms.
              </p>

              <h2>Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us through our website contact form or by calling our main office.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
