import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  getProfile,
  getAllProfiles,
  searchUsers,
  followUser,
  unfollowUser,
  updateProfile,
} from "../../services/profileService";
import BasicTabs from "../../components/ProfileTaps";

function MyProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [unfollowingId, setUnfollowingId] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [bioDraft, setBioDraft] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [followersSearch, setFollowersSearch] = useState("");
  const [followingSearch, setFollowingSearch] = useState("");
  const [discoverUsers, setDiscoverUsers] = useState([]);
  const [discoverQuery, setDiscoverQuery] = useState("");
  const [followActionId, setFollowActionId] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setProfile(response);
        setBioDraft(response.bio || "");

        const users = await getAllProfiles();
        setDiscoverUsers((users || []).filter((user) => user._id !== response._id));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (!profile) return;

    const loadDiscoverUsers = async () => {
      try {
        const users = discoverQuery.trim()
          ? await searchUsers(discoverQuery.trim())
          : await getAllProfiles();

        setDiscoverUsers((users || []).filter((user) => user._id !== profile._id));
      } catch (error) {
        console.error("Error searching users:", error);
      }
    };

    loadDiscoverUsers();
  }, [profile, discoverQuery]);

  const handleUnfollow = async (userId) => {
    try {
      setUnfollowingId(userId);
      await unfollowUser(userId);

      setProfile((prevProfile) => ({
        ...prevProfile,
        following: prevProfile.following.filter((user) => user._id !== userId),
      }));
    } catch (error) {
      console.error("Error unfollowing user:", error);
      setError(error.response?.data?.error || "Failed to unfollow user");
    } finally {
      setUnfollowingId(null);
    }
  };

  const handleProfileUpdate = async (event) => {
    event.preventDefault();

    try {
      setSavingProfile(true);
      const formData = new FormData();

      if (bioDraft.trim()) {
        formData.append("bio", bioDraft.trim());
      }

      if (profileImage) {
        formData.append("profilePicture", profileImage);
      }

      const response = await updateProfile(formData);

      setProfile((prev) => ({
        ...prev,
        ...response.user,
        bio: response.user.bio || "",
      }));

      setBioDraft(response.user.bio || "");
      setProfileImage(null);
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.error || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const filteredFollowers = (profile?.followers || []).filter((person) =>
    person.username.toLowerCase().includes(followersSearch.toLowerCase())
  );

  const filteredFollowing = (profile?.following || []).filter((person) =>
    person.username.toLowerCase().includes(followingSearch.toLowerCase())
  );

  const isFollowingUser = (userId) =>
    (profile?.following || []).some((user) => (user._id || user).toString() === userId.toString());

  const handleFollowToggle = async (userId, user) => {
    try {
      setFollowActionId(userId);

      if (isFollowingUser(userId)) {
        await unfollowUser(userId);
        setProfile((prevProfile) => ({
          ...prevProfile,
          following: (prevProfile.following || []).filter(
            (person) => (person._id || person).toString() !== userId.toString()
          ),
        }));
      } else {
        await followUser(userId);
        setProfile((prevProfile) => ({
          ...prevProfile,
          following: [...(prevProfile.following || []), { _id: userId, username: user.username, profilePicture: user.profilePicture }],
        }));
      }
    } catch (error) {
      console.error("Error updating follow status:", error);
      setError(error.response?.data?.error || "Failed to update follow status");
    } finally {
      setFollowActionId(null);
    }
  };

  if (loading) return <div className="py-10 text-center text-sm text-slate-500">Loading profile...</div>;
  if (error) return <div className="py-10 text-center text-sm text-red-500">Error: {error}</div>;
  if (!profile) return null;

  return (
    <div className="space-y-6 py-8">
      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-full bg-slate-200 ring-2 ring-slate-200">
              <img
                src={profile.profilePicture || "https://res.cloudinary.com/dxjv7gq3f/image/upload/v1697040910/default-profile-picture-1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_q6kz8b.png"}
                alt={`${profile.username}'s profile`}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Athlete profile</p>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">{profile.username}</h1>
              <p className="mt-2 max-w-lg text-sm text-slate-600">{profile.bio || "Add a short bio to tell people about your game."}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setIsEditingProfile(true)} className="secondary-button">
              Edit profile
            </button>

            <button
              type="button"
              onClick={() => {
                setShowFollowers(!showFollowers);
                setShowFollowing(false);
              }}
              className="secondary-button"
            >
              Followers {profile.followers.length}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowFollowing(!showFollowing);
                setShowFollowers(false);
              }}
              className="secondary-button"
            >
              Following {profile.following.length}
            </button>
          </div>
        </div>
      </section>

      {isEditingProfile && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Profile photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setProfileImage(event.target.files?.[0] || null)}
                className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
            </div>

            <div>
              <label htmlFor="bio" className="mb-2 block text-sm font-semibold text-slate-700">Bio</label>
              <textarea
                id="bio"
                value={bioDraft}
                onChange={(event) => setBioDraft(event.target.value)}
                rows={4}
                maxLength={250}
                placeholder="Tell people about your game, training, and goals."
                className="field-input"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={savingProfile} className="primary-button">
                {savingProfile ? "Saving..." : "Save profile"}
              </button>
              <button type="button" onClick={() => setIsEditingProfile(false)} className="secondary-button">
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-bold text-slate-900">Discover people</h3>
          <input
            type="text"
            value={discoverQuery}
            onChange={(event) => setDiscoverQuery(event.target.value)}
            placeholder="Search all users"
            className="field-input max-w-xs"
          />
        </div>

        <div className="space-y-3">
          {discoverUsers.filter((user) => user.username.toLowerCase().includes(discoverQuery.toLowerCase())).length === 0 ? (
            <p className="text-sm text-slate-500">No users found.</p>
          ) : (
            discoverUsers
              .filter((user) => user.username.toLowerCase().includes(discoverQuery.toLowerCase()))
              .map((user) => (
                <div key={user._id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <Link to={`/profile/${user._id}`} className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-200">
                      <img src={user.profilePicture} alt={`${user.username}'s profile`} className="absolute inset-0 h-full w-full object-cover" />
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-slate-800">{user.username}</span>
                      {user.bio && <span className="block text-xs text-slate-500">{user.bio}</span>}
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleFollowToggle(user._id, user)}
                    disabled={followActionId === user._id}
                    className={[
                      "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all",
                      isFollowingUser(user._id)
                        ? "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        : "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-500",
                    ].join(" ")}
                  >
                    {followActionId === user._id ? "Loading..." : isFollowingUser(user._id) ? "Following" : "Follow"}
                  </button>
                </div>
              ))
          )}
        </div>
      </section>

      {showFollowers && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-slate-900">Followers</h3>
            <input
              type="text"
              value={followersSearch}
              onChange={(event) => setFollowersSearch(event.target.value)}
              placeholder="Search followers"
              className="field-input max-w-xs"
            />
          </div>
          <div className="space-y-3">
            {filteredFollowers.length === 0 ? (
              <p className="text-sm text-slate-500">No followers match your search.</p>
            ) : (
              filteredFollowers.map((follower) => (
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
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-slate-900">Following</h3>
            <input
              type="text"
              value={followingSearch}
              onChange={(event) => setFollowingSearch(event.target.value)}
              placeholder="Search following"
              className="field-input max-w-xs"
            />
          </div>
          <div className="space-y-3">
            {filteredFollowing.length === 0 ? (
              <p className="text-sm text-slate-500">No followed users match your search.</p>
            ) : (
              filteredFollowing.map((followingUser) => (
                <div key={followingUser._id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <Link to={`/profile/${followingUser._id}`} className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-200">
                      <img src={followingUser.profilePicture} alt={`${followingUser.username}'s profile`} className="absolute inset-0 h-full w-full object-cover" />
                    </div>
                    <span className="text-sm font-semibold text-slate-800">{followingUser.username}</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleUnfollow(followingUser._id)}
                    disabled={unfollowingId === followingUser._id}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {unfollowingId === followingUser._id ? "Unfollowing..." : "Unfollow"}
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      <BasicTabs />
    </div>
  );
}

export default MyProfilePage;
