import { useEffect, useState } from "react";

function Formation({ players = [], invitedPlayers = [], onSave }) {
  const [teamA, setTeamA] = useState([]);
  const [teamB, setTeamB] = useState([]);

  const getPlayer = (playerId) => players.find((player) => player._id === playerId);

  useEffect(() => {
    const invited = invitedPlayers.map((playerId) => playerId.toString());
    setTeamA((prev) => prev.filter((playerId) => invited.includes(playerId.toString())));
    setTeamB((prev) => prev.filter((playerId) => invited.includes(playerId.toString())));
  }, [invitedPlayers]);

  const movePlayer = (playerId, team) => {
    const id = playerId.toString();

    if (team === "teamA") {
      setTeamA((prev) => (prev.includes(id) ? prev.filter((player) => player !== id) : [...prev, id]));
      setTeamB((prev) => prev.filter((player) => player !== id));
    }

    if (team === "teamB") {
      setTeamB((prev) => (prev.includes(id) ? prev.filter((player) => player !== id) : [...prev, id]));
      setTeamA((prev) => prev.filter((player) => player !== id));
    }
  };

  const handleRandomTeams = () => {
    const playerIds = invitedPlayers.map((playerId) => playerId.toString());
    if (playerIds.length < 2) return;

    const shuffled = [...playerIds].sort(() => Math.random() - 0.5);
    const middle = Math.ceil(shuffled.length / 2);

    setTeamA(shuffled.slice(0, middle));
    setTeamB(shuffled.slice(middle));
  };

  const handleSave = () => {
    if (teamA.length === 0 || teamB.length === 0) return;

    onSave?.({ teamA, teamB });
  };

  const playerCard = (playerId, team) => {
    const player = getPlayer(playerId);
    if (!player) return null;

    return (
      <div
        key={playerId}
        className="mb-2 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5"
      >
        <span className="text-sm font-semibold text-slate-800">{player.username}</span>
        <button
          type="button"
          onClick={() => movePlayer(playerId, team)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-100"
        >
          Remove
        </button>
      </div>
    );
  };

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Choose Teams</h2>
          <p className="mt-1 text-sm text-slate-600">Choose which team each player will play for.</p>
        </div>

        <button
          type="button"
          onClick={handleRandomTeams}
          disabled={invitedPlayers.length < 2}
          className={[
            "rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200",
            invitedPlayers.length < 2
              ? "cursor-not-allowed bg-slate-200 text-slate-500"
              : "bg-slate-900 text-white hover:bg-slate-800",
          ].join(" ")}
        >
          🎲 Random Teams
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Team A</h3>
            <span className="text-xs font-medium text-slate-500">{teamA.length} players</span>
          </div>

          {teamA.length === 0 ? (
            <p className="text-sm text-slate-500">No players yet.</p>
          ) : (
            teamA.map((playerId) => playerCard(playerId, "teamA"))
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Team B</h3>
            <span className="text-xs font-medium text-slate-500">{teamB.length} players</span>
          </div>

          {teamB.length === 0 ? (
            <p className="text-sm text-slate-500">No players yet.</p>
          ) : (
            teamB.map((playerId) => playerCard(playerId, "teamB"))
          )}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-base font-bold text-slate-900">Players</h3>

        <div className="space-y-3">
          {invitedPlayers.map((playerId) => {
            const player = getPlayer(playerId);
            if (!player) return null;

            const id = playerId.toString();
            const inTeamA = teamA.includes(id);
            const inTeamB = teamB.includes(id);

            return (
              <div key={id} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm font-semibold text-slate-800">{player.username}</span>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => movePlayer(id, "teamA")}
                    className={[
                      "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                      inTeamA ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300",
                    ].join(" ")}
                  >
                    {inTeamA ? "✓ Team A" : "Team A"}
                  </button>

                  <button
                    type="button"
                    onClick={() => movePlayer(id, "teamB")}
                    className={[
                      "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                      inTeamB ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300",
                    ].join(" ")}
                  >
                    {inTeamB ? "✓ Team B" : "Team B"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={teamA.length === 0 || teamB.length === 0}
          className={[
            "rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200",
            teamA.length === 0 || teamB.length === 0
              ? "cursor-not-allowed bg-slate-200 text-slate-500"
              : "bg-emerald-600 text-white hover:bg-emerald-500",
          ].join(" ")}
        >
          Save Teams
        </button>
      </div>
    </div>
  );
}

export default Formation;