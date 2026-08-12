import { useState, useEffect } from "react"
import { createBooking } from "../services/bookingService"
import { getFollowing, getProfile } from "../services/profileService"
import Select from "react-select"
import { useParams, useNavigate } from "react-router"
import BookingCalendar from "../components/BookingCalendar"
import Formation from "../components/Formation"
import { getVenueById } from "../services/venueService"

function BookingPage() {
  const [formData, setFormData] = useState({
    date: "",
    timeSlots: "",
    status: "Confirmed",
    invitedPlayers: [],
    teams: {
      teamA: [],
      teamB: [],
    },
  })

  const [following, setFollowing] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [venue, setVenue] = useState(null)

  const [showFormation, setShowFormation] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")

  const { id } = useParams()
  const navigate = useNavigate()

  const isFootball = venue?.sportType?.some(
    (sport) => sport.toLowerCase() === "football"
  )

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const data = await getFollowing()
        setFollowing(data)
      } catch (error) {
        console.error("Error fetching following:", error)
      }
    }

    const fetchVenue = async () => {
      try {
        const data = await getVenueById(id)
        setVenue(data)
      } catch (error) {
        console.error("Error fetching venue:", error)
      }
    }

    const fetchCurrentUser = async () => {
      try {
        const data = await getProfile()
        setCurrentUser(data)
      } catch (error) {
        console.error("Error fetching current user:", error)
      }
    }

    fetchFollowing()
    fetchVenue()
    fetchCurrentUser()
  }, [id])

  function handleInvitedPlayersChange(selectedOptions) {
    const invitedPlayers = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : []

    setFormData((prev) => ({
      ...prev,
      invitedPlayers,
      teams: {
        teamA: prev.teams.teamA.filter((playerId) =>
          invitedPlayers.includes(playerId)
        ),
        teamB: prev.teams.teamB.filter((playerId) =>
          invitedPlayers.includes(playerId)
        ),
      },
    }))
  }

  const formationPlayers = currentUser
    ? [
        currentUser,
        ...following.filter(
          (player) => player._id !== currentUser._id
        ),
      ]
    : following

  const formationInvitedPlayers = currentUser
    ? [
        currentUser._id,
        ...formData.invitedPlayers.filter(
          (playerId) => playerId !== currentUser._id
        ),
      ]
    : formData.invitedPlayers

  const handleOpenFormation = () => {
    if (!currentUser && !formData.invitedPlayers.length) {
      return
    }

    setShowFormation(true)
  }

  const handleFormationSave = ({ teamA, teamB }) => {
    if (teamA.length === 0 || teamB.length === 0) {
      return
    }

    setFormData((prev) => ({
      ...prev,
      teams: {
        teamA,
        teamB,
      },
    }))

    setShowFormation(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.date || !formData.timeSlots) {
      return
    }

    if (isFootball) {
      if (
        formData.teams.teamA.length === 0 ||
        formData.teams.teamB.length === 0
      ) {
        return
      }
    }

    setShowPayment(true)
  }

  const handleFakePayment = async (e) => {
    e.preventDefault()

    if (!cardNumber || !cardName || !expiry || !cvv) {
      return
    }

    try {

      await createBooking(id, formData)

      setPaymentSuccess(true)
      setShowPayment(false)
      navigate("/my-profile")
    } catch (error) {
      console.error("Error creating booking:", error)
    }
  }

  return (
    <div>
      <h1>Booking Page</h1>

      <form onSubmit={handleSubmit}>
        {venue && (
          <BookingCalendar
            id={id}
            venue={venue}
            onBookingChange={(bookingData) => {
              setFormData((prev) => ({
                ...prev,
                ...bookingData,
              }))
            }}
          />
        )}

        {isFootball ? (
          <>
            <div className="user-box">
              <Select
                isMulti
                name="invitedPlayers"
                options={following.map((player) => ({
                  value: player._id,
                  label: player.username,
                }))}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleInvitedPlayersChange}
              />
            </div>

            {(formData.invitedPlayers.length > 0 || currentUser) && (
              <button
                type="button"
                onClick={handleOpenFormation}
              >
                Choose Formation
              </button>
            )}

            {showFormation && (
              <Formation
                players={formationPlayers}
                invitedPlayers={formationInvitedPlayers}
                onSave={handleFormationSave}
              />
            )}
          </>
        ) : null}

        <input type="hidden" name="status" value="Confirmed" />

        <button type="submit">Continue to Payment</button>
      </form>

      {showPayment && (
        <div
          style={{
            marginTop: "30px",
            maxWidth: "520px",
            padding: "24px",
            border: "1px solid #ddd",
            borderRadius: "18px",
            background: "#fff",
          }}
        >
          <div style={{ marginBottom: "22px" }}>
            <h2 style={{ marginBottom: "6px" }}>Secure Checkout</h2>
            <p style={{ margin: 0, color: "#666" }}>
              Enter your card details to complete your booking.
            </p>
            <small style={{ color: "#888" }}>
              Demo payment only — no real card will be charged.
            </small>
          </div>

          <div
            style={{
              padding: "18px",
              marginBottom: "22px",
              borderRadius: "14px",
              background: "#111",
              color: "#fff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "28px",
              }}
            >
              <strong>PLAYHUB</strong>
              <span>VISA</span>
            </div>

            <div
              style={{
                fontSize: "20px",
                letterSpacing: "2px",
                marginBottom: "22px",
              }}
            >
              {cardNumber || "•••• •••• •••• ••••"}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "13px",
              }}
            >
              <div>
                <div style={{ opacity: 0.7 }}>CARD HOLDER</div>
                <strong>{cardName || "YOUR NAME"}</strong>
              </div>
              <div>
                <div style={{ opacity: 0.7 }}>EXPIRES</div>
                <strong>{expiry || "MM/YY"}</strong>
              </div>
            </div>
          </div>

          <form onSubmit={handleFakePayment}>
            <div style={{ marginBottom: "16px" }}>
              <label htmlFor="card-number">Card Number</label>
              <input
                id="card-number"
                type="text"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="8734 1234 5678 9012"
                value={cardNumber}
                onChange={(e) => {
                  const digits = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 16)
                  const formatted = digits.replace(/(.{4})/g, "$1 ").trim()
                  setCardNumber(formatted)
                }}
                maxLength={19}
                required
                style={{ width: "100%", padding: "12px", marginTop: "6px" }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label htmlFor="card-name">Name on Card</label>
              <input
                id="card-name"
                type="text"
                autoComplete="cc-name"
                placeholder="Cardholder Name"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
                style={{ width: "100%", padding: "12px", marginTop: "6px" }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px",
                marginBottom: "20px",
              }}
            >
              <div>
                <label htmlFor="expiry">Expiry Date</label>
                <input
                  id="expiry"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => {
                    const digits = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 4)
                    const formatted =
                      digits.length > 2
                        ? `${digits.slice(0, 2)}/${digits.slice(2)}`
                        : digits
                    setExpiry(formatted)
                  }}
                  maxLength={5}
                  required
                  style={{ width: "100%", padding: "12px", marginTop: "6px" }}
                />
              </div>

              <div>
                <label htmlFor="cvv">CVV</label>
                <input
                  id="cvv"
                  type="password"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) =>
                    setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  maxLength={4}
                  required
                  style={{ width: "100%", padding: "12px", marginTop: "6px" }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 0",
                borderTop: "1px solid #eee",
                marginBottom: "16px",
              }}
            >
              <span>Total</span>
              <strong>Demo Payment</strong>
            </div>

            <button type="submit" style={{ width: "100%", padding: "13px" }}>
              Pay Now
            </button>

            <button
              type="button"
              onClick={() => setShowPayment(false)}
              style={{ width: "100%", padding: "11px", marginTop: "10px" }}
            >
              Back
            </button>
          </form>
        </div>
      )}

      {paymentSuccess && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #ccc",
          }}
        >
          <h2>✓ Payment Successful</h2>
          <p>Your booking has been confirmed.</p>
        </div>
      )}
    </div>
  )
}

export default BookingPage
