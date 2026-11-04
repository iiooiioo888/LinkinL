import { useEffect } from 'react';
import { TechFabricSection } from '@/components/tech/TechFabricSection';
import heroHtml from '@/legacy/sections/x00-hero.html?raw';
import afterHeroHtml from '@/legacy/main-content-after-hero.html?raw';
import { runLegacyBootstrap } from '@/runtime/legacyBootstrap';

export function LegacyMainContent() {
  useEffect(() => {
    void runLegacyBootstrap();
  }, []);

  return (
    <>
      <div
        className="legacy-main-host"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: heroHtml }}
      />
      <TechFabricSection />
      <div
        className="legacy-main-host"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: afterHeroHtml }}
      />
    </>
  );
}
