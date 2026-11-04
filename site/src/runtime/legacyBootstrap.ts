import { clearAllSimSchedules, scheduleSim } from '@/sim/schedulerClient';

declare global {
  interface Window {
    /** Legacy inline sims use Worker-backed timers when present. */
    __linkinlSchedule?: typeof scheduleSim;
  }
}

const CDN = {
  lenis: 'https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js',
  gsap: 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js',
  scrollTrigger: 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js',
  chart: 'https://cdn.jsdelivr.net/npm/chart.js@4.4.6/dist/chart.umd.min.js',
};

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-linkinl-src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.dataset.linkinlSrc = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(s);
  });
}

function loadInlineLegacy(): Promise<void> {
  return new Promise((resolve, reject) => {
    const src = `${import.meta.env.BASE_URL}legacy/inline-scripts.js`;
    const existing = document.querySelector(`script[data-linkinl-legacy="1"]`);
    if (existing) {
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.defer = true;
    s.dataset.linkinlLegacy = '1';
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('legacy inline-scripts failed'));
    document.body.appendChild(s);
  });
}

let bootPromise: Promise<void> | null = null;

export function runLegacyBootstrap(): Promise<void> {
  if (bootPromise) return bootPromise;
  bootPromise = (async () => {
    await Promise.all([
      loadScript(CDN.lenis),
      loadScript(CDN.gsap),
      loadScript(CDN.scrollTrigger),
      loadScript(CDN.chart),
    ]);
    window.__linkinlSchedule = scheduleSim;
    await loadInlineLegacy();
  })();
  return bootPromise;
}

export function teardownLegacyBootstrap(): void {
  clearAllSimSchedules();
}
