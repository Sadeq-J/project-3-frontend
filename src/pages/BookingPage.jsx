import { useState, useEffect } from "react";
import { createBooking } from "../services/bookingService";
import { getFollowing, getProfile, getAllProfiles } from "../services/profileService";
import Select from "react-select";
import { useParams, useNavigate } from "react-router";
import BookingCalendar from "../components/BookingCalendar";
import Formation from "../components/Formation";
import { getVenueById } from "../services/venueService";

function BookingPage() {
  const [formData, setFormData] = useState({
    date: "",
    timeSlots: "",
    status: "Confirmed",
    teamName: "",
    opponentTeamName: "",
    matchRequestNote: "",
    invitedPlayers: [],
    teams: { teamA: [], teamB: [] },
  });

  const [following, setFollowing] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [venue, setVenue] = useState(null);
  const [showFormation, setShowFormation] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  const isFootball = venue?.sportType?.some((sport) => sport.toLowerCase() === "football");

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const data = await getFollowing();
        setFollowing(data);
      } catch (error) {
        console.error("Error fetching following:", error);
      }
    };

    const fetchAllUsers = async () => {
      try {
        const data = await getAllProfiles();
        setAllUsers(data || []);
      } catch (error) {
        console.error("Error fetching all users:", error);
      }
    };

    const fetchVenue = async () => {
      try {
        const data = await getVenueById(id);
        setVenue(data);
      } catch (error) {
        console.error("Error fetching venue:", error);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const data = await getProfile();
        setCurrentUser(data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchFollowing();
    fetchAllUsers();
    fetchVenue();
    fetchCurrentUser();
  }, [id]);

  function handleInvitedPlayersChange(selectedOptions) {
    const invitedPlayers = selectedOptions ? selectedOptions.map((option) => option.value) : [];

    setFormData((prev) => ({
      ...prev,
      invitedPlayers,
      teams: {
        teamA: prev.teams.teamA.filter((playerId) => invitedPlayers.includes(playerId)),
        teamB: prev.teams.teamB.filter((playerId) => invitedPlayers.includes(playerId)),
      },
    }));
  }

  const allSelectableUsers = allUsers.filter((user) => user._id !== currentUser?._id);

  const formationPlayers = currentUser
    ? [currentUser, ...allSelectableUsers.filter((player) => player._id !== currentUser._id)]
    : allSelectableUsers;

  const formationInvitedPlayers = currentUser
    ? [currentUser._id, ...formData.invitedPlayers.filter((playerId) => playerId !== currentUser._id)]
    : formData.invitedPlayers;

  const handleOpenFormation = () => {
    if (!currentUser && !formData.invitedPlayers.length) return;
    setShowFormation(true);
  };

  const handleFormationSave = ({ teamA, teamB }) => {
    if (teamA.length === 0 || teamB.length === 0) return;

    setFormData((prev) => ({
      ...prev,
      teams: { teamA, teamB },
    }));

    setShowFormation(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.timeSlots) return;
    setShowPayment(true);
  };

  const handleFakePayment = async (e) => {
    e.preventDefault();
    if (!cardNumber || !cardName || !expiry || !cvv) return;

    try {
      await createBooking(id, formData);
      setPaymentSuccess(true);
      setShowPayment(false);
      navigate("/my-profile");
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 py-8">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Reservation</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">{venue?.name || "Book Venue"}</h1>
          </div>
          {venue && <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{venue.location}</span>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {venue && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <BookingCalendar
                id={id}
                venue={venue}
                onBookingChange={(bookingData) => {
                  setFormData((prev) => ({ ...prev, ...bookingData }));
                }}
              />
            </div>
          )}

          {isFootball && (
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="teamName" className="mb-2 block text-sm font-semibold text-slate-700">Your team name</label>
                  <input
                    id="teamName"
                    type="text"
                    value={formData.teamName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, teamName: e.target.value }))}
                    placeholder="FC Riyadh"
                    className="field-input"
                  />
                </div>

                <div>
                  <label htmlFor="opponentTeamName" className="mb-2 block text-sm font-semibold text-slate-700">Opponent team</label>
                  <input
                    id="opponentTeamName"
                    type="text"
                    value={formData.opponentTeamName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, opponentTeamName: e.target.value }))}
                    placeholder="Bahrain FC"
                    className="field-input"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="matchRequestNote" className="mb-2 block text-sm font-semibold text-slate-700">Match request note</label>
                <textarea
                  id="matchRequestNote"
                  value={formData.matchRequestNote}
                  onChange={(e) => setFormData((prev) => ({ ...prev, matchRequestNote: e.target.value }))}
                  placeholder="Friendly match, want a competitive 11-a-side game."
                  className="field-input"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Search players</label>
                <Select
                  isMulti
                  name="invitedPlayers"
                  options={allSelectableUsers.map((player) => ({ value: player._id, label: player.username }))}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={handleInvitedPlayersChange}
                  placeholder="Search all users by username"
                  isSearchable
                  closeMenuOnSelect={false}
                />
              </div>

              {(formData.invitedPlayers.length > 0 || currentUser) && (
                <button type="button" onClick={handleOpenFormation} className="secondary-button">
                  Build lineup / choose formation
                </button>
              )}

              {showFormation && (
                <Formation
                  players={formationPlayers}
                  invitedPlayers={formationInvitedPlayers}
                  onSave={handleFormationSave}
                />
              )}
            </div>
          )}

          <input type="hidden" name="status" value="Confirmed" />

          <div className="flex justify-end">
            <button type="submit" className="primary-button w-full sm:w-auto">
              Continue to Payment
            </button>
          </div>
        </form>
      </div>

      {showPayment && (
        <div className="mx-auto max-w-xl rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Secure checkout</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">Complete your booking</h2>
            <p className="mt-2 text-sm text-slate-600">Demo payment only — no real card will be charged.</p>
          </div>

          <div className="mb-6 rounded-2xl bg-slate-900 p-5 text-white shadow-lg shadow-slate-900/15">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-lg font-black tracking-[0.2em]">PLAYHUB</span>
              <span className="rounded-full bg-white/10 px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em]">Visa</span>
            </div>
            <div className="mb-6 text-2xl font-medium tracking-[0.22em] text-slate-100">{cardNumber || "•••• •••• •••• ••••"}</div>
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-slate-300">
              <div>
                <p>Card Holder</p>
                <p className="mt-1 text-sm font-semibold tracking-[0.12em] text-white">{cardName || "YOUR NAME"}</p>
              </div>
              <div className="text-right">
                <p>Expires</p>
                <p className="mt-1 text-sm font-semibold tracking-[0.12em] text-white">{expiry || "MM/YY"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="card-number" className="mb-2 block text-sm font-semibold text-slate-700">Card Number</label>
              <input
                id="card-number"
                type="text"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="8734 1234 5678 9012"
                value={cardNumber}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
                  const formatted = digits.replace(/(.{4})/g, "$1 ").trim();
                  setCardNumber(formatted);
                }}
                maxLength={19}
                required
                className="field-input"
              />
            </div>

            <div>
              <label htmlFor="card-name" className="mb-2 block text-sm font-semibold text-slate-700">Name on Card</label>
              <input
                id="card-name"
                type="text"
                autoComplete="cc-name"
                placeholder="Cardholder Name"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
                className="field-input"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="expiry" className="mb-2 block text-sm font-semibold text-slate-700">Expiry Date</label>
                <input
                  id="expiry"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                    const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
                    setExpiry(formatted);
                  }}
                  maxLength={5}
                  required
                  className="field-input"
                />
              </div>

              <div>
                <label htmlFor="cvv" className="mb-2 block text-sm font-semibold text-slate-700">CVV</label>
                <input
                  id="cvv"
                  type="password"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  maxLength={4}
                  required
                  className="field-input"
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-sm font-medium text-slate-700">
              <span>Total</span>
              <span className="text-base font-bold text-slate-900">Demo Payment</span>
            </div>

            <div className="space-y-3 pt-2">
              <button type="button" onClick={handleFakePayment} className="primary-button w-full">
                Pay Now
              </button>
              <button type="button" onClick={() => setShowPayment(false)} className="secondary-button w-full">
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {paymentSuccess && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800 shadow-sm">
          <h2 className="text-xl font-bold">✓ Payment Successful</h2>
          <p className="mt-1 text-sm">Your booking has been confirmed.</p>
        </div>
      )}
    </div>
  );
}

export default BookingPage;
