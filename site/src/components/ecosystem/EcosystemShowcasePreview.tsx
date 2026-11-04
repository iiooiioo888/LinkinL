/** 與首頁 trace-stage / tool-sim / ledger 同系的靜態 UI 示意（非嵌入第三方 iframe）。 */
export function EcosystemShowcasePreview({ partnerId }: { partnerId: string }) {
  if (partnerId === 'gitnexus') {
    return (
      <div className="ecosystem-showcase-body preview-gitnexus" aria-hidden="true">
        <div className="eco-preview-bar mono">
          <span>impact · upstream</span>
          <span className="live-dot">LIVE</span>
        </div>
        <div className="eco-dag-row">
          <span className="eco-dag-node on">UserService</span>
          <span className="eco-dag-edge" />
          <span className="eco-dag-node">AuthGate</span>
          <span className="eco-dag-edge warn" />
          <span className="eco-dag-node hot">call_llm</span>
        </div>
        <div className="eco-preview-log mono">
          <span className="prompt">$</span> gitnexus impact call_llm --direction upstream
          <br />
          <span className="dim">→ 3 symbols · 2 paths · MCP query 84ms</span>
        </div>
      </div>
    );
  }

  if (partnerId === 'atm') {
    return (
      <div className="ecosystem-showcase-body preview-atm" aria-hidden="true">
        <div className="eco-preview-bar mono">
          <span>org-chart · deploy</span>
          <span>06:00 cron</span>
        </div>
        <div className="eco-org-tree">
          <span className="eco-org-node you">You</span>
          <span className="eco-org-connector" />
          <span className="eco-org-node team">SOC Team</span>
          <span className="eco-org-connector branch" />
          <div className="eco-org-row">
            <span className="eco-org-node agent">Triage</span>
            <span className="eco-org-node agent on">Analyst</span>
            <span className="eco-org-node skill">skill.md</span>
          </div>
        </div>
        <div className="eco-preview-log mono">
          <span className="prompt">Deploy</span> primer compiled · terminal spawned
        </div>
      </div>
    );
  }

  if (partnerId === 'semantica') {
    return (
      <div className="ecosystem-showcase-body preview-semantica" aria-hidden="true">
        <div className="eco-preview-bar mono">
          <span>trace_decision_chain</span>
          <span>PROV-O</span>
        </div>
        <ul className="eco-decision-chain">
          <li>
            <span className="mono">d-1042</span>
            <span>budget.gate.pass</span>
            <span className="mono ms">3ms</span>
          </li>
          <li className="on">
            <span className="mono">d-1043</span>
            <span>agent.final_answer</span>
            <span className="mono ms">sample</span>
          </li>
          <li>
            <span className="mono">d-1038</span>
            <span>retrieval.chroma</span>
            <span className="mono ms">41ms</span>
          </li>
        </ul>
        <div className="eco-preview-log mono">
          <span className="dim">↑ 往回查因果 · 可匯出 RDF</span>
        </div>
      </div>
    );
  }

  return null;
}
