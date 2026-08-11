import React from 'react'
import { useState, useEffect } from 'react'
import { getProfile } from '../../services/profileService'
import { Link } from 'react-router'
import BasicTabs from '../../components/ProfileTaps'
function MyProfilePage() {
    const [profile, setProfile] = useState(null)
    const [ loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchProfile = async () => {
        try {
            const response = await getProfile()
            setProfile(response)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
        }

        fetchProfile()
    }, [])

  return (
    <div>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {profile && (
            <div>
                <img src={profile.profilePicture} alt={`${profile.username}'s profile`} />
                <h2>{profile.username}</h2>
                
                <div className="hidden">
                    <h3>Followers</h3>

                        {profile.followers.map(follower => (
                            <div key={follower._id}>
                                <img src={follower.profilePicture} alt={`${follower.username}'s profile`} />
                                <h4 to={`/profile/${follower._id}`}>{follower.username}</h4>
                            </div>
                        ))}
                </div>
                <div className="hidden">
                    <h3>Following</h3>
                        {profile.following.map(following => (
                            <div key={following._id}>
                                <img src={following.profilePicture} alt={`${following.username}'s profile`} />
                                <h4 to={`/profile/${following._id}`}>{following.username}</h4>
                            </div>
                        ))}
                </div>
                <hr />  
                <BasicTabs />              
            </div>
        )}
    </div>
  )
}

export default MyProfilePage