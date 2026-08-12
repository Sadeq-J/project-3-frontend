import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getMyBookings, updateBooking, invitePlayer } from "../services/bookingService";
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
      const foundBooking = bookings.find((oneBooking) => oneBooking._id === id);

      if (!foundBooking) {
        setError("Booking not found");
        return;
      }

      setBooking(foundBooking);
      setTeamA((foundBooking.teams?.teamA || []).map((player) => (typeof player === "object" ? player._id : player)));
      setTeamB((foundBooking.teams?.teamB || []).map((player) => (typeof player === "object" ? player._id : player)));
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
        prev.includes(playerIdString) ? prev.filter((player) => player !== playerIdString) : [...prev, playerIdString]
      );
      setTeamB((prev) => prev.filter((player) => player !== playerIdString));
    }

    if (team === "teamB") {
      setTeamB((prev) =>
        prev.includes(playerIdString) ? prev.filter((player) => player !== playerIdString) : [...prev, playerIdString]
      );
      setTeamA((prev) => prev.filter((player) => player !== playerIdString));
    }
  };

  const handleRandomTeams = () => {
    const players = [...(booking?.teams?.teamA || []), ...(booking?.teams?.teamB || [])].map((player) =>
      typeof player === "object" ? player._id : player
    );

    if (players.length < 2) return;

    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const middle = Math.ceil(shuffled.length / 2);

    setTeamA(shuffled.slice(0, middle));
    setTeamB(shuffled.slice(middle));
  };

  const handleSaveTeams = async () => {
    if (teamA.length === 0 || teamB.length === 0) return;

    try {
      setSavingTeams(true);
      await updateBooking(id, { teams: { teamA, teamB } });
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

  if (loading) return <div className="py-10 text-center text-sm text-slate-500">Loading booking...</div>;
  if (error && !booking) return <div className="py-10 text-center text-sm text-red-500">{error}</div>;
  if (!booking) return <div className="py-10 text-center text-sm text-slate-500">Booking not found.</div>;

  const venueName = booking.venue?.name || "Venue";
  const isFootball = Array.isArray(booking.venue?.sportType)
    ? booking.venue.sportType.some((sport) => typeof sport === "string" && sport.toLowerCase() === "football")
    : typeof booking.venue?.sportType === "string" && booking.venue.sportType.toLowerCase() === "football";

  const formattedDate = booking.date ? new Date(booking.date).toLocaleDateString() : "-";
  const invitedPlayers = booking.invitedPlayers || [];
  const displayedTeamA = booking.teams?.teamA || [];
  const displayedTeamB = booking.teams?.teamB || [];
  const assignedPlayerIds = new Set([...teamA, ...teamB].map((playerId) => playerId.toString()));

  const availableFriends = following.filter(
    (player) =>
      !invitedPlayers.some(
        (invitedPlayer) => (invitedPlayer._id || invitedPlayer).toString() === player._id.toString()
      ) && !assignedPlayerIds.has(player._id.toString())
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6 py-8">
      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Booking details</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">{venueName}</h1>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
            {booking.status || "Confirmed"}
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Date</p>
            <p className="mt-2 text-base font-bold text-slate-900">{formattedDate}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Time</p>
            <p className="mt-2 text-base font-bold text-slate-900">{booking.timeSlots || "-"}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Venue</p>
            <p className="mt-2 text-base font-bold text-slate-900">{booking.venue?.location || "-"}</p>
          </div>
        </div>
      </section>

      {booking.venue && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Venue details</h2>
            <button type="button" onClick={() => navigate(`/venues/${booking.venue?._id}`)} disabled={!booking.venue?._id} className="secondary-button">
              View venue
            </button>
          </div>

          <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
            <p><span className="font-semibold text-slate-900">Name:</span> {booking.venue.name || "-"}</p>
            <p><span className="font-semibold text-slate-900">Location:</span> {booking.venue.location || "-"}</p>
            <p className="sm:col-span-2"><span className="font-semibold text-slate-900">Sport:</span> {Array.isArray(booking.venue.sportType) ? booking.venue.sportType.join(", ") : booking.venue.sportType || "-"}</p>
          </div>
        </section>
      )}

      {isFootball && (
        <section className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Invited players</h2>
              <p className="mt-1 text-sm text-slate-600">Build your matchday squad and team assignment.</p>
            </div>
          </div>

          <div className="space-y-3">
            {invitedPlayers.length === 0 ? (
              <p className="text-sm text-slate-500">No invited players.</p>
            ) : (
              invitedPlayers.map((player) => (
                <div key={player._id || player} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                  {player.username || player}
                </div>
              ))
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={selectedFriendId}
              onChange={(e) => setSelectedFriendId(e.target.value)}
              className="field-input max-w-md"
            >
              <option value="">Select a player to invite</option>
              {availableFriends.map((player) => (
                <option key={player._id} value={player._id}>{player.username}</option>
              ))}
            </select>

            <button type="button" onClick={handleInvitePlayer} disabled={!selectedFriendId || inviting} className="primary-button sm:w-auto">
              {inviting ? "Inviting..." : "+ Invite Player"}
            </button>
          </div>

          {!editingTeams ? (
            <div className="space-y-4 pt-2">
              <button type="button" onClick={() => setEditingTeams(true)} className="secondary-button">
                Edit Teams
              </button>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="mb-3 text-base font-bold text-slate-900">Team A</h3>
                  {displayedTeamA.length === 0 ? (
                    <p className="text-sm text-slate-500">No players assigned.</p>
                  ) : (
                    <ul className="space-y-2">
                      {displayedTeamA.map((player) => (
                        <li key={player._id || player} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
                          {player.username || player}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="mb-3 text-base font-bold text-slate-900">Team B</h3>
                  {displayedTeamB.length === 0 ? (
                    <p className="text-sm text-slate-500">No players assigned.</p>
                  ) : (
                    <ul className="space-y-2">
                      {displayedTeamB.map((player) => (
                        <li key={player._id || player} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
                          {player.username || player}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5 pt-2">
              <button type="button" onClick={handleRandomTeams} className="secondary-button">
                🎲 Random Teams
              </button>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="mb-3 text-base font-bold text-slate-900">Team A ({teamA.length})</h3>
                  <div className="space-y-2">
                    {teamA.map((playerId) => {
                      const player = following.find((onePlayer) => onePlayer._id === playerId);
                      const bookedPlayer = displayedTeamA.find((onePlayer) => onePlayer._id === playerId) || displayedTeamB.find((onePlayer) => onePlayer._id === playerId);
                      return (
                        <div key={playerId} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
                          <span className="text-sm font-medium text-slate-700">{player?.username || bookedPlayer?.username || playerId}</span>
                          <button type="button" onClick={() => movePlayer(playerId, "teamA")} className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300">
                            Remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="mb-3 text-base font-bold text-slate-900">Team B ({teamB.length})</h3>
                  <div className="space-y-2">
                    {teamB.map((playerId) => {
                      const player = following.find((onePlayer) => onePlayer._id === playerId);
                      const bookedPlayer = displayedTeamA.find((onePlayer) => onePlayer._id === playerId) || displayedTeamB.find((onePlayer) => onePlayer._id === playerId);
                      return (
                        <div key={playerId} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
                          <span className="text-sm font-medium text-slate-700">{player?.username || bookedPlayer?.username || playerId}</span>
                          <button type="button" onClick={() => movePlayer(playerId, "teamB")} className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300">
                            Remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="mb-3 text-base font-bold text-slate-900">Move players</h3>
                <div className="space-y-2">
                  {[...displayedTeamA, ...displayedTeamB].map((player) => {
                    const playerId = player._id || player;
                    const playerName = player.username || player;
                    return (
                      <div key={playerId} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
                        <span className="text-sm font-medium text-slate-700">{playerName}</span>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => movePlayer(playerId, "teamA")} className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300">Team A</button>
                          <button type="button" onClick={() => movePlayer(playerId, "teamB")} className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300">Team B</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={handleSaveTeams} disabled={teamA.length === 0 || teamB.length === 0 || savingTeams} className="primary-button">
                  {savingTeams ? "Saving..." : "Save Teams"}
                </button>
                <button type="button" onClick={() => { setTeamA(displayedTeamA.map((player) => (typeof player === "object" ? player._id : player))); setTeamB(displayedTeamB.map((player) => (typeof player === "object" ? player._id : player))); setEditingTeams(false); }} className="secondary-button">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {error && booking && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default BookingDetailsPage;