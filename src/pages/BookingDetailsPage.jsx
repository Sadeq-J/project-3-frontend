import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  getMyBookings,
  updateBooking,
  invitePlayer,
} from "../services/bookingService";
import { getFollowing } from "../services/profileService";

function BookingDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingTeams, setEditingTeams] = useState(false);
  const [teamA, setTeamA] = useState([]);
  const [teamB, setTeamB] = useState([]);
  const [savingTeams, setSavingTeams] = useState(false);

  const [following, setFollowing] = useState([]);
  const [selectedFriendId, setSelectedFriendId] = useState("");
  const [inviting, setInviting] = useState(false);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      setError("");

      const bookings = await getMyBookings();
      const foundBooking = bookings.find(
        (oneBooking) => oneBooking._id === id
      );

      if (!foundBooking) {
        setError("Booking not found");
        return;
      }

      setBooking(foundBooking);

      setTeamA(
        (foundBooking.teams?.teamA || []).map((player) =>
          typeof player === "object" ? player._id : player
        )
      );

      setTeamB(
        (foundBooking.teams?.teamB || []).map((player) =>
          typeof player === "object" ? player._id : player
        )
      );
    } catch (error) {
      console.error("Error fetching booking:", error);
      setError("Failed to load booking");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();

    const fetchFollowing = async () => {
      try {
        const data = await getFollowing();
        setFollowing(data);
      } catch (error) {
        console.error("Error fetching following:", error);
      }
    };

    fetchFollowing();
  }, [id]);

  const movePlayer = (playerId, team) => {
    const playerIdString = playerId.toString();

    if (team === "teamA") {
      setTeamA((prev) =>
        prev.includes(playerIdString)
          ? prev.filter((player) => player !== playerIdString)
          : [...prev, playerIdString]
      );
      setTeamB((prev) => prev.filter((player) => player !== playerIdString));
    }

    if (team === "teamB") {
      setTeamB((prev) =>
        prev.includes(playerIdString)
          ? prev.filter((player) => player !== playerIdString)
          : [...prev, playerIdString]
      );
      setTeamA((prev) => prev.filter((player) => player !== playerIdString));
    }
  };

  const handleRandomTeams = () => {
    const players = [
      ...(booking?.teams?.teamA || []),
      ...(booking?.teams?.teamB || []),
    ].map((player) =>
      typeof player === "object" ? player._id : player
    );

    if (players.length < 2) return;

    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const middle = Math.ceil(shuffled.length / 2);

    setTeamA(shuffled.slice(0, middle));
    setTeamB(shuffled.slice(middle));
  };

  const handleSaveTeams = async () => {
    if (teamA.length === 0 || teamB.length === 0) {
      return;
    }

    try {
      setSavingTeams(true);

      await updateBooking(id, {
        teams: {
          teamA,
          teamB,
        },
      });

      await fetchBooking();
      setEditingTeams(false);
    } catch (error) {
      console.error("Error updating teams:", error);
      setError("Failed to update teams");
    } finally {
      setSavingTeams(false);
    }
  };

  const handleInvitePlayer = async () => {
    if (!selectedFriendId) return;

    try {
      setInviting(true);

      await invitePlayer(id, selectedFriendId);
      setSelectedFriendId("");
      await fetchBooking();
    } catch (error) {
      console.error("Error inviting player:", error);
      setError(error.response?.data?.error || "Failed to invite player");
    } finally {
      setInviting(false);
    }
  };

  if (loading) {
    return <p>Loading booking...</p>;
  }

  if (error && !booking) {
    return <p>{error}</p>;
  }

  if (!booking) {
    return <p>Booking not found</p>;
  }

  const venueName = booking.venue?.name || "Venue";
  const isFootball = Array.isArray(booking.venue?.sportType)
    ? booking.venue.sportType.some(
        (sport) => typeof sport === "string" && sport.toLowerCase() === "football"
      )
    : typeof booking.venue?.sportType === "string" &&
      booking.venue.sportType.toLowerCase() === "football";
  const formattedDate = booking.date
    ? new Date(booking.date).toLocaleDateString()
    : "-";

  const invitedPlayers = booking.invitedPlayers || [];
  const displayedTeamA = booking.teams?.teamA || [];
  const displayedTeamB = booking.teams?.teamB || [];

  const assignedPlayerIds = new Set(
    [...teamA, ...teamB].map((playerId) => playerId.toString())
  );

  const availableFriends = following.filter(
    (player) =>
      !invitedPlayers.some(
        (invitedPlayer) =>
          (invitedPlayer._id || invitedPlayer).toString() ===
          player._id.toString()
      ) && !assignedPlayerIds.has(player._id.toString())
  );

  return (
    <div className="booking-details-page">
      <h1>Booking Details</h1>

      <div className="booking-info">
        <h2>{venueName}</h2>

        <p>
          <strong>Date:</strong> {formattedDate}
        </p>

        <p>
          <strong>Time:</strong> {booking.timeSlots || "-"}
        </p>

        <p>
          <strong>Status:</strong> {booking.status || "-"}
        </p>
      </div>

      {booking.venue && (
        <div className="venue-info">
          <h2>Venue</h2>

          <p>
            <strong>Name:</strong> {booking.venue.name || "-"}
          </p>

          {booking.venue.location && (
            <p>
              <strong>Location:</strong> {booking.venue.location}
            </p>
          )}

          {booking.venue.sportType && (
            <p>
              <strong>Sport:</strong>{" "}
              {Array.isArray(booking.venue.sportType)
                ? booking.venue.sportType.join(", ")
                : booking.venue.sportType}
            </p>
          )}

          <button
            type="button"
            onClick={() => navigate(`/venues/${booking.venue?._id}`)}
            disabled={!booking.venue?._id}
            style={{ marginTop: "12px" }}
        >
            View Venue
        </button>
        </div>
      )}

      {isFootball && (
        <div className="players-section">
          <h2>Invited Players</h2>

          {invitedPlayers.length === 0 ? (
            <p>No invited players.</p>
          ) : (
            <ul>
              {invitedPlayers.map((player) => (
                <li key={player._id || player}>
                  {player.username || player}
                </li>
              ))}
            </ul>
          )}

          <div style={{ marginTop: "16px" }}>
            <select
              value={selectedFriendId}
              onChange={(e) => setSelectedFriendId(e.target.value)}
            >
              <option value="">Select a player to invite</option>
              {availableFriends.map((player) => (
                <option key={player._id} value={player._id}>
                  {player.username}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleInvitePlayer}
              disabled={!selectedFriendId || inviting}
              style={{ marginLeft: "10px" }}
            >
              {inviting ? "Inviting..." : "+ Invite Player"}
            </button>
          </div>
        </div>
      )}

      {isFootball && (
        <div className="teams-section">
          {!editingTeams ? (
            <>
              <div className="team">
                <h2>Team A</h2>
                {displayedTeamA.length === 0 ? (
                  <p>No players.</p>
                ) : (
                  <ul>
                    {displayedTeamA.map((player) => (
                      <li key={player._id || player}>
                        {player.username || player}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="team">
                <h2>Team B</h2>
                {displayedTeamB.length === 0 ? (
                  <p>No players.</p>
                ) : (
                  <ul>
                    {displayedTeamB.map((player) => (
                      <li key={player._id || player}>
                        {player.username || player}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                type="button"
                onClick={() => setEditingTeams(true)}
                style={{ marginTop: "16px" }}
              >
                Edit Teams
              </button>
            </>
          ) : (
            <div style={{ marginTop: "20px" }}>
              <div style={{ marginBottom: "16px" }}>
                <button type="button" onClick={handleRandomTeams}>
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
                <div className="team">
                  <h2>Team A ({teamA.length})</h2>
                  {teamA.map((playerId) => {
                    const player = following.find(
                      (onePlayer) => onePlayer._id === playerId
                    );

                    const bookedPlayer =
                      displayedTeamA.find(
                        (onePlayer) => onePlayer._id === playerId
                      ) ||
                      displayedTeamB.find(
                        (onePlayer) => onePlayer._id === playerId
                      );

                    return (
                      <div key={playerId} style={{ marginBottom: "8px" }}>
                        {player?.username || bookedPlayer?.username || playerId}
                        <button
                          type="button"
                          onClick={() => movePlayer(playerId, "teamA")}
                          style={{ marginLeft: "8px" }}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="team">
                  <h2>Team B ({teamB.length})</h2>
                  {teamB.map((playerId) => {
                    const player = following.find(
                      (onePlayer) => onePlayer._id === playerId
                    );

                    const bookedPlayer =
                      displayedTeamA.find(
                        (onePlayer) => onePlayer._id === playerId
                      ) ||
                      displayedTeamB.find(
                        (onePlayer) => onePlayer._id === playerId
                      );

                    return (
                      <div key={playerId} style={{ marginBottom: "8px" }}>
                        {player?.username || bookedPlayer?.username || playerId}
                        <button
                          type="button"
                          onClick={() => movePlayer(playerId, "teamB")}
                          style={{ marginLeft: "8px" }}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginTop: "20px" }}>
                <h3>Move Players</h3>

                {[...displayedTeamA, ...displayedTeamB].map((player) => {
                  const playerId = player._id || player;
                  const playerName = player.username || player;

                  return (
                    <div key={playerId} style={{ marginBottom: "8px" }}>
                      <span>{playerName}</span>
                      <button
                        type="button"
                        onClick={() => movePlayer(playerId, "teamA")}
                        style={{ marginLeft: "10px" }}
                      >
                        Team A
                      </button>
                      <button
                        type="button"
                        onClick={() => movePlayer(playerId, "teamB")}
                        style={{ marginLeft: "6px" }}
                      >
                        Team B
                      </button>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleSaveTeams}
                disabled={teamA.length === 0 || teamB.length === 0 || savingTeams}
                style={{ marginTop: "16px" }}
              >
                {savingTeams ? "Saving..." : "Save Teams"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTeamA(
                    displayedTeamA.map((player) =>
                      typeof player === "object" ? player._id : player
                    )
                  );
                  setTeamB(
                    displayedTeamB.map((player) =>
                      typeof player === "object" ? player._id : player
                    )
                  );
                  setEditingTeams(false);
                }}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {error && booking && <p>{error}</p>}
    </div>
  );
}

export default BookingDetailsPage;