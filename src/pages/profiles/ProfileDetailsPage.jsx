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
        setError(error.response?.data?.error || "Failed to load profile");
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
          followers: prevProfile.followers.filter((follower) => follower._id !== id),
        }));
      } else {
        await followUser(id);
        setIsFollowing(true);
        setProfile((prevProfile) => ({
          ...prevProfile,
          followers: [...(prevProfile.followers || [])],
        }));
      }
    } catch (error) {
      console.error("Error updating follow:", error);
      setError(error.response?.data?.error || "Failed to update follow status");
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) return <div className="py-10 text-center text-sm text-slate-500">Loading profile...</div>;
  if (error && !profile) return <div className="py-10 text-center text-sm text-red-500">{error}</div>;
  if (!profile) return <div className="py-10 text-center text-sm text-slate-500">Profile not found.</div>;

  const followers = profile.followers || [];
  const following = profile.following || [];

  return (
    <div className="space-y-6 py-8">
      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-full bg-slate-200 ring-2 ring-slate-200">
              <img src={profile.profilePicture} alt={`${profile.username}'s profile`} className="absolute inset-0 h-full w-full object-cover" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Member profile</p>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">{profile.username}</h1>
            </div>
          </div>

          <button
            type="button"
            onClick={handleFollow}
            disabled={followLoading}
            className={[
              "rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200",
              isFollowing ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-emerald-600 text-white hover:bg-emerald-500",
              followLoading ? "cursor-not-allowed opacity-70" : "",
            ].join(" ")}
          >
            {followLoading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
          </button>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            setShowFollowers(!showFollowers);
            setShowFollowing(false);
          }}
          className="secondary-button"
        >
          Followers {followers.length}
        </button>

        <button
          type="button"
          onClick={() => {
            setShowFollowing(!showFollowing);
            setShowFollowers(false);
          }}
          className="secondary-button"
        >
          Following {following.length}
        </button>
      </div>

      {showFollowers && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Followers</h2>
          <div className="space-y-3">
            {followers.length === 0 ? (
              <p className="text-sm text-slate-500">No followers yet.</p>
            ) : (
              followers.map((follower) => (
                <Link key={follower._id} to={`/profile/${follower._id}`} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 transition-all hover:border-slate-300 hover:bg-white">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-200">
                    <img src={follower.profilePicture} alt={`${follower.username}'s profile`} className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{follower.username}</span>
                </Link>
              ))
            )}
          </div>
        </section>
      )}

      {showFollowing && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Following</h2>
          <div className="space-y-3">
            {following.length === 0 ? (
              <p className="text-sm text-slate-500">Not following anyone.</p>
            ) : (
              following.map((followingUser) => (
                <Link key={followingUser._id} to={`/profile/${followingUser._id}`} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 transition-all hover:border-slate-300 hover:bg-white">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-200">
                    <img src={followingUser.profilePicture} alt={`${followingUser.username}'s profile`} className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{followingUser.username}</span>
                </Link>
              ))
            )}
          </div>
        </section>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default ProfileDetailsPage;