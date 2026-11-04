# 本機執行 Linkin

LinkinL 官網（[iiooiioo888.github.io/LinkinL](https://iiooiioo888.github.io/LinkinL/)）說明**產品與架構**；實際運行時使用 [Linkin 主倉](https://github.com/iiooiioo888/Linkin)（`master`）。本頁說明如何用 **LinkinL 腳本**安裝與更新，以及啟動服務。

> **首頁錨點：** 互動版摘要已合入首頁 [`#x0c-install`](../index.html#x0c-install)（安裝）、[`#x0b-layers`](../index.html#x0b-layers)（四層）、[`#x0a-faq`](../index.html#x0a-faq)（FAQ）。舊 `#hero` 等連結會自動轉到 `xNN-slug`。

## 平台

| 環境 | 建議 |
|------|------|
| macOS | 原生 bash，直接執行下方腳本 |
| Linux | 同上 |
| Windows | 請使用 **WSL2**（Ubuntu 等）clone LinkinL 與 Linkin；PowerShell 未正式支援 `install.sh` |

## 0. Clone LinkinL（官網倉）

```bash
git clone https://github.com/iiooiioo888/LinkinL.git
cd LinkinL
chmod +x scripts/install.sh scripts/update.sh
```

## 1. 安裝 Linkin 主倉（`install.sh`）

腳本會：

- 將 Linkin clone 到可設定目錄（**預設** `<LinkinL>/linkin-runtime`；亦可用 `LINKIN_DIR=~/Linkin`）
- 可選 `--shallow` 淺 clone
- 檢查 **git、Python 3.12+、Node 20+、Docker**（後者為提示，非強制）
- 在 LinkinL 根目錄寫入 **`linkinl.json`**（紀錄 branch、commit、安裝時間）

```bash
./scripts/install.sh

# 範例：家目錄 + 淺 clone
LINKIN_DIR=~/Linkin ./scripts/install.sh --shallow

# 僅檢查工具（CI / 無網路時不 clone）
./scripts/install.sh --check-only
```

複製 LinkinL 編排用環境範本（路徑、埠號，**不含 API 金鑰**）：

```bash
cp .env.linkinl.example .env.linkinl
```

在 **Linkin 工作目錄**建立真正的執行設定：

```bash
cd linkin-runtime   # 或你的 LINKIN_DIR
cp .env.example .env
# 填入 OPENAI_API_KEY、LINKIN_GATE_*、REDIS_PASSWORD 等（見主倉 .env.example）
```

## 2. 更新 Linkin（`update.sh`）

```bash
cd /path/to/LinkinL
./scripts/update.sh           # 依 linkinl.json fetch + pull master
./scripts/update.sh --npm     # 另在 frontend/ 執行 npm install
```

終端會印出 **commit 差異**（舊 SHA → 新 SHA）與最近變更 log。

## 3. 環境需求

| 工具 | 版本 |
|------|------|
| Python | **3.12+** |
| Node.js | **20+** |
| Docker | 可選（Redis、Chroma 或整棧） |
| git | 任意近期版本 |

## 4. 方式 A — Docker Compose

在 Linkin 目錄（例如 `linkin-runtime`）：

| 情境 | 指令 |
|------|------|
| 全棧 | `docker compose up -d` |
| 只起 Redis 與 Chroma | `docker compose up -d redis chroma` |

詳見主倉 [docs/deployment/guide.md](https://github.com/iiooiioo888/Linkin/blob/master/docs/deployment/guide.md) 與 [DEPLOYMENT.md](https://github.com/iiooiioo888/Linkin/blob/master/DEPLOYMENT.md)。

## 5. 方式 B — 本機 Python + 前端

```bash
cd linkin-runtime
python3 -m venv .venv
source .venv/bin/activate   # Windows WSL: 同上；原生 Windows 請用 WSL
pip install -r requirements.txt

# .env 已於上一節建立

# 後端 http://localhost:8000
python -m backend.main

# 另開終端：前端 http://localhost:3001
cd frontend && npm install && npm run dev
```

可選：先起依賴再跑後端：

```bash
docker compose up -d redis chroma
python -m backend.main
```

## 6. 埠號速查

| 服務 | 埠 |
|------|-----|
| 前端（Vite） | **3001** |
| 後端 API | **8000** |
| OPC | 8001 |
| Redis | 6379 |
| Chroma | 8100 |

`.env.linkinl.example` 內有 `OPC_SIM_*` 等開發用註解，對照 Linkin 主倉設定即可。

## 7. 下一步（主倉文件）

| 你要做的事 | 打開 |
|------------|------|
| 第一次進倉 | [docs/onboarding.md](https://github.com/iiooiioo888/Linkin/blob/master/docs/onboarding.md) |
| 改程式 | [docs/development/guide.md](https://github.com/iiooiioo888/Linkin/blob/master/docs/development/guide.md) |
| API / 環境變數 | [docs/api/reference.md](https://github.com/iiooiioo888/Linkin/blob/master/docs/api/reference.md) · [docs/config/reference.md](https://github.com/iiooiioo888/Linkin/blob/master/docs/config/reference.md) |
| 常見問題 | [docs/faq.md](https://github.com/iiooiioo888/Linkin/blob/master/docs/faq.md) |

## 8. LinkinL 與 Linkin

- **LinkinL**（本 repo）：GitHub Pages 官網、四層敘事、**install/update 腳本**、`linkinl.json` manifest。
- **Linkin**（主倉）：LangGraph 管線、控制台、部署與全部運行時程式碼。

架構摘要：[four-layers.md](four-layers.md) · 首頁 [#x0b-layers](https://iiooiioo888.github.io/LinkinL/#x0b-layers)
