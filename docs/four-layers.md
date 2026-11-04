# 四層執行架構（L04 → L01）

LinkinL 將多 Agent 編排敘事為**由上而下**四層堆疊；頁面左側 72px rail 與產品區 SVG 皆為 **L04 → L03 → L02 → L01** 順序。

## 總覽

| 層級 | 名稱 | 職責 |
|------|------|------|
| **L04** | AI 執行層 | LangGraph 管線、本機 Agent 執行與反思閉環；意圖解析 → 檢索 → 工具 → KV → 預算 → 封存 → 輸出 |
| **L03** | 預算層 | 本機資源與 spend 閘門；token / GPU / 成本 metering，超限即停 |
| **L02** | 共識層 | append-only 產出物帳本（CID + hash chain），可稽核、可重播 |
| **L01** | 組件層 | 可替換 OSS 栈：vLLM、SGLang、FlashAttention、LangGraph、Ray、TGI、Chroma、LiteLLM、Redis 等 |

## Hero 執行 DAG（L04 語意）

一次 Agent run 的節點順序：

1. 意圖解析  
2. 檢索  
3. 工具呼叫  
4. KV 快取  
5. 預算檢查  
6. 產出物封存  
7. 輸出  

官網 trace-stage 上的 **RE-RUN** 會依序點亮 DAG 節點與邊，示範可重播軌跡。

## 頁面區塊對照（0x00–0x0A）

| 錨點 | 內容 |
|------|------|
| Header / Hero | 頂欄、DAG、RE-RUN |
| Pain | 三欄痛點 |
| Product | 四層堆疊圖 + 規格欄 |
| Engine | 預算 meter（L03）· 共識帳本（L02） |
| Evidence | 延遲／成功率圖表 |
| Integrations | L01 OSS 整合磚 |
| Compare / Trust / Voices / Pricing / FAQ | 能力對照、護欄、引述、定價敘事、終端快速開始 |

## 視覺系統（官網 HTML）

- 畫布 `#07080A`、accent `#C6FF3D`
- **0px** 圓角、**1px** hairline 邊框
- 字型：**Noto Sans TC** + JetBrains Mono

## 互動

- Lenis 平滑捲動 + 錨點
- GSAP ScrollTrigger section reveal、預算 meter 進場
- Chart.js 實證圖表

## 深入閱讀

- 互動首頁：<https://iiooiioo888.github.io/LinkinL/>
- 設計 HTML 深連結：[design/linkinl-four-layers.html](design/linkinl-four-layers.html)
- Linkin 主倉架構：[docs/architecture/overview.md](https://github.com/iiooiioo888/Linkin/blob/master/docs/architecture/overview.md)
