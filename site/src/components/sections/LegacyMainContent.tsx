import { useEffect } from 'react';
import mainHtml from '@/legacy/main-content.html?raw';
import { runLegacyBootstrap } from '@/runtime/legacyBootstrap';

export function LegacyMainContent() {
  useEffect(() => {
    void runLegacyBootstrap();
  }, []);

  return (
    <div
      className="legacy-main-host"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: mainHtml }}
    />
  );
}
