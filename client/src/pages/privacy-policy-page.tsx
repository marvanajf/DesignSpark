import { Metadata } from "@/components/ui/metadata";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Metadata
        title="Privacy Policy | Tovably"
        description="Our privacy policy details how Tovably collects, uses, and protects your personal information."
      />
      
      <div className="max-w-4xl mx-auto py-16 px-6">
        <h1 className="text-3xl font-medium mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none">
          <h2>1. Introduction</h2>
          <p>
            Tovably ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
          </p>
          
          <h2>2. Information We Collect</h2>
          <p>We may collect information about you in various ways, including:</p>
          <ul>
            <li><strong>Personal Data:</strong> Name, email address, company information, and other contact details you provide when creating an account or contacting us.</li>
            <li><strong>Usage Data:</strong> Information about how you use our website and services, including your interactions, preferences, and settings.</li>
            <li><strong>Content Data:</strong> Information you input for analysis, including text samples, website URLs, and other content you provide for tone analysis or content generation.</li>
            <li><strong>Payment Information:</strong> When you purchase a subscription, we collect payment details through our secure payment processor (Stripe).</li>
          </ul>
          
          <h2>3. Cookies and Similar Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
          </p>
          <p>We use cookies for the following purposes:</p>
          <ul>
            <li>To enable certain functions of the website</li>
            <li>To provide analytics and understand how users interact with our site</li>
            <li>To remember your preferences and settings</li>
            <li>To maintain your authenticated session while using our services</li>
          </ul>
          
          <h2>4. How We Use Your Information</h2>
          <p>We may use the information we collect for various purposes, including:</p>
          <ul>
            <li>Providing, maintaining, and improving our services</li>
            <li>Processing and completing transactions</li>
            <li>Sending administrative information, such as updates, security alerts, and support messages</li>
            <li>Responding to your comments, questions, and requests</li>
            <li>Analyzing usage patterns to enhance user experience</li>
            <li>Personalizing your experience and delivering content relevant to your interests</li>
          </ul>
          
          <h2>5. Information Sharing and Disclosure</h2>
          <p>We may share information about you in the following situations:</p>
          <ul>
            <li><strong>Third-Party Service Providers:</strong> We may share your information with third-party vendors, service providers, and other partners who help us provide our services.</li>
            <li><strong>Compliance with Laws:</strong> We may disclose your information where required by law or if we believe disclosure is necessary to protect our rights or comply with a legal process.</li>
            <li><strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
          </ul>
          
          <h2>6. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
          
          <h2>7. Your Data Protection Rights</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
          <ul>
            <li>The right to access the personal information we hold about you</li>
            <li>The right to request correction of inaccurate information</li>
            <li>The right to request deletion of your personal information</li>
            <li>The right to withdraw consent where we rely on consent to process your information</li>
            <li>The right to object to our processing of your personal information</li>
            <li>The right to data portability</li>
          </ul>
          
          <h2>8. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this page.
          </p>
          
          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@tovably.com" className="text-[#74d1ea] hover:underline">privacy@tovably.com</a>.
          </p>
        </div>
        
        <div className="mt-12 text-center text-sm text-zinc-500">
          <p>Last Updated: May 1, 2025</p>
          <p className="mt-2">
            &copy; {new Date().getFullYear()} Tovably. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}