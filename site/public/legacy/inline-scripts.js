
    (function () {
      var metaBuild = document.querySelector('meta[name="linkinl-build"]');
      var label = document.getElementById('site-build-label');
      fetch('version.json?_=' + Date.now(), { cache: 'no-store' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (v) {
          if (!v) return;
          if (label) label.textContent = v.short + (v.deployedAt ? ' · ' + v.deployedAt.slice(0, 10) : '');
          if (metaBuild) metaBuild.setAttribute('content', v.short);
          var rail = document.querySelectorAll('.timeline-rail .rail-node').length;
          if (v.railNodes && rail > 0 && rail < v.railNodes) {
            var bar = document.createElement('div');
            bar.className = 'cache-banner';
            bar.setAttribute('role', 'status');
            bar.innerHTML =
              '偵測到舊版快取（左軌 ' + rail + ' 節點，最新為 ' + v.railNodes +
              '）。請 <strong>Ctrl+Shift+R</strong>（Mac：<strong>⌘+Shift+R</strong>）硬重新整理，或 ' +
              '<a href="index.html?_=' + encodeURIComponent(v.short) + '">用此連結</a> 開新版本。';
            document.body.classList.add('has-cache-banner');
            document.body.appendChild(bar);
          }
        })
        .catch(function () {});
    })();
  


    (function () {
      var SITE_SECTIONS = [
        { id: 'x00-hero', label: '首頁' },
        { id: 'x01-pain', label: '痛點' },
        { id: 'x02-product', label: '四層' },
        { id: 'x03-engine', label: '引擎' },
        { id: 'x03-tool-sim', label: '工具' },
        { id: 'x04-evidence', label: '實證' },
        { id: 'x05-integrations', label: '整合' },
        { id: 'x05-ui-atlas', label: '組件' },
        { id: 'x06-compare', label: '對照' },
        { id: 'x07-trust', label: '信任' },
        { id: 'x08-voices', label: '聲音' },
        { id: 'x09-pricing', label: '定價' },
        { id: 'x0b-layers', label: '架構' },
        { id: 'x0c-install', label: '安裝' },
        { id: 'x0d-where', label: '分工' },
        { id: 'x0a-faq', label: 'FAQ' }
      ];
      var LEGACY_HASH = {
        '#hero': '#x00-hero',
        '#pain': '#x01-pain',
        '#product': '#x02-product',
        '#engine': '#x03-engine',
        '#engine-budget': '#x03-budget',
        '#engine-consensus': '#x03-consensus',
        '#tool-sim': '#x03-tool-sim',
        '#evidence': '#x04-evidence',
        '#integrations': '#x05-integrations',
        '#ui-atlas': '#x05-ui-atlas',
        '#compare': '#x06-compare',
        '#trust': '#x07-trust',
        '#voices': '#x08-voices',
        '#pricing': '#x09-pricing',
        '#faq': '#x0a-faq'
      };
      if (LEGACY_HASH[window.location.hash]) {
        history.replaceState(null, '', LEGACY_HASH[window.location.hash]);
      }

      function linkinlDelay(ms, fn) {
        if (typeof window.__linkinlSchedule === 'function') {
          return window.__linkinlSchedule(ms, fn);
        }
        var id = setTimeout(fn, ms);
        return function () {
          clearTimeout(id);
        };
      }
      function cancelLinkinlDelay(handle) {
        if (handle) handle();
      }

      function buildSiteNav() {
        var nav = document.getElementById('site-nav');
        if (!nav) return;
        if (nav.getAttribute('data-nav-built') === 'react') return;
        nav.innerHTML = '';
        SITE_SECTIONS.forEach(function (s, i) {
          var a = document.createElement('a');
          a.href = '#' + s.id;
          a.textContent = s.label;
          a.setAttribute('data-nav-id', s.id);
          if (i === 0) a.classList.add('on');
          nav.appendChild(a);
        });
        nav.setAttribute('data-nav-built', 'done');
      }
      buildSiteNav();

      var topbarOffset = function () {
        var v = getComputedStyle(document.documentElement).getPropertyValue('--topbar').trim();
        return (parseInt(v, 10) || 52) + 8;
      };

      var lenis = null;
      if (typeof Lenis !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        lenis = new Lenis({ lerp: 0.08, smoothWheel: true, wheelMultiplier: 0.9 });
        if (typeof gsap !== 'undefined') {
          lenis.on('scroll', function () {
            if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
          });
          gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
          gsap.ticker.lagSmoothing(0);
        } else {
          function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
          requestAnimationFrame(raf);
        }
        document.querySelectorAll('a[href^="#"]').forEach(function (a) {
          a.addEventListener('click', function (e) {
            var id = a.getAttribute('href');
            if (!id || id === '#') return;
            var el = document.querySelector(id);
            if (el) {
              e.preventDefault();
              lenis.scrollTo(el, { offset: -topbarOffset() });
            }
          });
        });
      }

      function markVisible(el) {
        el.classList.add('is-visible');
        el.style.opacity = '1';
        el.style.transform = 'none';
      }

      function setupReveals() {
        var els = document.querySelectorAll('.reveal, .gs-reveal');
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          els.forEach(markVisible);
          return;
        }
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
          gsap.registerPlugin(ScrollTrigger);
          els.forEach(function (el) {
            if (el.getBoundingClientRect().top < window.innerHeight * 0.94) {
              gsap.set(el, { opacity: 1, y: 0 });
              el.classList.add('is-visible');
              return;
            }
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power2.out',
              scrollTrigger: { trigger: el, start: 'top 94%', once: true },
              onComplete: function () { el.classList.add('is-visible'); }
            });
          });
          ScrollTrigger.refresh();
        } else {
          els.forEach(markVisible);
        }
      }
      setupReveals();

      var stageCount = 7;
      var traceTimer = null;
      function clearTrace() {
        document.querySelectorAll('.dag-node').forEach(function (n) { n.classList.remove('active'); });
        document.querySelectorAll('.dag-edge[data-edge]').forEach(function (e) {
          e.classList.remove('active');
          e.setAttribute('marker-end', 'url(#arrow)');
        });
      }
      function runTrace() {
        clearTrace();
        var i = 0;
        if (traceTimer) clearInterval(traceTimer);
        traceTimer = setInterval(function () {
          document.querySelectorAll('.dag-node').forEach(function (n, idx) {
            n.classList.toggle('active', idx === i);
          });
          document.querySelectorAll('.dag-edge[data-edge]').forEach(function (e) {
            var idx = parseInt(e.getAttribute('data-edge'), 10);
            var on = idx < i;
            e.classList.toggle('active', on);
            e.setAttribute('marker-end', on ? 'url(#arrow-lime)' : 'url(#arrow)');
          });
          i++;
          if (i >= stageCount) {
            clearInterval(traceTimer);
            traceTimer = null;
          }
        }, 420);
      }
      ['trace-rerun', 'hero-rerun'].forEach(function (id) {
        var btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', runTrace);
      });
      runTrace();

      var TOOL_PATHS = {
        simple: {
          run: 'run-s1e0 · simple',
          steps: [
            { name: '路由解析', sub: '→ simple', logs: [
              { ts: '+0ms', cls: 'sys', text: 'POST /chat/stream  preview=simple' },
              { ts: '+18ms', cls: 'sys', text: 'resolve_execution_path → simple' }
            ]},
            { name: '記憶檢索', sub: 'chroma.query', logs: [
              { ts: '+40ms', cls: 'tool', text: 'tool chroma.query  top_k=3' },
              { ts: '+52ms', cls: 'ok', text: '← 1 chunk · 420 tokens' }
            ]},
            { name: '單次生成', sub: 'call_llm', logs: [
              { ts: '+60ms', cls: 'llm', text: 'call_llm  tier=routine  path=simple', delay: 700 },
              { ts: '+640ms', cls: 'ok', text: '← answer len=380' }
            ]},
            { name: '多維評估', sub: '長度守門', logs: [
              { ts: '+660ms', cls: 'gate', text: 'eval score=8.4  threshold=8  iter=1/3' },
              { ts: '+670ms', cls: 'ok', text: '達標 · 不再反思' }
            ]},
            { name: '產出封存', sub: 'CID', logs: [
              { ts: '+690ms', cls: 'tool', text: 'archive.write  final_answer.md' },
              { ts: '+710ms', cls: 'ok', text: 'CID bafybei…s1  h₁←genesis' }
            ]}
          ]
        },
        company: {
          run: 'run-a3f9c2 · industrial_ops',
          steps: [
            { name: '路由解析', sub: 'resolve_execution_path', logs: [
              { ts: '+0ms', cls: 'sys', text: 'POST /chat/stream  trace_id=run-a3f9c2' },
              { ts: '+12ms', cls: 'sys', text: 'resolve_execution_path → company (industrial_ops)' }
            ]},
            { name: '記憶檢索', sub: 'chroma.query', logs: [
              { ts: '+84ms', cls: 'tool', text: 'tool chroma.query  top_k=8  collection=session_mem' },
              { ts: '+96ms', cls: 'ok', text: '← 6 chunks · 2.1k tokens (injected)' }
            ]},
            { name: 'OPC 讀取', sub: 'opc.read · guard', logs: [
              { ts: '+142ms', cls: 'tool', text: 'tool opc.read  nodes=[Temperature,Pressure,ValvePosition]' },
              { ts: '+158ms', cls: 'ok', text: '← OPC guard read-only · sim :4840' }
            ]},
            { name: '整合召回', sub: 'WeKnora · skip', logs: [
              { ts: '+201ms', cls: 'sys', text: 'integration_recall WeKnora · explicit=false → skip' }
            ]},
            { name: '量化工具', sub: 'quant.fetch_yahoo', logs: [
              { ts: '+240ms', cls: 'tool', text: 'tool quant.fetch_yahoo  symbol=2330.TW' },
              { ts: '+318ms', cls: 'ok', text: '← spot +1.2% · injected to company goal' }
            ]},
            { name: '任務生成', sub: 'call_llm · LiteLLM', logs: [
              { ts: '+340ms', cls: 'llm', text: 'call_llm  model=gpt-4o  tier=routine  tokens≈842', delay: 920 },
              { ts: '+1.84s', cls: 'ok', text: '← draft answer len=1.2k · reflect=off' }
            ]},
            { name: '預算閘門', sub: 'L03 hard stop', logs: [
              { ts: '+1.86s', cls: 'gate', text: 'budget_gate  tokens=84,320/128,000  cost=$8.42/$12.00' },
              { ts: '+1.87s', cls: 'ok', text: 'L03 PASS · rate 38/60 req·min⁻¹' }
            ]},
            { name: '產出封存', sub: 'CID · hash chain', logs: [
              { ts: '+1.92s', cls: 'tool', text: 'archive.write  final_answer.md + tool_trace.json' },
              { ts: '+1.95s', cls: 'ok', text: 'CID bafybei…k7m2  sha256=9f2c…a1  h₃←h₂' }
            ]}
          ]
        },
        minecraft: {
          run: 'run-mc04 · minecraft_ops',
          steps: [
            { name: '路由解析', sub: '→ minecraft_ops', logs: [
              { ts: '+0ms', cls: 'sys', text: 'POST /chat  strategy=auto  content=單步放置' },
              { ts: '+14ms', cls: 'sys', text: 'resolve_execution_path → minecraft_ops' }
            ]},
            { name: '世界讀取', sub: 'MineMCP', logs: [
              { ts: '+40ms', cls: 'tool', text: 'tool minecraft.inspect  world=world  r=8' },
              { ts: '+88ms', cls: 'ok', text: '← player pos · 無寫入' }
            ]},
            { name: '單步工具', sub: 'minecraft_mcp', logs: [
              { ts: '+100ms', cls: 'tool', text: 'tool minecraft.place  block=oak_log  n=1' },
              { ts: '+160ms', cls: 'ok', text: '← JSON-RPC :3000 · guard ok' }
            ]},
            { name: '評估一次', sub: '超長才反思', logs: [
              { ts: '+180ms', cls: 'gate', text: 'eval once · length ok · reflect skipped' },
              { ts: '+190ms', cls: 'ok', text: '定稿' }
            ]},
            { name: '產出封存', sub: 'trace', logs: [
              { ts: '+210ms', cls: 'tool', text: 'archive.write  tool_trace.json' },
              { ts: '+230ms', cls: 'ok', text: 'CID bafybei…mc  h₁←genesis' }
            ]}
          ]
        }
      };
      var toolPath = 'company';
      var toolSimSteps = TOOL_PATHS.company.steps;
      var toolSimTimer = null;
      var toolSimLoopTimer = null;
      var toolSimStarted = false;

      function renderToolRail() {
        var rail = document.getElementById('tool-sim-rail');
        var spec = TOOL_PATHS[toolPath];
        toolSimSteps = spec.steps;
        var runEl = document.getElementById('tool-sim-run');
        if (runEl) runEl.textContent = spec.run;
        if (!rail) return;
        rail.innerHTML = '';
        spec.steps.forEach(function (step, idx) {
          var row = document.createElement('div');
          row.className = 'tool-step';
          row.setAttribute('data-tool-step', String(idx));
          var n = idx + 1;
          row.innerHTML = '<span class="tool-step-idx">' + (n < 10 ? '0' + n : n) + '</span>' +
            '<div class="tool-step-body"><div class="tool-step-name"></div><div class="tool-step-sub"></div></div>';
          row.querySelector('.tool-step-name').textContent = step.name;
          row.querySelector('.tool-step-sub').textContent = step.sub;
          rail.appendChild(row);
        });
      }

      function resetToolSimUI() {
        cancelLinkinlDelay(toolSimTimer);
        toolSimTimer = null;
        renderToolRail();
        document.querySelectorAll('[data-tool-step]').forEach(function (el) {
          el.classList.remove('active', 'done');
        });
        var log = document.getElementById('tool-log');
        if (log) log.innerHTML = '';
        var prog = document.getElementById('tool-sim-progress');
        if (prog) prog.style.width = '0%';
        var bar = document.getElementById('tool-sim-bar');
        if (bar) bar.classList.add('idle');
        var elapsed = document.getElementById('tool-sim-elapsed');
        if (elapsed) elapsed.textContent = '0.0s';
        setToolSimStatus('running');
      }

      function setToolSimStatus(mode) {
        var el = document.getElementById('tool-sim-status');
        if (!el) return;
        var labels = {
          idle: 'idle · 可 RE-RUN',
          running: 'running · 工具鏈執行中',
          done: 'complete · trace 可重播'
        };
        el.innerHTML = '狀態：<strong>' + (labels[mode] || mode) + '</strong>';
      }

      function appendToolLogLine(entry) {
        var log = document.getElementById('tool-log');
        var viewport = document.getElementById('tool-sim-viewport');
        if (!log) return;
        var line = document.createElement('div');
        line.className = 'tool-log-line show';
        line.innerHTML = '<span class="ts">' + entry.ts + '</span><span class="lvl-' + entry.cls + '">' + entry.text + '</span>';
        log.appendChild(line);
        if (viewport) viewport.scrollTop = viewport.scrollHeight;
      }

      function runToolSim(autoLoop) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          resetToolSimUI();
          toolSimSteps.forEach(function (step, idx) {
            var el = document.querySelector('[data-tool-step="' + idx + '"]');
            if (el) el.classList.add('done');
            step.logs.forEach(appendToolLogLine);
          });
          var prog = document.getElementById('tool-sim-progress');
          if (prog) prog.style.width = '100%';
          setToolSimStatus('done');
          return;
        }
        resetToolSimUI();
        var bar = document.getElementById('tool-sim-bar');
        if (bar) bar.classList.remove('idle');
        var stepIdx = 0;
        var logIdx = 0;
        var t0 = performance.now();

        function tickElapsed() {
          var elapsed = document.getElementById('tool-sim-elapsed');
          if (elapsed) elapsed.textContent = ((performance.now() - t0) / 1000).toFixed(1) + 's';
        }

        function finishToolSim() {
          document.querySelectorAll('[data-tool-step]').forEach(function (el, idx) {
            el.classList.remove('active');
            el.classList.add('done');
          });
          var prog = document.getElementById('tool-sim-progress');
          if (prog) prog.style.width = '100%';
          if (bar) bar.classList.add('idle');
          setToolSimStatus('done');
          if (autoLoop !== false) {
            cancelLinkinlDelay(toolSimLoopTimer);
            toolSimLoopTimer = linkinlDelay(4200, function () {
              runToolSim(true);
            });
          }
        }

        function runStep() {
          tickElapsed();
          document.querySelectorAll('[data-tool-step]').forEach(function (el, idx) {
            el.classList.toggle('active', idx === stepIdx);
            el.classList.toggle('done', idx < stepIdx);
          });
          var prog = document.getElementById('tool-sim-progress');
          if (prog) {
            prog.style.width = ((stepIdx + 0.35) / toolSimSteps.length * 100) + '%';
          }
          logIdx = 0;
          nextLogInStep();
        }

        function nextLogInStep() {
          if (stepIdx >= toolSimSteps.length) {
            finishToolSim();
            return;
          }
          var step = toolSimSteps[stepIdx];
          if (logIdx >= step.logs.length) {
            stepIdx++;
            toolSimTimer = linkinlDelay(280, runStep);
            return;
          }
          var entry = step.logs[logIdx];
          appendToolLogLine(entry);
          logIdx++;
          var delay = entry.delay != null ? entry.delay : 380;
          toolSimTimer = linkinlDelay(delay, nextLogInStep);
        }

        runStep();
      }

      function selectToolPath(id, autoLoop) {
        if (!TOOL_PATHS[id]) return;
        toolPath = id;
        document.querySelectorAll('#path-switch button').forEach(function (btn) {
          var on = btn.getAttribute('data-path') === id;
          btn.classList.toggle('on', on);
          btn.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        cancelLinkinlDelay(toolSimLoopTimer);
        runToolSim(autoLoop);
      }

      var toolRerun = document.getElementById('tool-sim-rerun');
      if (toolRerun) {
        toolRerun.addEventListener('click', function () {
          cancelLinkinlDelay(toolSimLoopTimer);
          runToolSim(false);
        });
      }
      document.querySelectorAll('#path-switch button').forEach(function (btn) {
        btn.addEventListener('click', function () {
          selectToolPath(btn.getAttribute('data-path'), false);
        });
      });
      renderToolRail();
      runToolSim(true);
      toolSimStarted = true;

      var L01_MAP_LANES = [
        {
          id: 'infer',
          label: '推理編排',
          hint: 'L04 管線',
          nodes: [
            { label: '意圖輸入', sub: 'POST /chat/stream' },
            { label: 'LangGraph', sub: 'build_graph()' },
            { label: 'LiteLLM', sub: 'call_llm 唯一入口' },
            { label: '推理端點', sub: 'Ollama · vLLM · API' }
          ],
          branch: { label: 'AI Hub', sub: '探針 · 熔斷 · 模型池' },
          captions: [
            '前端或 CLI 送出 SSE 請求，帶 <strong>execution_path</strong>（simple / company / minecraft_ops）。',
            '<strong>LangGraph</strong> 依路徑編排節點：檢索、工具、反思；checkpoint 序列化可重播狀態。',
            '<strong>LiteLLM</strong> 統一路由模型與金鑰；應用禁止繞過直接 import OpenAI SDK。',
            '推理可在本機 <strong>Ollama</strong>、叢集 <strong>vLLM/SGLang</strong> 或雲端 API——L01 整包可替換。',
            '分支：<strong>AI Hub</strong> 背景探針模型池，熔斷異常端點，避免整條鏈卡在壞路由。'
          ]
        },
        {
          id: 'runtime',
          label: '執行時 API',
          hint: 'FastAPI :8000',
          nodes: [
            { label: 'HTTP/SSE', sub: 'FastAPI routes' },
            { label: 'Uvicorn', sub: 'ASGI :8000' },
            { label: 'Pydantic', sub: 'schema · settings' },
            { label: 'pytest', sub: 'monkeypatch 隔離' }
          ],
          branch: { label: 'Redis · Chroma', sub: ':6379 · :8100' },
          captions: [
            '<strong>FastAPI</strong> 暴露 /chat/stream、任務與工具 API，是 L01 對外的 HTTP 邊界。',
            '<strong>Uvicorn</strong> 跑 async 事件迴圈，本機預設 0.0.0.0:8000。',
            '<strong>Pydantic v2</strong> 驗證請求/設定，與 docs/config/reference.md 對齊。',
            '<strong>pytest</strong> + monkeypatch 測試圖與工具，不連真 Redis/OPC。',
            '分支：<strong>redis-py</strong> 快取會話；<strong>Chroma</strong> 向量召回——docker compose 一鍵起。'
          ]
        },
        {
          id: 'frontend',
          label: '前端控制台',
          hint: 'Vite :3001',
          nodes: [
            { label: 'Vite 8', sub: 'npm run dev' },
            { label: 'React 19', sub: '#/chat · 三欄' },
            { label: 'Zustand', sub: 'session store' },
            { label: 'ECharts', sub: '監控 · Token' }
          ],
          branch: { label: 'xyflow · Monaco', sub: '圖 · 編輯器' },
          captions: [
            '<strong>Vite</strong> 提供 HMR 與 production build，開發埠 <strong>3001</strong>。',
            '<strong>React 19</strong> 渲染對話、靈境/Minecraft 模組；窄屏底部 Tab、寬屏三欄一屏。',
            '<strong>Zustand</strong> 輕量全域狀態，避免 Redux 式樣板。',
            '<strong>ECharts</strong> 畫 Hub/billing 圖表；<strong>react-markdown</strong> 渲染 Agent 產出。',
            '分支：<strong>@xyflow/react</strong> 策略圖；<strong>Monaco</strong> 編輯提示詞與 JSON。'
          ]
        },
        {
          id: 'edge',
          label: '工業 · MCP',
          hint: 'OPC :8001',
          nodes: [
            { label: 'Agent 工具', sub: 'opc.read / write' },
            { label: 'opc_service', sub: '微服務 :8001' },
            { label: 'asyncua', sub: 'OPC UA 協定' },
            { label: 'guard.py', sub: '寫入護欄 #4' }
          ],
          branch: { label: 'MineMCP', sub: ':3000 遊戲' },
          captions: [
            'LangGraph 節點以工具形式呼叫 OPC/MCP，不是硬編碼在 UI。',
            '<strong>opc_service</strong> 獨立進程，六階段 sense→act，與主 API 以 token 互信。',
            '<strong>asyncua</strong> 讀寫感測；模擬伺服器 OPC_SIM 可在 :4840 練習。',
            '<strong>guard.py</strong> 攔截危險寫入；正式/模擬由 runtime .env 切換。',
            '分支：<strong>MCP</strong> 註冊 Figma/Linear；<strong>MineMCP</strong> 對接 Minecraft 操作面。'
          ]
        },
        {
          id: 'recall',
          label: '召回 · 量化',
          hint: 'opt-in',
          nodes: [
            { label: '前置 RC', sub: 'Recall Chain' },
            { label: 'WeKnora 等', sub: '結構化檢索' },
            { label: 'Yahoo 行情', sub: 'quant 預設' },
            { label: 'Skills 106', sub: '.agents/skills' }
          ],
          branch: { label: 'MemOS · OpenViking', sub: '長期記憶' },
          captions: [
            '整合召回在圖的<strong>前置鏈</strong>才注入上下文，避免每輪都塞滿 token。',
            '<strong>WeKnora / OpenViking</strong> 等為可選適配器，README 標 opt-in。',
            '量化角色預設 <strong>Yahoo/Stooq</strong> 免 Key；Tushare/Finnhub 需 .env。',
            '<strong>106 skills</strong> 從 mattpocock/anthropic/openai 同步，供 Agent 選技能。',
            '分支：<strong>MemOS</strong> 長期記憶僅在明確召回時寫入，不偷偷 webhook。'
          ]
        }
      ];

      var l01MapLane = 'infer';
      var l01MapStep = 0;
      var l01MapTimer = null;
      var l01MapStarted = false;
      var l01MapExpanded = false;

      function getL01Lane(id) {
        for (var i = 0; i < L01_MAP_LANES.length; i++) {
          if (L01_MAP_LANES[i].id === id) return L01_MAP_LANES[i];
        }
        return L01_MAP_LANES[0];
      }

      function syncL01StackBlocks(laneId) {
        var wrap = document.getElementById('l01-stack-blocks');
        if (!wrap) return;
        wrap.classList.toggle('l01-filtered', !l01MapExpanded);
        wrap.querySelectorAll('[data-l01-lane]').forEach(function (block) {
          var match = block.getAttribute('data-l01-lane') === laneId;
          block.classList.toggle('l01-lane-visible', l01MapExpanded || match);
          block.classList.toggle('l01-lane-highlight', !l01MapExpanded && match);
        });
      }

      function updateL01ExpandControl() {
        var btn = document.getElementById('l01-map-expand');
        if (!btn) return;
        btn.setAttribute('aria-pressed', l01MapExpanded ? 'true' : 'false');
        btn.textContent = l01MapExpanded ? '只顯示目前分類' : '展開全部 tile';
      }

      function renderL01MapTabs() {
        var tabs = document.getElementById('l01-map-tabs');
        if (!tabs) return;
        tabs.innerHTML = '';
        L01_MAP_LANES.forEach(function (lane) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.setAttribute('role', 'tab');
          btn.setAttribute('data-l01-lane', lane.id);
          btn.setAttribute('aria-selected', lane.id === l01MapLane ? 'true' : 'false');
          btn.classList.toggle('on', lane.id === l01MapLane);
          btn.innerHTML = lane.label + '<small>' + lane.hint + '</small>';
          btn.addEventListener('click', function () {
            selectL01MapLane(lane.id, false);
          });
          tabs.appendChild(btn);
        });
      }

      function renderL01MapFlow(lane) {
        var flow = document.getElementById('l01-map-flow');
        var branchEl = document.getElementById('l01-map-branch');
        if (!flow || !lane) return;
        flow.innerHTML = '';
        lane.nodes.forEach(function (node, idx) {
          if (idx > 0) {
            var link = document.createElement('div');
            link.className = 'l01-map-link';
            link.setAttribute('data-l01-link', String(idx - 1));
            flow.appendChild(link);
          }
          var box = document.createElement('div');
          box.className = 'l01-map-node';
          box.setAttribute('data-l01-node', String(idx));
          box.innerHTML = '<span class="n-label">' + node.label + '</span><span class="n-sub">' + node.sub + '</span>';
          flow.appendChild(box);
        });
        if (branchEl) {
          if (lane.branch) {
            branchEl.hidden = false;
            branchEl.innerHTML = '';
            var branchNode = document.createElement('div');
            branchNode.className = 'l01-map-node';
            branchNode.setAttribute('data-l01-branch', '1');
            branchNode.innerHTML = '<span class="n-label">' + lane.branch.label + '</span><span class="n-sub">' + lane.branch.sub + '</span>';
            branchEl.appendChild(branchNode);
          } else {
            branchEl.hidden = true;
            branchEl.innerHTML = '';
          }
        }
      }

      function paintL01MapStep(lane, step) {
        var nodes = document.querySelectorAll('#l01-map-flow [data-l01-node]');
        var links = document.querySelectorAll('#l01-map-flow [data-l01-link]');
        var branch = document.querySelector('#l01-map-branch [data-l01-branch]');
        var branchStep = lane.nodes.length;
        var onBranch = step >= branchStep;
        nodes.forEach(function (el, idx) {
          if (onBranch) {
            el.classList.remove('active');
            el.classList.add('done');
            return;
          }
          el.classList.toggle('active', idx === step);
          el.classList.toggle('done', idx < step);
        });
        links.forEach(function (el, idx) {
          if (onBranch) {
            el.classList.remove('active');
            return;
          }
          el.classList.toggle('active', idx === step - 1 && step > 0);
        });
        if (branch) {
          branch.classList.toggle('active', onBranch);
          branch.classList.toggle('done', false);
        }
        var cap = document.getElementById('l01-map-caption');
        if (cap && lane.captions[step]) cap.innerHTML = lane.captions[step];
        var stepEl = document.getElementById('l01-map-step');
        if (stepEl) {
          if (onBranch && lane.branch) {
            stepEl.textContent = '分支 · ' + lane.branch.label;
          } else {
            stepEl.textContent = 'step ' + (step + 1) + '/' + lane.nodes.length;
          }
        }
      }

      function runL01MapAnim(autoLoop) {
        var lane = getL01Lane(l01MapLane);
        var bar = document.getElementById('l01-map-bar');
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          if (bar) bar.classList.add('idle');
          paintL01MapStep(lane, lane.nodes.length - 1);
          var cap = document.getElementById('l01-map-caption');
          if (cap) cap.innerHTML = lane.captions[lane.captions.length - 1];
          return;
        }
        if (bar) bar.classList.remove('idle');
        cancelLinkinlDelay(l01MapTimer);
        paintL01MapStep(lane, l01MapStep);
        l01MapTimer = linkinlDelay(l01MapStep >= lane.nodes.length ? 2200 : 2400, function () {
          l01MapStep++;
          if (l01MapStep >= lane.captions.length) {
            l01MapStep = 0;
            if (autoLoop !== false) {
              runL01MapAnim(true);
            } else if (bar) {
              bar.classList.add('idle');
            }
            return;
          }
          runL01MapAnim(autoLoop);
        });
      }

      function selectL01MapLane(id, autoLoop) {
        l01MapLane = id;
        l01MapStep = 0;
        var lane = getL01Lane(id);
        renderL01MapTabs();
        renderL01MapFlow(lane);
        syncL01StackBlocks(id);
        runL01MapAnim(autoLoop);
      }

      function startL01MapSim() {
        if (l01MapStarted) return;
        l01MapStarted = true;
        renderL01MapTabs();
        updateL01ExpandControl();
        selectL01MapLane('infer', true);
      }

      var l01ExpandBtn = document.getElementById('l01-map-expand');
      if (l01ExpandBtn) {
        l01ExpandBtn.addEventListener('click', function () {
          l01MapExpanded = !l01MapExpanded;
          updateL01ExpandControl();
          syncL01StackBlocks(l01MapLane);
        });
      }

      if (document.getElementById('l01-map-sim')) {
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.create({
            trigger: '#l01-map-sim',
            start: 'top 88%',
            once: true,
            onEnter: startL01MapSim
          });
          if (document.getElementById('l01-map-sim').getBoundingClientRect().top < window.innerHeight * 0.88) {
            startL01MapSim();
          }
        } else {
          startL01MapSim();
        }
      }

      (function initLayerStackSim() {
        var root = document.getElementById('layer-stack-sim');
        if (!root) return;

        var LSS_COLORS = { l04: '#9d8bff', l03: '#ffb347', l02: '#2dd4bf', l01: '#4ade80' };
        var LSS_ROUND_MS = 8200;
        var stack = document.getElementById('lss-stack');
        var packet = document.getElementById('lss-packet');
        var logBody = document.getElementById('lss-log');
        var progress = document.getElementById('lss-progress');
        var replayBtn = document.getElementById('lss-replay');
        if (!stack || !packet || !logBody || !progress) return;

        var layers = {
          l04: stack.querySelector('[data-l="l04"]'),
          l03: stack.querySelector('[data-l="l03"]'),
          l02: stack.querySelector('[data-l="l02"]'),
          l01: stack.querySelector('[data-l="l01"]')
        };
        var timers = [];
        var roundStart = 0;
        var looping = false;
        var started = false;

        function schedule(fn, delay) {
          timers.push(linkinlDelay(delay, fn));
        }
        function clearAllTimers() {
          timers.forEach(cancelLinkinlDelay);
          timers = [];
        }
        function layerCenterY(el) {
          var sr = stack.getBoundingClientRect();
          var lr = el.getBoundingClientRect();
          return lr.top - sr.top + lr.height / 2;
        }
        function movePacketTo(id) {
          packet.dataset.at = id;
          var y = layerCenterY(layers[id]);
          packet.style.color = LSS_COLORS[id];
          packet.style.transform = 'translate(0, ' + y + 'px) translateY(-50%)';
        }
        function activate(id) {
          var el = layers[id];
          el.classList.add('active');
          schedule(function () { el.classList.remove('active'); }, 1250);
        }
        function appendLog(msg, type) {
          var sec = ((performance.now() - roundStart) / 1000).toFixed(1);
          while (sec.length < 4) sec = ' ' + sec;
          var line = document.createElement('div');
          line.className = 'lss-log-line ' + (type || '');
          line.innerHTML = '<span class="lt">' + sec + 's</span><span class="msg"></span>';
          line.querySelector('.msg').textContent = msg;
          logBody.appendChild(line);
          logBody.scrollTop = logBody.scrollHeight;
        }
        function gateScan() {
          var chips = layers.l03.querySelectorAll('.lss-chip');
          var i = 0;
          chips.forEach(function (chip) {
            if (chip.classList.contains('stop')) return;
            var idx = i++;
            schedule(function () { chip.classList.add('ok'); }, 120 * idx);
          });
          schedule(function () {
            var stop = layers.l03.querySelector('.lss-chip.stop');
            if (stop) {
              stop.classList.add('lock');
              schedule(function () { stop.classList.remove('lock'); }, 700);
            }
          }, 620);
        }
        function resetVisuals() {
          clearAllTimers();
          logBody.innerHTML = '';
          Object.keys(layers).forEach(function (k) { layers[k].classList.remove('active'); });
          root.querySelectorAll('.lss-chip.ok, .lss-chip.stop.lock').forEach(function (c) {
            c.classList.remove('ok', 'lock');
          });
          packet.style.transition = 'none';
          packet.style.opacity = '0';
          packet.style.transform = 'translate(0, -30px) translateY(-50%)';
          void packet.offsetHeight;
          packet.style.transition = '';
          progress.style.transition = 'none';
          progress.style.width = '0%';
        }
        function runReducedStatic() {
          resetVisuals();
          Object.keys(layers).forEach(function (k) { layers[k].classList.add('active'); });
          appendLog('▶ run 示意 · L04→L03→L02→L01（減少動態效果）', 'dim');
          appendLog('L04 路由 · L03 閘門 · L02 封存 · L01 OSS 落地', 'ok');
          progress.style.width = '100%';
        }
        function runRound() {
          if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            runReducedStatic();
            return;
          }
          resetVisuals();
          roundStart = performance.now();
          requestAnimationFrame(function () {
            progress.style.transition = 'width ' + LSS_ROUND_MS + 'ms linear';
            progress.style.width = '100%';
          });
          schedule(function () {
            packet.style.opacity = '1';
            movePacketTo('l04');
            activate('l04');
            appendLog('▶ run 開始 · 收到請求 → 進入 L04', 'dim');
          }, 120);
          schedule(function () { appendLog('L04 · 路由 simple → call_llm · LangGraph 編排中', 'exec'); }, 420);
          schedule(function () { movePacketTo('l03'); }, 1350);
          schedule(function () {
            activate('l03');
            appendLog('L03 · 進入預算閘門，逐項檢查配額…', 'ctrl');
            gateScan();
          }, 1600);
          schedule(function () { appendLog('  ├ token   3.2k / 128k   ✓', 'ctrl'); }, 1760);
          schedule(function () { appendLog('  ├ GPU     12m  / 4h     ✓', 'ctrl'); }, 1900);
          schedule(function () { appendLog('  ├ cost    $0.04 / $12.00 ✓', 'ctrl'); }, 2040);
          schedule(function () { appendLog('  └ rate    8    / 60rpm  ✓', 'ctrl'); }, 2180);
          schedule(function () { appendLog('L03 · 閘門放行（未觸發 hard stop）', 'ok'); }, 2450);
          schedule(function () { movePacketTo('l02'); }, 2950);
          schedule(function () {
            activate('l02');
            appendLog('L02 · 結果封存上鏈…', 'ledger');
          }, 3200);
          schedule(function () { appendLog('  ├ IPFS CID  bafybeig…7q2x', 'ledger'); }, 3420);
          schedule(function () { appendLog('  ├ hash      sha256(prev ∥ payload)', 'ledger'); }, 3580);
          schedule(function () { appendLog('  ├ sign      ed25519 ✓', 'ledger'); }, 3740);
          schedule(function () { appendLog('  └ audit     append-only · 可回放', 'ledger'); }, 3900);
          schedule(function () { movePacketTo('l01'); }, 4400);
          schedule(function () {
            activate('l01');
            appendLog('L01 · OSS 組件執行中…', 'exec');
          }, 4650);
          schedule(function () { appendLog('  vLLM 推理 → FlashAttn 注意力 → Ray 分散式', 'exec'); }, 4880);
          schedule(function () { appendLog('  Chroma 向量檢索 → Redis 快取 → FastAPI 回傳', 'exec'); }, 5060);
          schedule(function () {
            appendLog('✓ 完成 · trace id 0x7f3a… · 可回放審計', 'ok');
            appendLog('──────── 等待下一次請求 ────────', 'dim');
          }, 5700);
          schedule(function () {
            if (looping) runRound();
          }, LSS_ROUND_MS);
        }
        function startSim() {
          if (started) return;
          started = true;
          looping = true;
          runRound();
        }
        if (replayBtn) {
          replayBtn.addEventListener('click', function () {
            looping = true;
            runRound();
          });
        }
        var rzTimer = null;
        window.addEventListener('resize', function () {
          clearTimeout(rzTimer);
          rzTimer = setTimeout(function () {
            var cur = packet.dataset.at;
            if (cur && layers[cur]) movePacketTo(cur);
          }, 150);
        });
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.create({
            trigger: '#layer-stack-sim',
            start: 'top 90%',
            once: true,
            onEnter: startSim
          });
          if (root.getBoundingClientRect().top < window.innerHeight * 0.9) startSim();
        } else {
          startSim();
        }
      })();

      var meters = { token: 65.9, gpu: 60, cost: 70.2, rate: 63.3 };
      function animateMeters() {
        Object.keys(meters).forEach(function (k) {
          var el = document.querySelector('[data-meter="' + k + '"]');
          if (el) el.style.width = meters[k] + '%';
        });
      }
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
          trigger: '#x03-budget',
          start: 'top 75%',
          once: true,
          onEnter: animateMeters
        });
      } else {
        animateMeters();
      }

      var ctx = document.getElementById('evidence-chart');
      if (ctx && typeof Chart !== 'undefined') {
        Chart.defaults.color = '#8b8b96';
        Chart.defaults.borderColor = '#1a1b1f';
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['週一', '週二', '週三', '週四', '週五', '週六', '週日'],
            datasets: [
              {
                label: 'p95 延遲 (ms)',
                data: [820, 760, 710, 680, 640, 590, 560],
                borderColor: '#c6ff3d',
                backgroundColor: 'rgba(198, 255, 61, 0.08)',
                tension: 0.35,
                fill: true
              },
              {
                label: '成功率 (%)',
                data: [97.2, 97.8, 98.1, 98.4, 98.6, 99.0, 99.2],
                borderColor: '#7aa8d4',
                yAxisID: 'y1',
                tension: 0.35
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { font: { family: "'Noto Sans TC'" } } } },
            scales: {
              y: { beginAtZero: false, grid: { color: '#1a1b1f' } },
              y1: {
                position: 'right',
                min: 95,
                max: 100,
                grid: { drawOnChartArea: false }
              }
            }
          }
        });
      }

      var RAIL_SECTIONS = ['#x00-hero', '#x01-what', '#x03-tool-sim', '#x0c-install', '#x00c-ecosystem', '#x0a-faq'];
      var railNodes = document.querySelectorAll('.timeline-rail .rail-node');
      var navLinks = function () { return document.querySelectorAll('#site-nav a[data-nav-id]'); };

      function updateNavActive() {
        var y = window.scrollY + topbarOffset() + 24;
        var activeId = SITE_SECTIONS[0].id;
        SITE_SECTIONS.forEach(function (s) {
          var el = document.getElementById(s.id);
          if (el && el.offsetTop <= y) activeId = s.id;
        });
        navLinks().forEach(function (a) {
          a.classList.toggle('on', a.getAttribute('data-nav-id') === activeId);
        });
        var railIdx = -1;
        RAIL_SECTIONS.forEach(function (sel, i) {
          var el = document.querySelector(sel);
          if (el && el.offsetTop <= y) railIdx = i;
        });
        railNodes.forEach(function (n, i) {
          n.classList.toggle('active', railIdx >= 0 && i === railIdx);
        });
      }
      window.addEventListener('scroll', updateNavActive, { passive: true });
      updateNavActive();
    })();
  