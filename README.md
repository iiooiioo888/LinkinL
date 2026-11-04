# LinkinL

**LinkinL** 是 [靈境·Linkin](https://github.com/iiooiioo888/Linkin) 的**本機執行版產品代號**與官網倉庫。此 repo 包含行銷頁、繁中文件，以及**一鍵 clone / 更新 Linkin 主倉**的腳本；**執行與部署仍發生在 Linkin 工作目錄**（預設 `./linkin-runtime`），不會把主倉程式碼複製進 LinkinL。

## 官網（GitHub Pages）

| 項目 | 連結 |
|------|------|
| 產品首頁 | **https://iiooiioo888.github.io/LinkinL/** |
| 本機安裝 | [docs/getting-started.md](docs/getting-started.md) |
| 四層架構 | [docs/four-layers.md](docs/four-layers.md) |

> 若 Pages 尚未部署，請至 **Settings → Pages → Build and deployment → Source: GitHub Actions**，並確認 `main` 上的 `Deploy to GitHub Pages` workflow 已成功。

## 快速開始（LinkinL 腳本）

在 **macOS / Linux**（或 Windows **WSL2**）clone 本倉後：

```bash
git clone https://github.com/iiooiioo888/LinkinL.git
cd LinkinL
chmod +x scripts/install.sh scripts/update.sh

# 預設將 Linkin clone 到 ./linkin-runtime，並寫入 linkinl.json
./scripts/install.sh

# 可選：指定目錄或淺 clone
# LINKIN_DIR=~/Linkin ./scripts/install.sh --shallow

cp .env.linkinl.example .env.linkinl   # 調整 LINKIN_ROOT 等路徑
cd linkin-runtime && cp .env.example .env   # 在 Linkin 主倉填入 API 金鑰
```

更新 Linkin 至 `master` 最新 commit：

```bash
./scripts/update.sh          # 只 git pull
./scripts/update.sh --npm    # pull 後順便 frontend npm install
```

接著依 [docs/getting-started.md](docs/getting-started.md) 啟動 Docker / 後端 / 前端。完整部署說明見 Linkin 主倉 [DEPLOYMENT.md](https://github.com/iiooiioo888/Linkin/blob/master/DEPLOYMENT.md) 與 [docs/deployment/guide.md](https://github.com/iiooiioo888/Linkin/blob/master/docs/deployment/guide.md)。

### 手動 clone（不用腳本）

```bash
git clone https://github.com/iiooiioo888/Linkin.git
cd Linkin
cp .env.example .env
docker compose up -d redis chroma
python -m backend.main
# 另開終端：cd frontend && npm install && npm run dev → http://localhost:3001
```

## 倉庫分工

| 用途 | 倉庫 |
|------|------|
| 運行時、API、前端 | [iiooiioo888/Linkin](https://github.com/iiooiioo888/Linkin)（分支 `master`） |
| 官網、LinkinL 文件、install/update 腳本 | **本倉庫** |

## 文件

索引：[docs/README.md](docs/README.md)

## 授權

[MIT](LICENSE) — 與 Linkin 主倉相同作者。
