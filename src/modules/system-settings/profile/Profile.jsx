import React, { useEffect, useState } from "react";
import { settingsService } from "../index.js";

export default function Profile() {
  const [profile, setProfile] = useState({ name: "", email: "", avatar: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // reuse settingsService to fetch profile-like settings if available
    // fallback to a simple local shape
    if (settingsService && settingsService.getProfile) {
      settingsService.getProfile().then((p) => p && setProfile(p));
    } else if (settingsService && settingsService.getSettings) {
      settingsService.getSettings().then(
        (s) =>
          s &&
          setProfile({
            name: s.name || "",
            email: s.email || "",
            avatar: s.logo || "",
          })
      );
    }
  }, []);

  async function onSave(e) {
    e.preventDefault();
    setBusy(true);
    try {
      if (settingsService && settingsService.saveProfile) {
        await settingsService.saveProfile(profile);
      } else if (settingsService && settingsService.saveSettings) {
        // try to save into the generic settings store
        await settingsService.saveSettings({
          ...profile,
          logo: profile.avatar,
        });
      }
      alert("Profile saved");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="mb-4">
          <h1 className="text-xl font-semibold">Profile</h1>
          <div className="muted text-sm">
            Manage your account contact and avatar
          </div>
        </div>

        <form className="card p-4 space-y-3" onSubmit={onSave}>
          <label className="block">
            <div className="muted text-sm mb-1">Full name</div>
            <input
              className="input"
              value={profile.name}
              onChange={(e) =>
                setProfile((p) => ({ ...p, name: e.target.value }))
              }
            />
          </label>

          <label className="block">
            <div className="muted text-sm mb-1">Email</div>
            <input
              className="input"
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile((p) => ({ ...p, email: e.target.value }))
              }
            />
          </label>

          <label className="block">
            <div className="muted text-sm mb-1">Avatar URL</div>
            <input
              className="input"
              value={profile.avatar}
              onChange={(e) =>
                setProfile((p) => ({ ...p, avatar: e.target.value }))
              }
            />
          </label>

          <div className="flex items-center gap-2">
            <button className="btn" disabled={busy}>
              {busy ? "Saving…" : "Save"}
            </button>
            {profile.avatar && (
              <img
                src={profile.avatar}
                alt="avatar"
                className="h-8 w-8 rounded-lg"
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
