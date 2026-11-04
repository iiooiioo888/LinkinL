#!/usr/bin/env bash
# LinkinL — pull Linkin master (or manifest branch) and optionally refresh frontend deps.
set -euo pipefail

RUN_NPM=0

usage() {
  cat <<'EOF'
用法: scripts/update.sh [選項]

依 linkinl.json 更新 Linkin 主倉，並顯示 commit 差異。

選項:
  -n, --npm            更新後在 frontend/ 執行 npm install
  -h, --help           顯示說明

環境變數:
  LINKIN_UPDATE_NPM=1  等同 --npm
EOF
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LINKINL_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
MANIFEST="${LINKINL_ROOT}/linkinl.json"

while [[ $# -gt 0 ]]; do
  case "$1" in
    -n|--npm)
      RUN_NPM=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "未知參數: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [[ "${LINKIN_UPDATE_NPM:-0}" == "1" ]]; then
  RUN_NPM=1
fi

ok() { echo "[linkinl] $*"; }
fail() { echo "[linkinl] 錯誤: $*" >&2; exit 1; }

if [[ ! -f "$MANIFEST" ]]; then
  fail "找不到 ${MANIFEST}，請先執行 scripts/install.sh"
fi

read_manifest_field() {
  local key="$1"
  python3 - "$MANIFEST" "$key" <<'PY'
import json, sys
path, key = sys.argv[1], sys.argv[2]
with open(path, encoding="utf-8") as f:
    data = json.load(f)
print(data.get(key, ""))
PY
}

LINKIN_DIR="$(read_manifest_field linkin_dir)"
LINKIN_BRANCH="$(read_manifest_field linkin_branch)"
OLD_COMMIT="$(read_manifest_field linkin_commit)"

[[ -n "$LINKIN_DIR" ]] || fail "manifest 缺少 linkin_dir"
[[ -n "$LINKIN_BRANCH" ]] || LINKIN_BRANCH="master"

if [[ ! -d "${LINKIN_DIR}/.git" ]]; then
  fail "Linkin 目錄不存在或不是 git 倉: ${LINKIN_DIR}"
fi

ok "fetch origin/${LINKIN_BRANCH} …"
git -C "${LINKIN_DIR}" fetch origin "${LINKIN_BRANCH}"

ok "pull …"
git -C "${LINKIN_DIR}" checkout "${LINKIN_BRANCH}" --quiet
git -C "${LINKIN_DIR}" pull --ff-only origin "${LINKIN_BRANCH}"

NEW_COMMIT="$(git -C "${LINKIN_DIR}" rev-parse HEAD)"

if [[ "$RUN_NPM" -eq 1 ]]; then
  if [[ -d "${LINKIN_DIR}/frontend" ]] && command -v npm >/dev/null 2>&1; then
    ok "npm install（frontend）…"
    (cd "${LINKIN_DIR}/frontend" && npm install)
  else
    ok "略過 npm install（無 frontend 或未安裝 npm）。"
  fi
fi

UPDATED_AT="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
python3 - "$MANIFEST" "$NEW_COMMIT" "$UPDATED_AT" <<'PY'
import json, sys
path, commit, updated = sys.argv[1], sys.argv[2], sys.argv[3]
with open(path, encoding="utf-8") as f:
    data = json.load(f)
data["linkin_commit"] = commit
data["updated_at"] = updated
with open(path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
    f.write("\n")
PY

ok "版本變更:"
if [[ "$OLD_COMMIT" == "$NEW_COMMIT" ]]; then
  ok "  已是最新: ${NEW_COMMIT:0:12}（無新 commit）"
else
  ok "  舊: ${OLD_COMMIT:0:12}"
  ok "  新: ${NEW_COMMIT:0:12}"
  if git -C "${LINKIN_DIR}" merge-base --is-ancestor "${OLD_COMMIT}" "${NEW_COMMIT}" 2>/dev/null; then
    local_count="$(git -C "${LINKIN_DIR}" rev-list --count "${OLD_COMMIT}..${NEW_COMMIT}" 2>/dev/null || echo "?")"
    ok "  領先 ${local_count} 個 commit"
  else
    ok "  （非快轉 ancestry，請自行檢查 log）"
  fi
  echo ""
  git -C "${LINKIN_DIR}" log --oneline "${OLD_COMMIT}..${NEW_COMMIT}" 2>/dev/null | head -n 15 || true
fi
