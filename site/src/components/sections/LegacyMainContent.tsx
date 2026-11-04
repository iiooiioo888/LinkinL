import { useEffect } from 'react';
import { EcosystemStackSection } from '@/components/ecosystem/EcosystemStackSection';
import { TechFabricSection } from '@/components/tech/TechFabricSection';
import heroHtml from '@/legacy/sections/x00-hero.html?raw';
import spineHtml from '@/legacy/sections/spine-narrative.html?raw';
import localSetupHtml from '@/legacy/sections/local-setup.html?raw';
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
      <LegacyHtmlHost html={spineHtml} />
      <LegacyHtmlHost html={localSetupHtml} />
      <EcosystemStackSection />
      <details className="site-fold site-fold-tech" id="x00b-tech-fabric-fold">
        <summary className="site-fold-summary">
          <span className="mono">RUNTIME</span>
          <span className="site-fold-title">本機探測與量測（選展開）</span>
          <span className="site-fold-hint">頂部 ribbon 已顯示 build / RTT · 此區為完整 probe 面板</span>
        </summary>
        <div className="site-fold-body">
          <TechFabricSection />
        </div>
      </details>
      <LegacyHtmlHost html={appendixHtml} />
    </>
  );
}
