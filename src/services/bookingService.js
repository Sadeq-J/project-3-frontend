import api from './api'




async function createBooking(id, formData){
    const response = await api.post(`/booking/${id}`,formData)
    return response.data
}

async function getMyBookings(){
    const response = await api.get('/booking/my-booking')
    return response.data
}


async function updateBooking(id, formData){
    const response = await api.put(`/booking/${id}`,formData)
    return response.data
}

async function getBookings(){
    const response = await api.get('/booking')
    return response.data
}

const getBookingsByVenue = async (id) => {
    const response = await api.get(`/booking/venue/${id}`)
    return response.data
}

export{
  createBooking,
  getMyBookings,
  updateBooking,
  getBookings,
  getBookingsByVenue
};