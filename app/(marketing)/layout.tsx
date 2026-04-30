import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Inline script that pins `<html data-theme="dark">` whenever a marketing
// route renders. The dashboard supports light + dark + system modes via
// `data-theme` on `<html>`; if a user picks light there and then clicks a
// marketing link, the residual `data-theme="light"` would carry over to the
// marketing site (which is dark-only per CLAUDE.md). This script resets it
// on every marketing page load — synchronously, before paint, so there's no
// flash of light theme on navigation.
const MARKETING_DARK_SCRIPT = `document.documentElement.dataset.theme="dark";`;

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: MARKETING_DARK_SCRIPT }} />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
