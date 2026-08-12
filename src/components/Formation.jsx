import { useEffect, useState } from "react"

function Formation({ players = [], invitedPlayers = [], onSave }) {
  const [teamA, setTeamA] = useState([])
  const [teamB, setTeamB] = useState([])

  const getPlayer = (playerId) =>
    players.find((player) => player._id === playerId)

  useEffect(() => {
    const invited = invitedPlayers.map((playerId) => playerId.toString())

    setTeamA((prev) =>
      prev.filter((playerId) => invited.includes(playerId.toString()))
    )

    setTeamB((prev) =>
      prev.filter((playerId) => invited.includes(playerId.toString()))
    )
  }, [invitedPlayers])

  const movePlayer = (playerId, team) => {
    const id = playerId.toString()

    if (team === "teamA") {
      setTeamA((prev) =>
        prev.includes(id)
          ? prev.filter((player) => player !== id)
          : [...prev, id]
      )
      setTeamB((prev) => prev.filter((player) => player !== id))
    }

    if (team === "teamB") {
      setTeamB((prev) =>
        prev.includes(id)
          ? prev.filter((player) => player !== id)
          : [...prev, id]
      )
      setTeamA((prev) => prev.filter((player) => player !== id))
    }
  }

  const handleRandomTeams = () => {
    const playerIds = invitedPlayers.map((playerId) => playerId.toString())

    if (playerIds.length < 2) return

    const shuffled = [...playerIds].sort(() => Math.random() - 0.5)
    const middle = Math.ceil(shuffled.length / 2)

    setTeamA(shuffled.slice(0, middle))
    setTeamB(shuffled.slice(middle))
  }

  const handleSave = () => {
    if (teamA.length === 0 || teamB.length === 0) return

    onSave?.({
      teamA,
      teamB,
    })
  }

  const playerCard = (playerId, team) => {
    const player = getPlayer(playerId)

    if (!player) return null

    return (
      <div
        key={playerId}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
          padding: "10px 12px",
          marginBottom: "8px",
          borderRadius: "10px",
          background: "#fff",
          border: "1px solid #ddd",
        }}
      >
        <span style={{ fontWeight: "600" }}>
          {player.username}
        </span>

        <button
          type="button"
          onClick={() => movePlayer(playerId, team)}
          style={{
            padding: "6px 10px",
            borderRadius: "7px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          Remove
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "24px",
        border: "1px solid #ddd",
        borderRadius: "16px",
        background: "#f8f8f8",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Choose Teams</h2>
          <p style={{ margin: "6px 0 0", color: "#666" }}>
            Choose which team each player will play for.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRandomTeams}
          disabled={invitedPlayers.length < 2}
          style={{
            padding: "10px 16px",
            borderRadius: "9px",
            border: "none",
            cursor: invitedPlayers.length < 2 ? "not-allowed" : "pointer",
            opacity: invitedPlayers.length < 2 ? 0.5 : 1,
            fontWeight: "600",
          }}
        >
          🎲 Random Teams
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >
        <div
          style={{
            minHeight: "220px",
            padding: "18px",
            borderRadius: "14px",
            border: "2px solid #ddd",
            background: "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "14px",
            }}
          >
            <h3 style={{ margin: 0 }}>Team A</h3>
            <span>{teamA.length} players</span>
          </div>

          {teamA.length === 0 ? (
            <p style={{ color: "#888" }}>No players yet.</p>
          ) : (
            teamA.map((playerId) => playerCard(playerId, "teamA"))
          )}
        </div>

        <div
          style={{
            minHeight: "220px",
            padding: "18px",
            borderRadius: "14px",
            border: "2px solid #ddd",
            background: "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "14px",
            }}
          >
            <h3 style={{ margin: 0 }}>Team B</h3>
            <span>{teamB.length} players</span>
          </div>

          {teamB.length === 0 ? (
            <p style={{ color: "#888" }}>No players yet.</p>
          ) : (
            teamB.map((playerId) => playerCard(playerId, "teamB"))
          )}
        </div>
      </div>

      <div style={{ marginTop: "24px" }}>
        <h3>Players</h3>

        {invitedPlayers.map((playerId) => {
          const player = getPlayer(playerId)
          if (!player) return null

          const id = playerId.toString()
          const inTeamA = teamA.includes(id)
          const inTeamB = teamB.includes(id)

          return (
            <div
              key={id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                padding: "10px 0",
                borderBottom: "1px solid #ddd",
              }}
            >
              <span style={{ fontWeight: "600" }}>
                {player.username}
              </span>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => movePlayer(id, "teamA")}
                  style={{
                    padding: "7px 12px",
                    borderRadius: "7px",
                    border: "1px solid #ccc",
                    fontWeight: inTeamA ? "700" : "400",
                    cursor: "pointer",
                  }}
                >
                  {inTeamA ? "✓ Team A" : "Team A"}
                </button>

                <button
                  type="button"
                  onClick={() => movePlayer(id, "teamB")}
                  style={{
                    padding: "7px 12px",
                    borderRadius: "7px",
                    border: "1px solid #ccc",
                    fontWeight: inTeamB ? "700" : "400",
                    cursor: "pointer",
                  }}
                >
                  {inTeamB ? "✓ Team B" : "Team B"}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "24px",
        }}
      >
        <button
          type="button"
          onClick={handleSave}
          disabled={teamA.length === 0 || teamB.length === 0}
          style={{
            padding: "11px 20px",
            borderRadius: "9px",
            border: "none",
            cursor:
              teamA.length === 0 || teamB.length === 0
                ? "not-allowed"
                : "pointer",
            opacity:
              teamA.length === 0 || teamB.length === 0 ? 0.5 : 1,
            fontWeight: "700",
          }}
        >
          Save Teams
        </button>
      </div>
    </div>
  )
}

export default Formation