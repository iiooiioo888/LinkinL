# 本機執行 Linkin

LinkinL 官網說明**產品與架構**；實際運行時請使用 [Linkin 主倉](https://github.com/iiooiioo888/Linkin)。

## 1. Clone 主倉

```bash
git clone https://github.com/iiooiioo888/Linkin.git
cd Linkin
```

## 2. 環境需求

| 工具 | 版本 |
|------|------|
| Python | **3.12+** |
| Node.js | **20+** |
| Docker | 可選（Redis、Chroma 或整棧） |

## 3. 方式 A — Docker Compose

| 情境 | 指令 |
|------|------|
| 全棧 | `docker compose up -d` |
| 只起 Redis 與 Chroma | `docker compose up -d redis chroma` |

詳見主倉 [docs/deployment/guide.md](https://github.com/iiooiioo888/Linkin/blob/master/docs/deployment/guide.md) 與 [DEPLOYMENT.md](https://github.com/iiooiioo888/Linkin/blob/master/DEPLOYMENT.md)。

## 4. 方式 B — 本機 Python + 前端

```bash
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\Activate.ps1
pip install -r requirements.txt

cp .env.example .env
# 填入 API 金鑰

# 後端 http://localhost:8000
python -m backend.main

# 另開終端：前端 http://localhost:3001
cd frontend && npm install && npm run dev
```

可選：先起依賴再跑後端（與官網 terminal 區塊一致）：

```bash
docker compose up -d redis chroma
python -m backend.main
```

## 5. 埠號速查

| 服務 | 埠 |
|------|-----|
| 前端（Vite） | **3001** |
| 後端 API | **8000** |
| OPC | 8001 |
| Redis | 6379 |
| Chroma | 8100 |

## 6. 下一步（主倉文件）

| 你要做的事 | 打開 |
|------------|------|
| 第一次進倉 | [docs/onboarding.md](https://github.com/iiooiioo888/Linkin/blob/master/docs/onboarding.md) |
| 改程式 | [docs/development/guide.md](https://github.com/iiooiioo888/Linkin/blob/master/docs/development/guide.md) |
| API / 環境變數 | [docs/api/reference.md](https://github.com/iiooiioo888/Linkin/blob/master/docs/api/reference.md) · [docs/config/reference.md](https://github.com/iiooiioo888/Linkin/blob/master/docs/config/reference.md) |
| 常見問題 | [docs/faq.md](https://github.com/iiooiioo888/Linkin/blob/master/docs/faq.md) |

## 7. LinkinL 與 Linkin

- **LinkinL**（本 repo）：GitHub Pages 官網、四層敘事、getting-started 捷徑。
- **Linkin**（主倉）：LangGraph 管線、控制台、部署與全部運行時程式碼。

架構摘要：[four-layers.md](four-layers.md)
