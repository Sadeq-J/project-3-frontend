import React from 'react'
import { useState, useEffect } from 'react'
import { getProfile, unfollowUser } from '../../services/profileService'
import { Link } from 'react-router'
import BasicTabs from '../../components/ProfileTaps'

function MyProfilePage() {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showFollowers, setShowFollowers] = useState(false)
    const [showFollowing, setShowFollowing] = useState(false)
    const [unfollowingId, setUnfollowingId] = useState(null)

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

    const handleUnfollow = async (userId) => {
        try {
            setUnfollowingId(userId)

            await unfollowUser(userId)

            setProfile((prevProfile) => ({
                ...prevProfile,
                following: prevProfile.following.filter(
                    (user) => user._id !== userId
                )
            }))
        } catch (error) {
            console.error('Error unfollowing user:', error)
            setError(error.response?.data?.error || 'Failed to unfollow user')
        } finally {
            setUnfollowingId(null)
        }
    }

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}

            {profile && (
                <div>
                    <img
                        src={profile.profilePicture}
                        alt={`${profile.username}'s profile`}
                    />
                    <h2>{profile.username}</h2>

                    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                        <button
                            type="button"
                            onClick={() => {
                                setShowFollowers(!showFollowers)
                                setShowFollowing(false)
                            }}
                        >
                            Followers {profile.followers.length}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setShowFollowing(!showFollowing)
                                setShowFollowers(false)
                            }}
                        >
                            Following {profile.following.length}
                        </button>
                    </div>

                    {showFollowers && (
                        <div
                            style={{
                                padding: '20px',
                                border: '1px solid #ddd',
                                borderRadius: '12px',
                                marginBottom: '20px'
                            }}
                        >
                            <h3>Followers</h3>

                            {profile.followers.length === 0 ? (
                                <p>No followers yet.</p>
                            ) : (
                                profile.followers.map((follower) => (
                                    <div
                                        key={follower._id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            marginBottom: '10px'
                                        }}
                                    >
                                        <Link to={`/profile/${follower._id}`}>
                                            <img
                                                src={follower.profilePicture}
                                                alt={`${follower.username}'s profile`}
                                                width="40"
                                                height="40"
                                            />
                                        </Link>

                                        <Link to={`/profile/${follower._id}`}>
                                            <h4>{follower.username}</h4>
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {showFollowing && (
                        <div
                            style={{
                                padding: '20px',
                                border: '1px solid #ddd',
                                borderRadius: '12px',
                                marginBottom: '20px'
                            }}
                        >
                            <h3>Following</h3>

                            {profile.following.length === 0 ? (
                                <p>You are not following anyone.</p>
                            ) : (
                                profile.following.map((followingUser) => (
                                    <div
                                        key={followingUser._id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            marginBottom: '10px'
                                        }}
                                    >
                                        <Link to={`/profile/${followingUser._id}`}>
                                            <img
                                                src={followingUser.profilePicture}
                                                alt={`${followingUser.username}'s profile`}
                                                width="40"
                                                height="40"
                                            />
                                        </Link>

                                        <Link to={`/profile/${followingUser._id}`}>
                                            <h4>{followingUser.username}</h4>
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() => handleUnfollow(followingUser._id)}
                                            disabled={unfollowingId === followingUser._id}
                                        >
                                            {unfollowingId === followingUser._id
                                                ? 'Unfollowing...'
                                                : 'Unfollow'}
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    <hr />
                    <BasicTabs />
                </div>
            )}
        </div>
    )
}

export default MyProfilePage