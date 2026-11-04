# LinkinL

**LinkinL** 是 [靈境·Linkin](https://github.com/iiooiioo888/Linkin) 的**本機執行版產品代號**與官網倉庫。此 repo 只包含行銷頁與繁中文件；**執行、部署與開發請 clone Linkin 主倉**。

## 官網（GitHub Pages）

| 項目 | 連結 |
|------|------|
| 產品首頁 | **https://iiooiioo888.github.io/LinkinL/** |
| 本機安裝 | [docs/getting-started.md](docs/getting-started.md) |
| 四層架構 | [docs/four-layers.md](docs/four-layers.md) |

> 若 Pages 尚未部署，請至 **Settings → Pages → Build and deployment → Source: GitHub Actions**，並確認 `main` 上的 `Deploy to GitHub Pages` workflow 已成功。

## 執行 Linkin（主倉）

```bash
git clone https://github.com/iiooiioo888/Linkin.git
cd Linkin
cp .env.example .env   # 填入 API 金鑰
docker compose up -d redis chroma
python -m backend.main
# 另開終端：cd frontend && npm install && npm run dev → http://localhost:3001
```

完整步驟見 [docs/getting-started.md](docs/getting-started.md) 或 Linkin 主倉 [README](https://github.com/iiooiioo888/Linkin#%E5%BF%AB%E9%80%9F%E9%96%8B%E5%A7%8B)。

| 用途 | 倉庫 |
|------|------|
| 運行時、API、前端 | [iiooiioo888/Linkin](https://github.com/iiooiioo888/Linkin) |
| 官網與 LinkinL 文件 | **本倉庫** |

## 文件

索引：[docs/README.md](docs/README.md)

## 授權

[MIT](LICENSE) — 與 Linkin 主倉相同作者。
