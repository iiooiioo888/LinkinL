# LinkinL

**LinkinL** 是 [靈境·Linkin](https://github.com/iiooiioo888/Linkin) 的**本地執行版**產品代號：官網在此倉，**運行時請 clone 主倉**。

## 官網

- GitHub Pages：<https://iiooiioo888.github.io/LinkinL/>
- 設計參考：`index.html`（四層執行架構 + 完整行銷敘事）

## 本機執行（Linkin 主倉）

```bash
git clone https://github.com/iiooiioo888/Linkin.git
cd Linkin
cp .env.example .env   # 填入 API 金鑰
docker compose up -d redis chroma
python -m backend.main
# 另開終端：cd frontend && npm install && npm run dev
# → http://localhost:3001
```

詳見 [docs/getting-started.md](docs/getting-started.md)。

## 文件

- [docs/README.md](docs/README.md)
- [四層架構](docs/four-layers.md)

## License

MIT — 見 [LICENSE](LICENSE)。
