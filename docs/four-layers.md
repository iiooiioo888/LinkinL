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

## 頁面區塊對照（首頁錨點 xNN-slug）

| 錨點 | 內容 |
|------|------|
| `#x00-hero` | 頂欄、DAG、RE-RUN |
| `#x01-pain` | 三欄痛點 |
| `#x02-product` | 四層堆疊圖 + 規格欄 |
| `#x03-engine` / `#x03-budget` / `#x03-consensus` | 引擎 · L03 meter · L02 帳本 |
| `#x03-tool-sim` | 工具鏈模擬動畫 |
| `#x04-evidence` | 延遲／成功率圖表 |
| `#x05-integrations` / `#x05-ui-atlas` | L01 OSS · HTML 組件圖鑑 |
| `#x06-compare` … `#x09-pricing` | 對照、信任、聲音、定價 |
| `#x0b-layers` | 四層詳解（本子頁摘要合入首頁） |
| `#x0c-install` | 本機安裝（getting-started 摘要） |
| `#x0a-faq` | FAQ + terminal |

舊錨點（如 `#hero`）會自動轉址至上表。

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
- 設計深連結（轉址至首頁）：[design/linkinl-four-layers.html](design/linkinl-four-layers.html)
- Linkin 主倉架構：[docs/architecture/overview.md](https://github.com/iiooiioo888/Linkin/blob/master/docs/architecture/overview.md)
