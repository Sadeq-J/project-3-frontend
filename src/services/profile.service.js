import api from './api'

async function getProfile() {
  try {
    const response = await api.get('/profile/me')
    return response.data
  } catch (error) {
    console.error('Error fetching profile:', error)
    throw error
  }
}

async function getUserProfile(userId) {
  try {
    const response = await api.get(`/profile/${userId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw error
  }
}

async function followUser(targetUserId) {
  try {
    const response = await api.post('/profile/follow', { targetUserId })
    return response.data
  } catch (error) {
    console.error('Error following user:', error)
    throw error
  }
}

async function unfollowUser(targetUserId) {
  try {
    const response = await api.post('/profile/unfollow', { targetUserId })
    return response.data
  } catch (error) {
    console.error('Error unfollowing user:', error)
    throw error
  }
}

async function getFollowers() {
  try {
    const response = await api.get(`/profile/followers`)
    return response.data
  } catch (error) {
    console.error('Error fetching followers:', error)
    throw error
  }
}

async function getFollowing() {
  try {
    const response = await api.get(`/profile/following`)
    return response.data
  } catch (error) {
    console.error('Error fetching following:', error)
    throw error
  }
}

async function getAllProfiles() {
  try {
    const response = await api.get('/profile')
    return response.data
  } catch (error) {
    console.error('Error fetching all profiles:', error)
    throw error
  }
}

async function updateProfile(profileData) {
  try {
    const response = await api.put('/profile', profileData)
    return response.data
  } catch (error) {
    console.error('Error updating profile:', error)
    throw error
  }
}

export default {
  getProfile,
  getUserProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getAllProfiles,
  updateProfile,
}