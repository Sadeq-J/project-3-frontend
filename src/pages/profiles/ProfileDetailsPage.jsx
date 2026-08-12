import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import {
  getProfile,
  getUserProfile,
  followUser,
  unfollowUser,
} from "../../services/profileService";

function ProfileDetailsPage() {
  const { id } = useParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const [data, currentUser] = await Promise.all([
          getUserProfile(id),
          getProfile(),
        ]);

        setProfile(data);

        const followingList = currentUser?.following || [];
        const alreadyFollowing = followingList.some(
          (user) => (user._id || user).toString() === id.toString()
        );

        setIsFollowing(alreadyFollowing);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(
          error.response?.data?.error || "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleFollow = async () => {
    try {
      setFollowLoading(true);

      if (isFollowing) {
        await unfollowUser(id);

        setIsFollowing(false);
        setProfile((prevProfile) => ({
          ...prevProfile,
          followers: prevProfile.followers.filter(
            (follower) => follower._id !== id
          ),
        }));
      } else {
        await followUser(id);

        setIsFollowing(true);
        setProfile((prevProfile) => ({
          ...prevProfile,
          followers: [
            ...(prevProfile.followers || []),
          ],
        }));
      }
    } catch (error) {
      console.error("Error updating follow:", error);
      setError(
        error.response?.data?.error || "Failed to update follow status"
      );
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error && !profile) {
    return <p>{error}</p>;
  }

  if (!profile) {
    return <p>Profile not found.</p>;
  }

  const followers = profile.followers || [];
  const following = profile.following || [];

  return (
    <div className="profile-details-page">
      <div className="profile-header">
        <img
          src={profile.profilePicture}
          alt={`${profile.username}'s profile`}
          width="120"
          height="120"
        />

        <h1>{profile.username}</h1>

        <button
          type="button"
          onClick={handleFollow}
          disabled={followLoading}
        >
          {followLoading
            ? "Loading..."
            : isFollowing
              ? "Unfollow"
              : "Follow"}
        </button>
      </div>

      <div
        className="profile-stats"
        style={{ display: "flex", gap: "20px", margin: "20px 0" }}
      >
        <button
          type="button"
          onClick={() => {
            setShowFollowers(!showFollowers);
            setShowFollowing(false);
          }}
        >
          Followers {followers.length}
        </button>

        <button
          type="button"
          onClick={() => {
            setShowFollowing(!showFollowing);
            setShowFollowers(false);
          }}
        >
          Following {following.length}
        </button>
      </div>

      {showFollowers && (
        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            marginBottom: "20px",
          }}
        >
          <h2>Followers</h2>

          {followers.length === 0 ? (
            <p>No followers yet.</p>
          ) : (
            followers.map((follower) => (
              <div
                key={follower._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
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
                  {follower.username}
                </Link>
              </div>
            ))
          )}
        </div>
      )}

      {showFollowing && (
        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            marginBottom: "20px",
          }}
        >
          <h2>Following</h2>

          {following.length === 0 ? (
            <p>Not following anyone.</p>
          ) : (
            following.map((followingUser) => (
              <div
                key={followingUser._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
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
                  {followingUser.username}
                </Link>
              </div>
            ))
          )}
        </div>
      )}

      {error && <p>{error}</p>}
    </div>
  );
}

export default ProfileDetailsPage;