'use client'

import Link from 'next/link'

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border p-6 md:p-10">
                <Link href="/login" className="text-sm text-blue-600 hover:underline mb-6 block">&larr; Back to Login</Link>

                <h1 className="text-2xl font-bold mb-2">Terms of Service &amp; Privacy Policy</h1>
                <p className="text-sm text-gray-400 mb-8">Last updated: February 28, 2025</p>

                <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
                    <section>
                        <h2 className="text-lg font-semibold text-gray-900">1. Introduction</h2>
                        <p>
                            Welcome to CloudCloset (&quot;we,&quot; &quot;our,&quot; or &quot;the Service&quot;). By creating an account or using our Service, you agree to be bound by these Terms of Service and our Privacy Policy described below. If you do not agree, please do not use the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-gray-900">2. Service Description</h2>
                        <p>
                            CloudCloset is an AI-powered outfit recommendation application. Users upload photos of their clothing, and the Service uses artificial intelligence to analyze garments and suggest outfit combinations based on weather conditions and personal style preferences.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-gray-900">3. Account &amp; Eligibility</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>You must be at least 13 years of age to use this Service.</li>
                            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                            <li>You agree to provide accurate and complete information during registration.</li>
                            <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-gray-900">4. Privacy Policy &amp; Data Collection</h2>
                        <p>We are committed to protecting your privacy. This section describes what data we collect, how we use it, and your rights.</p>

                        <h3 className="text-base font-semibold text-gray-800 mt-4">4.1 Information We Collect</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Account Information:</strong> Email address and password (encrypted) when you register.</li>
                            <li><strong>Profile Preferences:</strong> Gender, age group, and preferred fashion styles you provide during onboarding. This information is used solely to personalize outfit recommendations.</li>
                            <li><strong>Clothing Images:</strong> Photos you upload of your clothing. These images are processed by AI to identify garment attributes (type, color, style, season).</li>
                            <li><strong>Location Data:</strong> Approximate location (city-level) derived from your device to provide weather-based recommendations. We do not track precise GPS coordinates.</li>
                            <li><strong>Usage Data:</strong> Saved outfit preferences (&quot;My Style&quot; favorites) and interaction history within the app.</li>
                        </ul>

                        <h3 className="text-base font-semibold text-gray-800 mt-4">4.2 How We Use Your Information</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>To provide, maintain, and improve the Service.</li>
                            <li>To personalize AI-driven outfit recommendations based on your preferences and weather conditions.</li>
                            <li>To communicate important updates about the Service.</li>
                            <li>To ensure security and prevent fraudulent use of the Service.</li>
                        </ul>

                        <h3 className="text-base font-semibold text-gray-800 mt-4">4.3 Data Sharing</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>We do <strong>not</strong> sell, rent, or share your personal data with third parties for marketing purposes.</li>
                            <li>Your clothing images may be processed by third-party AI services (e.g., Anthropic Claude) solely for the purpose of garment analysis. These services process data in accordance with their own privacy policies and do not retain your images.</li>
                            <li>We use Supabase for secure data storage and authentication. Data is encrypted in transit and at rest.</li>
                            <li>We may disclose information if required by law or to protect the rights and safety of our users.</li>
                        </ul>

                        <h3 className="text-base font-semibold text-gray-800 mt-4">4.4 Data Retention &amp; Deletion</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Your data is retained for as long as your account is active.</li>
                            <li>You may request deletion of your account and all associated data at any time by contacting us.</li>
                            <li>Upon account deletion, all personal data, uploaded images, and preferences will be permanently removed within 30 days.</li>
                        </ul>

                        <h3 className="text-base font-semibold text-gray-800 mt-4">4.5 Your Rights</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Access:</strong> You may request a copy of your personal data.</li>
                            <li><strong>Correction:</strong> You may update or correct your profile information at any time.</li>
                            <li><strong>Deletion:</strong> You may request the deletion of your personal data.</li>
                            <li><strong>Portability:</strong> You may request your data in a portable format.</li>
                            <li>To exercise these rights, please contact us at the email provided below.</li>
                        </ul>

                        <h3 className="text-base font-semibold text-gray-800 mt-4">4.6 Cookies &amp; Local Storage</h3>
                        <p>
                            We use browser local storage to save your language preferences and authentication session. We do not use third-party tracking cookies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-gray-900">5. User Content</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>You retain ownership of all photos and content you upload to the Service.</li>
                            <li>By uploading content, you grant us a limited, non-exclusive license to process it for the purpose of providing the Service.</li>
                            <li>You must not upload content that is illegal, offensive, or infringes on the rights of others.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-gray-900">6. Disclaimers</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>The Service is provided &quot;as is&quot; without warranties of any kind.</li>
                            <li>AI-generated recommendations are suggestions only and may not always be accurate or suitable.</li>
                            <li>We are not liable for any decisions made based on AI recommendations.</li>
                            <li>Weather data is sourced from third-party providers and may not always be accurate.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-gray-900">7. Changes to These Terms</h2>
                        <p>
                            We may update these Terms from time to time. We will notify users of material changes via the Service. Continued use of the Service after changes constitutes acceptance of the updated Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-gray-900">8. Contact</h2>
                        <p>
                            If you have any questions about these Terms or our Privacy Policy, please use our <a href="/contact" className="text-blue-600 hover:underline">contact form</a>.
                        </p>
                    </section>
                </div>

                <div className="mt-8 pt-6 border-t text-center">
                    <Link href="/login" className="text-sm text-blue-600 hover:underline">
                        &larr; Back to Login
                    </Link>
                </div>
            </div>
        </div>
    )
}
