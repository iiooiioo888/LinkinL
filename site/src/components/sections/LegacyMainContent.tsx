import { useEffect } from 'react';
import { EcosystemStackSection } from '@/components/ecosystem/EcosystemStackSection';
import { TechFabricSection } from '@/components/tech/TechFabricSection';
import heroHtml from '@/legacy/sections/x00-hero.html?raw';
import plainSpineHtml from '@/legacy/sections/plain-spine.html?raw';
import localSetupHtml from '@/legacy/sections/local-setup.html?raw';
import faqHtml from '@/legacy/sections/faq-section.html?raw';
import advancedDemosHtml from '@/legacy/sections/advanced-demos.html?raw';
import appendixHtml from '@/legacy/sections/appendix-fold.html?raw';
import { runLegacyBootstrap } from '@/runtime/legacyBootstrap';

function LegacyHtmlHost({ html }: { html: string }) {
  return (
    <div
      className="legacy-main-host"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function LegacyMainContent() {
  useEffect(() => {
    void runLegacyBootstrap();
  }, []);

  return (
    <>
      <LegacyHtmlHost html={heroHtml} />
      <LegacyHtmlHost html={plainSpineHtml} />
      <LegacyHtmlHost html={localSetupHtml} />
      <EcosystemStackSection />
      <LegacyHtmlHost html={faqHtml} />
      <details className="site-fold site-advanced" id="x-advanced">
        <summary className="site-fold-summary">
          <span className="site-fold-title">進階 · 動畫與技術細節</span>
          <span className="site-fold-hint">給想深挖的人；一般使用不必展開</span>
        </summary>
        <div className="site-fold-body">
          <LegacyHtmlHost html={advancedDemosHtml} />
          <details className="site-fold site-fold-nested" id="x00b-tech-fabric-fold">
            <summary className="site-fold-summary">
              <span className="site-fold-title">本機連線與量測面板</span>
            </summary>
            <div className="site-fold-body">
              <TechFabricSection />
            </div>
          </details>
          <LegacyHtmlHost html={appendixHtml} />
        </div>
      </details>
    </>
  );
}
