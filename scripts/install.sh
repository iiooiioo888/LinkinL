#!/usr/bin/env bash
# LinkinL — clone Linkin runtime and write linkinl.json manifest.
set -euo pipefail

LINKIN_REPO="${LINKIN_REPO:-https://github.com/iiooiioo888/Linkin.git}"
LINKIN_BRANCH="${LINKIN_BRANCH:-master}"
SHALLOW=0
CHECK_ONLY=0

usage() {
  cat <<'EOF'
用法: scripts/install.sh [選項]

將 Linkin 主倉 clone 到本機，檢查 git / Python / Node / Docker 提示，並寫入 linkinl.json。

選項:
  -d, --dir PATH       Linkin 工作目錄（預設: <LinkinL 根>/linkin-runtime）
  -s, --shallow        淺 clone（--depth 1）
  -c, --check-only     只檢查工具與既有 manifest，不 clone
  -h, --help           顯示說明

環境變數:
  LINKIN_DIR           同 --dir
  LINKIN_REPO          遠端 URL（預設官方 Linkin）
  LINKIN_BRANCH        分支（預設 master）
  LINKIN_SHALLOW=1     等同 --shallow

範例:
  ./scripts/install.sh
  LINKIN_DIR=~/Linkin ./scripts/install.sh --shallow
EOF
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LINKINL_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
MANIFEST="${LINKINL_ROOT}/linkinl.json"
DEFAULT_LINKIN_DIR="${LINKINL_ROOT}/linkin-runtime"
LINKIN_DIR="${LINKIN_DIR:-${DEFAULT_LINKIN_DIR}}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    -d|--dir)
      LINKIN_DIR="$2"
      shift 2
      ;;
    -s|--shallow)
      SHALLOW=1
      shift
      ;;
    -c|--check-only)
      CHECK_ONLY=1
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

if [[ "${LINKIN_SHALLOW:-0}" == "1" ]]; then
  SHALLOW=1
fi

# Expand ~ and resolve to absolute path
if [[ "${LINKIN_DIR}" == "~"* ]]; then
  LINKIN_DIR="${HOME}${LINKIN_DIR#\~}"
fi
if [[ "${LINKIN_DIR}" != /* ]]; then
  LINKIN_DIR="${LINKINL_ROOT}/${LINKIN_DIR#./}"
fi
mkdir -p "$(dirname "${LINKIN_DIR}")"
LINKIN_DIR="$(cd "$(dirname "${LINKIN_DIR}")" && pwd)/$(basename "${LINKIN_DIR}")"

warn() { echo "[linkinl] 提示: $*" >&2; }
ok() { echo "[linkinl] $*"; }
fail() { echo "[linkinl] 錯誤: $*" >&2; exit 1; }

version_ge() {
  # version_ge MIN_VERSION ACTUAL_VERSION (numeric dotted)
  local min="$1" actual="$2"
  if [[ "$(printf '%s\n' "$min" "$actual" | sort -V | head -n1)" == "$min" ]]; then
    return 0
  fi
  return 1
}

check_prerequisites() {
  ok "檢查本機工具（對照 Linkin README：Python 3.12+、Node 20+、Docker 可選）…"

  if command -v git >/dev/null 2>&1; then
    ok "  git: $(git --version | head -n1)"
  else
    fail "未找到 git，請先安裝後再執行 install。"
  fi

  if command -v python3 >/dev/null 2>&1; then
    local pyver
    pyver="$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:3])))')"
    if version_ge "3.12.0" "$pyver"; then
      ok "  python3: $pyver"
    else
      warn "python3 為 $pyver，Linkin 建議 3.12+（可繼續 clone，執行時請升級）。"
    fi
  else
    warn "未找到 python3；clone 後請安裝 Python 3.12+ 再跑後端。"
  fi

  if command -v node >/dev/null 2>&1; then
    local nver
    nver="$(node -p "process.versions.node")"
    if version_ge "20.0.0" "$nver"; then
      ok "  node: v$nver"
    else
      warn "Node 為 v$nver，Linkin 建議 20+（前端開發請升級）。"
    fi
  else
    warn "未找到 node；clone 後請安裝 Node.js 20+ 再跑 frontend。"
  fi

  if command -v docker >/dev/null 2>&1; then
    ok "  docker: $(docker --version 2>/dev/null | head -n1 || echo '已安裝')"
    if docker compose version >/dev/null 2>&1; then
      ok "  docker compose: $(docker compose version 2>/dev/null | head -n1)"
    fi
  else
    warn "未找到 docker；可本機跑 Python，或安裝 Docker 後使用 docker compose up -d redis chroma。"
  fi
}

write_manifest() {
  local commit="$1"
  local installed_at
  installed_at="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  local tmp
  tmp="$(mktemp)"
  cat >"$tmp" <<EOF
{
  "schema": "linkinl-manifest/v1",
  "linkin_repository": "${LINKIN_REPO}",
  "linkin_branch": "${LINKIN_BRANCH}",
  "linkin_commit": "${commit}",
  "linkin_dir": "${LINKIN_DIR}",
  "installed_at": "${installed_at}",
  "updated_at": "${installed_at}"
}
EOF
  mv "$tmp" "$MANIFEST"
  ok "已寫入 manifest: ${MANIFEST}"
}

clone_or_verify_linkin() {
  if [[ -d "${LINKIN_DIR}/.git" ]]; then
    local remote_url
    remote_url="$(git -C "${LINKIN_DIR}" config --get remote.origin.url 2>/dev/null || true)"
    if [[ -n "$remote_url" && "$remote_url" != *"Linkin"* && "$remote_url" != "${LINKIN_REPO}"* ]]; then
      warn "目錄 ${LINKIN_DIR} 已是 git 倉，但 remote 不像 Linkin（${remote_url}）。"
    fi
    ok "Linkin 目錄已存在: ${LINKIN_DIR}（略過 clone；若要更新請執行 scripts/update.sh）"
    git -C "${LINKIN_DIR}" fetch origin "${LINKIN_BRANCH}" --quiet 2>/dev/null || true
    git -C "${LINKIN_DIR}" checkout "${LINKIN_BRANCH}" --quiet 2>/dev/null || true
    local commit
    commit="$(git -C "${LINKIN_DIR}" rev-parse HEAD)"
    write_manifest "$commit"
    return 0
  fi

  if [[ -e "${LINKIN_DIR}" ]]; then
    fail "路徑已存在但不是 git 倉: ${LINKIN_DIR}"
  fi

  mkdir -p "$(dirname "${LINKIN_DIR}")"
  local clone_args=(-b "${LINKIN_BRANCH}")
  if [[ "$SHALLOW" -eq 1 ]]; then
    clone_args+=(--depth 1)
    ok "淺 clone ${LINKIN_BRANCH} …"
  else
    ok "clone ${LINKIN_BRANCH} …"
  fi
  git clone "${clone_args[@]}" "${LINKIN_REPO}" "${LINKIN_DIR}"

  local commit
  commit="$(git -C "${LINKIN_DIR}" rev-parse HEAD)"
  write_manifest "$commit"
  ok "Linkin 已就緒: ${LINKIN_DIR} @ ${commit:0:12}"
}

check_prerequisites

if [[ "$CHECK_ONLY" -eq 1 ]]; then
  if [[ -f "$MANIFEST" ]]; then
    ok "既有 manifest:"
    cat "$MANIFEST"
  else
    warn "尚無 linkinl.json；略過 clone 時不會建立 manifest。"
  fi
  exit 0
fi

clone_or_verify_linkin

ok "下一步:"
ok "  1. cp .env.linkinl.example .env.linkinl 並調整 LINKIN_ROOT"
ok "  2. cd \"${LINKIN_DIR}\" && cp .env.example .env  # 填入 API 金鑰"
ok "  3. 見 docs/getting-started.md 或 Linkin docs/deployment/guide.md"
