import api from './api'

async function createBooking(formData){
    const response = await api.post('/booking',formData)
    return response.data
}

async function getBookings(){
    const response = await api.get('/booking')
    return response.data
}

async function updateBooking(id, formData){
    const response = await api.put(`/booking/${id}`,formData)
    return response.data
}

export {
  createBooking,
  getBookings,
  updateBooking
};