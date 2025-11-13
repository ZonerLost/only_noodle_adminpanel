import React, { useEffect, useState } from "react";
import { getLoyaltyRules, saveLoyaltyRules } from "../api/loyalty.service.js";

export default function Rules() {
  const [rules, setRules] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    setBusy(true);
    setRules(await getLoyaltyRules());
    setBusy(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    setBusy(true);
    setMsg("");
    await saveLoyaltyRules(rules);
    setBusy(false);
    setMsg("Saved.");
  }

  if (!rules) {
    return (
      <div className="page">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-6">Loading…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <h1 className="text-xl font-semibold">Loyalty Rules</h1>
          <div className="muted text-sm">
            Configure earn/redeem rates, minimums and expiry
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <div className="card p-4">
            <div className="grid gap-3">
              <label className="block">
                <div className="text-sm muted">Points per €</div>
                <input
                  className="input"
                  type="number"
                  step="0.01"
                  value={rules.pointsPerEuro}
                  onChange={(e) =>
                    setRules((r) => ({
                      ...r,
                      pointsPerEuro: Number(e.target.value),
                    }))
                  }
                />
              </label>

              <label className="block">
                <div className="text-sm muted">Redeem rate (€ per point)</div>
                <input
                  className="input"
                  type="number"
                  step="0.01"
                  value={rules.redeemRate}
                  onChange={(e) =>
                    setRules((r) => ({
                      ...r,
                      redeemRate: Number(e.target.value),
                    }))
                  }
                />
              </label>

              <label className="block">
                <div className="text-sm muted">Minimum points to redeem</div>
                <input
                  className="input"
                  type="number"
                  value={rules.minRedeemPoints}
                  onChange={(e) =>
                    setRules((r) => ({
                      ...r,
                      minRedeemPoints: Number(e.target.value),
                    }))
                  }
                />
              </label>

              <label className="block">
                <div className="text-sm muted">Points expiry (days)</div>
                <input
                  className="input"
                  type="number"
                  value={rules.expiryDays}
                  onChange={(e) =>
                    setRules((r) => ({
                      ...r,
                      expiryDays: Number(e.target.value),
                    }))
                  }
                />
              </label>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <button className="btn" disabled={busy} onClick={save}>
                {busy ? "Saving…" : "Save rules"}
              </button>
              {msg && <div className="muted text-sm">{msg}</div>}
            </div>
          </div>

          <div className="card p-4">
            <div className="font-medium mb-2">Preview</div>
            <div className="space-y-2 text-sm">
              <div>
                Spend €100 → earn{" "}
                <b>{(100 * rules.pointsPerEuro).toFixed(0)}</b> points
              </div>
              <div>
                100 pts ≈ <b>€{(100 * rules.redeemRate).toFixed(2)}</b> voucher
              </div>
              <div>
                Min redeem: <b>{rules.minRedeemPoints}</b> pts
              </div>
              <div>
                Expiry: <b>{rules.expiryDays}</b> days
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
