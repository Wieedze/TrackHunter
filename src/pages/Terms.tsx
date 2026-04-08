import { Link } from 'react-router-dom';

export function Terms() {
  return (
    <div className="flex flex-col items-center gap-8 pt-12 pb-12">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold text-text-primary">
          Terms of <span className="text-accent">Service</span>
        </h1>
        <p className="mt-3 max-w-md text-text-secondary">
          Last updated: April 2026
        </p>
      </div>

      <div className="max-w-2xl space-y-8 text-sm text-text-secondary leading-relaxed">

        <section>
          <h2 className="font-display text-lg font-semibold text-text-primary mb-3">1. Acceptance of terms</h2>
          <p>By accessing and using TrackHunter (track-hunter.com), you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-text-primary mb-3">2. Description of service</h2>
          <p>TrackHunter is a free music search engine that helps users find tracks across multiple platforms including Bandcamp, Beatport, Discogs and MusicBrainz. We aggregate publicly available search results and do not host, stream or distribute any music content.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-text-primary mb-3">3. User responsibilities</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>You may use TrackHunter for personal, non-commercial purposes.</li>
            <li>You must not use automated tools (bots, scrapers) to access the service at scale.</li>
            <li>You must not attempt to circumvent any technical limitations of the service.</li>
            <li>You are responsible for any content you import (playlists, track lists).</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-text-primary mb-3">4. Intellectual property</h2>
          <p>All music metadata, artwork and links displayed on TrackHunter belong to their respective owners (artists, labels, platforms). TrackHunter does not claim ownership of any third-party content. The TrackHunter name, logo and interface design are our property.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-text-primary mb-3">5. Third-party services</h2>
          <p>TrackHunter integrates with third-party platforms (Bandcamp, Beatport, Discogs, MusicBrainz, Spotify, YouTube, SoundCloud, GetSongBPM). We are not responsible for the availability, accuracy or content of these services. Each platform is governed by its own terms of service.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-text-primary mb-3">6. Disclaimer of warranties</h2>
          <p>TrackHunter is provided "as is" without any warranty, express or implied. We do not guarantee that search results will be accurate, complete or up to date. BPM and key data are estimates and may not be 100% accurate.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-text-primary mb-3">7. Limitation of liability</h2>
          <p>TrackHunter and its creators shall not be liable for any direct, indirect, incidental or consequential damages arising from the use of the service, including but not limited to incorrect search results or broken links.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-text-primary mb-3">8. Modifications</h2>
          <p>We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated date. Continued use of the service after changes constitutes acceptance of the new terms.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-text-primary mb-3">9. Contact</h2>
          <p>For any questions about these terms, please contact us at: <strong className="text-text-primary">contact@track-hunter.com</strong></p>
        </section>

      </div>

      <Link to="/" className="mt-4 inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-2.5 text-sm font-medium text-text-inverse no-underline transition-colors hover:bg-accent-hover">
        Back to TrackHunter
      </Link>
    </div>
  );
}
