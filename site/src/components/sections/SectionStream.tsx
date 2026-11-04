import { Suspense, lazy, useEffect } from 'react';

/**
 * 分區 lazy chunk：並行載入 HTML 片段，縮短首屏後續區塊等待時間。
 * 現階段仍合併渲染；預載入 chunk 供後續拆分为獨立 section 元件。
 */
const preloadChunks = () =>
  Promise.all([
    import('@/legacy/sections/x05-integrations.html?raw'),
    import('@/legacy/sections/x03-tool-sim.html?raw'),
    import('@/legacy/sections/x02-product.html?raw'),
  ]);

const LazyLegacy = lazy(() =>
  import('./LegacyMainContent').then((m) => ({ default: m.LegacyMainContent })),
);

export function SectionStream() {
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(() => void preloadChunks());
      return () => cancelIdleCallback(id);
    }
    const t = globalThis.setTimeout(() => void preloadChunks(), 400);
    return () => globalThis.clearTimeout(t);
  }, []);

  return (
    <Suspense fallback={<p className="sec-intro">載入頁面模組…</p>}>
      <LazyLegacy />
    </Suspense>
  );
}
