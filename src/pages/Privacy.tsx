import { Link } from 'react-router-dom';

export function Privacy() {
  return (
    <div className="flex flex-col items-center gap-8 pt-12 pb-12">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold text-text-primary">
          Privacy <span className="text-accent">Policy</span>
        </h1>
        <p className="mt-3 max-w-md text-text-secondary">
          Last updated: April 2026
        </p>
      </div>

      <div className="max-w-2xl space-y-8 text-sm text-text-secondary leading-relaxed">

        <section>
          <h2 className="font-display text-lg font-semibold text-text-primary mb-3">1. Who we are</h2>
          <p>TrackHunter (track-hunter.com) is a free music search tool that helps DJs, collectors and music lovers find tracks across Bandcamp, Beatport, Discogs and MusicBrainz. We do not sell your data.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-text-primary mb-3">2. Data we collect</h2>
          <div className="space-y-2">
            <p><strong className="text-text-primary">Analytics (Google Analytics 4):</strong> We collect anonymous usage data such as pages visited, session duration and browser type. This helps us improve the product. No personally identifiable information is collected.</p>
            <p><strong className="text-text-primary">Advertising (Google AdSense):</strong> We display ads served by Google AdSense. Google may use cookies to show relevant ads based on your browsing history.</p>
            <p><strong className="text-text-primary">Local storage:</strong> We store your recent searches and cookie consent preference locally in your browser. This data never leaves your device.</p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-text-primary mb-3">3. Cookies</h2>
          <p>We use cookies for analytics and advertising purposes. When you first visit TrackHunter, you are asked to accept or decline cookies. You can change your preference at any time by clearing your browser local storage or using the Settings page.</p>
          <div className="mt-3 rounded-sm border border-border bg-bg-secondary p-4 space-y-2">
            <div className="flex gap-3">
              <span className="text-text-primary font-medium w-32 shrink-0">_ga, _ga_*</span>
              <span>Google Analytics — tracks sessions and pageviews (expires 2 years)</span>
            </div>
            <div className="flex gap-3">
              <span className="text-text-primary font-medium w-32 shrink-0">__gads</span>
              <span>Google AdSense — used to display relevant ads</span>
            </div>
            <div className="flex gap-3">
              <span className="text-text-primary font-medium w-32 shrink-0">cookie_consent</span>
              <span>Stores your cookie preference locally (never sent to servers)</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-text-primary mb-3">4. Your rights (GDPR)</h2>
          <p>If you are located in the European Economic Area, you have the right to access, correct or delete your personal data, and to object to or restrict its processing. Since we do not collect personal data directly, most of these rights apply to data held by Google. You can manage Google's data collection via <a href="https://myaccount.google.com/data-and-privacy" target="_blank" rel="noopener noreferrer" className="text-accent underline">Google's privacy controls</a>.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-text-primary mb-3">5. Third-party services</h2>
          <p>TrackHunter integrates with the following third-party services, each governed by their own privacy policy:</p>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>Google Analytics — <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent underline">policies.google.com/privacy</a></li>
            <li>Google AdSense — <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-accent underline">policies.google.com/technologies/ads</a></li>
            <li>GetSongBPM — BPM data provider</li>
            <li>Bandcamp, Beatport, Discogs, MusicBrainz — search results only, no data shared</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-text-primary mb-3">6. Data retention</h2>
          <p>We do not store any personal data on our servers. Analytics data is retained by Google for 26 months. Local browser data (recent searches, preferences) can be cleared at any time via your browser settings.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-text-primary mb-3">7. Contact</h2>
          <p>For any questions about this privacy policy, please contact us at: <strong className="text-text-primary">privacy@track-hunter.com</strong></p>
        </section>

      </div>

      <Link to="/" className="mt-4 inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-2.5 text-sm font-medium text-text-inverse no-underline transition-colors hover:bg-accent-hover">
        Back to TrackHunter
      </Link>
    </div>
  );
}
