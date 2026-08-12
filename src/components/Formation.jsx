import { useEffect, useState } from "react";

function Formation({
  players = [],
  invitedPlayers = [],
  initialTeamA = [],
  initialTeamB = [],
  owner = null,
  onSave,
  isSaving = false,
}) {
  const [teamA, setTeamA] = useState([]);
  const [teamB, setTeamB] = useState([]);
  const [formationLayout, setFormationLayout] = useState("4-4-2");
  const [selectedAddPlayerId, setSelectedAddPlayerId] = useState("");

  const getPlayerId = (player) => (typeof player === "object" && player ? player._id || player.id : player);

  const getPlayerObj = (playerId) => {
    const idStr = String(getPlayerId(playerId));

    if (owner && String(getPlayerId(owner)) === idStr && typeof owner === "object") {
      return owner;
    }

    const foundInPlayers = players.find((p) => String(getPlayerId(p)) === idStr);
    if (foundInPlayers && typeof foundInPlayers === "object") return foundInPlayers;

    const foundInInvited = invitedPlayers.find((p) => String(getPlayerId(p)) === idStr);
    if (foundInInvited && typeof foundInInvited === "object") return foundInInvited;

    const foundInA = initialTeamA.find((p) => String(getPlayerId(p)) === idStr);
    if (foundInA && typeof foundInA === "object") return foundInA;

    const foundInB = initialTeamB.find((p) => String(getPlayerId(p)) === idStr);
    if (foundInB && typeof foundInB === "object") return foundInB;

    return typeof playerId === "object" ? playerId : { _id: idStr, username: `Player ${idStr.slice(-4)}` };
  };

useEffect(() => {
    const normA = initialTeamA.map(getPlayerId).filter(Boolean).map(String);
    const normB = initialTeamB.map(getPlayerId).filter(Boolean).map(String);
    setTeamA(normA);
    setTeamB(normB);
  }, []);

  // Master list of all participant IDs
  const allParticipantIds = Array.from(
    new Set([
      ...(owner ? [String(getPlayerId(owner))] : []),
      ...invitedPlayers.map(getPlayerId).map(String),
      ...initialTeamA.map(getPlayerId).map(String),
      ...initialTeamB.map(getPlayerId).map(String),
      ...teamA,
      ...teamB,
    ])
  ).filter(Boolean);

  const movePlayer = (playerId, targetTeam) => {
    const id = String(getPlayerId(playerId));

    if (targetTeam === "teamA") {
      setTeamA((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
      setTeamB((prev) => prev.filter((p) => p !== id));
    } else if (targetTeam === "teamB") {
      setTeamB((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
      setTeamA((prev) => prev.filter((p) => p !== id));
    } else {
      setTeamA((prev) => prev.filter((p) => p !== id));
      setTeamB((prev) => prev.filter((p) => p !== id));
    }
  };

  const handleAddPlayerFromSelect = (targetTeam) => {
    if (!selectedAddPlayerId) return;
    movePlayer(selectedAddPlayerId, targetTeam);
    setSelectedAddPlayerId("");
  };

  const handleRandomTeams = () => {
    if (allParticipantIds.length < 2) return;

    const shuffled = [...allParticipantIds].sort(() => Math.random() - 0.5);
    const middle = Math.ceil(shuffled.length / 2);

    setTeamA(shuffled.slice(0, middle));
    setTeamB(shuffled.slice(middle));
  };

  const handleClear = () => {
    setTeamA([]);
    setTeamB([]);
  };

  const handleSave = () => {
    if (teamA.length === 0 || teamB.length === 0) return;
    onSave?.({ teamA, teamB });
  };

  const unassignedIds = allParticipantIds.filter((id) => !teamA.includes(id) && !teamB.includes(id));
  const availableExtraPlayers = players.filter((p) => !allParticipantIds.includes(String(getPlayerId(p))));

  return (
    <div className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      {/* Header & Tactics Bar */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700 ring-1 ring-emerald-600/20">
            ⚽ Interactive Tactics Pitch
          </span>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">Team Lineup & Formation</h2>
          <p className="text-sm text-slate-500">Organize Team A vs Team B and position players on the matchday pitch.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={formationLayout}
            onChange={(e) => setFormationLayout(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="4-4-2">Tactics: 4-4-2</option>
            <option value="4-3-3">Tactics: 4-3-3</option>
            <option value="3-5-2">Tactics: 3-5-2</option>
            <option value="5-3-2">Tactics: 5-3-2</option>
          </select>

          <button
            type="button"
            onClick={handleRandomTeams}
            disabled={allParticipantIds.length < 2}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white transition-all hover:bg-slate-800 disabled:opacity-50"
          >
            🎲 Auto Split
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Visual Pitch Display */}
      <div className="relative min-h-[440px] flex flex-col justify-between overflow-hidden rounded-3xl border-4 border-emerald-950/20 bg-gradient-to-b from-emerald-800 via-emerald-700 to-emerald-900 p-6 shadow-2xl select-none">
        {/* Pitch Field Lines */}
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-white" />
          <div className="absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" />
          <div className="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
          <div className="absolute top-0 left-1/2 h-24 w-48 -translate-x-1/2 rounded-b-xl border-b-2 border-x-2 border-white" />
          <div className="absolute bottom-0 left-1/2 h-24 w-48 -translate-x-1/2 rounded-t-xl border-t-2 border-x-2 border-white" />
        </div>

        {/* TEAM A Side (Top End) */}
        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-blue-600/90 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-md backdrop-blur-md">
              Team A ({teamA.length})
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200/80">Home Half</span>
          </div>

          <div className="flex min-h-[110px] flex-wrap items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-xs">
            {teamA.length === 0 ? (
              <p className="text-xs italic text-emerald-100/70">No players in Team A yet. Assign below.</p>
            ) : (
              teamA.map((id) => {
                const player = getPlayerObj(id);
                return (
                  <div
                    key={id}
                    className="group relative flex items-center gap-2 rounded-2xl border border-blue-400/40 bg-blue-600/95 px-3.5 py-2 text-xs font-bold text-white shadow-lg transition-all hover:scale-105"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[11px] font-black text-blue-800">
                      {(player.username || "P")[0].toUpperCase()}
                    </span>
                    <span>{player.username || "Player"}</span>
                    <button
                      type="button"
                      onClick={() => movePlayer(id, null)}
                      className="ml-1 rounded-full bg-blue-800/80 p-1 text-[10px] leading-none opacity-80 hover:opacity-100"
                      title="Remove from Team A"
                    >
                      ✕
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Center Divider Badge */}
        <div className="relative z-10 my-3 flex items-center justify-center">
          <span className="rounded-full border border-white/30 bg-emerald-950/85 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-emerald-300 shadow-xl backdrop-blur-md">
            VS • {formationLayout}
          </span>
        </div>

        {/* TEAM B Side (Bottom End) */}
        <div className="relative z-10 space-y-2">
          <div className="flex min-h-[110px] flex-wrap items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-xs">
            {teamB.length === 0 ? (
              <p className="text-xs italic text-emerald-100/70">No players in Team B yet. Assign below.</p>
            ) : (
              teamB.map((id) => {
                const player = getPlayerObj(id);
                return (
                  <div
                    key={id}
                    className="group relative flex items-center gap-2 rounded-2xl border border-rose-400/40 bg-rose-600/95 px-3.5 py-2 text-xs font-bold text-white shadow-lg transition-all hover:scale-105"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[11px] font-black text-rose-800">
                      {(player.username || "P")[0].toUpperCase()}
                    </span>
                    <span>{player.username || "Player"}</span>
                    <button
                      type="button"
                      onClick={() => movePlayer(id, null)}
                      className="ml-1 rounded-full bg-rose-800/80 p-1 text-[10px] leading-none opacity-80 hover:opacity-100"
                      title="Remove from Team B"
                    >
                      ✕
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="rounded-full bg-rose-600/90 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-md backdrop-blur-md">
              Team B ({teamB.length})
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200/80">Away Half</span>
          </div>
        </div>
      </div>

      {/* Roster & Quick Add Section */}
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-700">
              Match Roster Pool ({allParticipantIds.length})
            </h3>
            <p className="text-xs text-slate-500">{unassignedIds.length} unassigned players available</p>
          </div>

          {availableExtraPlayers.length > 0 && (
            <div className="flex items-center gap-2">
              <select
                value={selectedAddPlayerId}
                onChange={(e) => setSelectedAddPlayerId(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs focus:outline-none"
              >
                <option value="">+ Add friend to match...</option>
                {availableExtraPlayers.map((p) => (
                  <option key={getPlayerId(p)} value={getPlayerId(p)}>
                    {p.username || "Player"}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => handleAddPlayerFromSelect("teamA")}
                disabled={!selectedAddPlayerId}
                className="rounded-lg bg-blue-600 px-2.5 py-1.5 text-[11px] font-extrabold text-white transition-all hover:bg-blue-700 disabled:opacity-40"
              >
                + Team A
              </button>
              <button
                type="button"
                onClick={() => handleAddPlayerFromSelect("teamB")}
                disabled={!selectedAddPlayerId}
                className="rounded-lg bg-rose-600 px-2.5 py-1.5 text-[11px] font-extrabold text-white transition-all hover:bg-rose-700 disabled:opacity-40"
              >
                + Team B
              </button>
            </div>
          )}
        </div>

        {allParticipantIds.length === 0 ? (
          <p className="text-xs italic text-slate-500">No participants added yet. Use the friend selector above to invite or add players.</p>
        ) : (
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {allParticipantIds.makeArray || allParticipantIds.map((id) => {
              const idStr = String(id);
              const player = getPlayerObj(idStr);
              const inTeamA = teamA.includes(idStr);
              const inTeamB = teamB.includes(idStr);

              return (
                <div
                  key={idStr}
                  className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-xs"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                      {(player.username || "P")[0].toUpperCase()}
                    </div>
                    <span className="truncate text-xs font-bold text-slate-800">{player.username || "Player"}</span>
                  </div>

                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => movePlayer(idStr, "teamA")}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-extrabold transition-all ${
                        inTeamA
                          ? "bg-blue-600 text-white shadow-xs"
                          : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      Team A
                    </button>
                    <button
                      type="button"
                      onClick={() => movePlayer(idStr, "teamB")}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-extrabold transition-all ${
                        inTeamB
                          ? "bg-rose-600 text-white shadow-xs"
                          : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      Team B
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-slate-500 font-medium">
          {teamA.length === 0 || teamB.length === 0
            ? "⚠️ Assign at least 1 player to Team A and Team B to save."
            : `✓ Ready: Team A (${teamA.length}) vs Team B (${teamB.length})`}
        </p>

        <button
          type="button"
          onClick={handleSave}
          disabled={teamA.length === 0 || teamB.length === 0 || isSaving}
          className="primary-button bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50"
        >
          {isSaving ? "Saving Formation..." : "Save Lineup & Teams"}
        </button>
      </div>
    </div>
  );
}

export default Formation;