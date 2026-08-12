import { useState, useEffect } from "react"
import dayjs from "dayjs"

import { getBookingsByVenue } from "../services/bookingService"

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"


function BookingCalendar({ id, venue, onBookingChange }) {

    const [value, setValue] = useState(null)
    const [swimmingPeriod, setSwimmingPeriod] = useState("")
    const [bookings, setBookings] = useState([])

    const isSwimming =
        venue?.sportType?.some((sport) => {
            const type = String(sport).toLowerCase().trim()

            return (
                type === "swimming" ||
                type.includes("swimming") ||
                type.includes("pool")
            )
        })

    console.log("VENUE SPORT TYPE:", venue?.sportType)
    console.log("IS SWIMMING:", isSwimming)


    useEffect(() => {
        if (!id) return

        const fetchBookings = async () => {
            try {
                const data = await getBookingsByVenue(id)

                console.log("VENUE ID:", id)
                console.log("BOOKINGS:", data)

                setBookings(data)
            } catch (error) {
                console.error("Error fetching bookings:", error)
            }
        }

        fetchBookings()
    }, [id])


    const hourlySlots = [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
    ]


    // Swimming
    const swimmingSlots = [
        "Morning",
        "Evening",
    ]


    // Check swimming booking


    const isSwimmingBooked = (date, period) => {

        return bookings.some((booking) => {

            if (booking.status === "Cancelled") {
                return false
            }

            const bookingDate =
                dayjs(booking.date).format(
                    "YYYY-MM-DD"
                )

            return (
                bookingDate ===
                    date.format("YYYY-MM-DD") &&
                booking.timeSlots === period
            )
        })
    }



    // Check hourly booking


    const isTimeBooked = (date, time) => {

        return bookings.some((booking) => {

            if (booking.status === "Cancelled") {
                return false
            }

            const bookingDate =
                dayjs(booking.date).format(
                    "YYYY-MM-DD"
                )

            const bookingTime =
                String(booking.timeSlots)
                    .trim()
                    .substring(0, 5)

            return (
                bookingDate ===
                    date.format("YYYY-MM-DD") &&
                bookingTime === time
            )
        })
    }



    const handleSwimmingDate = (newValue) => {

        setValue(newValue)
        setSwimmingPeriod("")

        if (!newValue) {
            onBookingChange?.(null)
            return
        }

        onBookingChange?.({
            date: newValue.format("YYYY-MM-DD"),
            timeSlots: "",
        })
    }


    const handleSwimmingPeriod = (period) => {

        if (!value) return

        if (isSwimmingBooked(value, period)) {
            return
        }

        setSwimmingPeriod(period)

        onBookingChange?.({
            date: value.format("YYYY-MM-DD"),
            timeSlots: period,
        })
    }



    // Handle football / padel


    const handleHourlyChange = (newValue) => {

        setValue(newValue)

        if (!newValue) {
            onBookingChange?.(null)
            return
        }

        const date =
            newValue.format("YYYY-MM-DD")

        const time =
            newValue.format("HH:mm")


        if (isTimeBooked(newValue, time)) {
            return
        }


        onBookingChange?.({
            date,
            timeSlots: time,
        })
    }



    // UI


    return (

        <LocalizationProvider
            dateAdapter={AdapterDayjs}
        >

            {isSwimming ? (

                <div className="space-y-5">

                    <DatePicker
                        label="Select date"
                        value={value}
                        onChange={handleSwimmingDate}
                        minDate={dayjs()}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                className: "rounded-xl"
                            }
                        }}
                    />

                    {value && swimmingPeriod && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                            Selected: <span className="font-bold">{swimmingPeriod}</span>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                        {swimmingSlots.map((period) => {
                            const booked = value ? isSwimmingBooked(value, period) : false
                            const disabled = !value || booked

                            return (
                                <button
                                    key={period}
                                    type="button"
                                    disabled={disabled}
                                    onClick={() => handleSwimmingPeriod(period)}
                                    className={[
                                        "rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200",
                                        swimmingPeriod === period
                                            ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                                        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                                    ].join(" ")}
                                >
                                    {period === "Morning" ? "☀️ Morning" : "🌙 Evening"}
                                </button>
                            )
                        })}
                    </div>

                </div>

            ) : (

                <DateTimePicker
                    label="Select date & time"
                    value={value}
                    onChange={handleHourlyChange}
                    minDate={dayjs()}

                    shouldDisableTime={(
                        timeValue
                    ) => {

                        if (!value) {
                            return false
                        }

                        const selectedDate =
                            value.format(
                                "YYYY-MM-DD"
                            )

                        const selectedTime =
                            timeValue.format(
                                "HH:mm"
                            )


                        return bookings.some(
                            (booking) => {

                                if (
                                    booking.status ===
                                    "Cancelled"
                                ) {
                                    return false
                                }

                                const bookingDate =
                                    dayjs(
                                        booking.date
                                    ).format(
                                        "YYYY-MM-DD"
                                    )

                                const bookingTime =
                                    String(
                                        booking.timeSlots
                                    )
                                        .trim()
                                        .substring(
                                            0,
                                            5
                                        )


                                return (
                                    bookingDate ===
                                        selectedDate &&
                                    bookingTime ===
                                        selectedTime
                                )

                            }
                        )

                    }}

                    timeSteps={{
                        minutes: 60
                    }}

                    slotProps={{
                        textField: {
                            fullWidth: true
                        }
                    }}
                />

            )}

        </LocalizationProvider>
    )
}


export default BookingCalendar