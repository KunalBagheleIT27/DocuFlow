import React, { useEffect, useState, useRef } from "react";
import {
  FaUser,
  FaEnvelope,
  FaUserShield,
  FaBell,
  FaTrashAlt,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const ROLES = ["Submitter", "Reviewer", "Approver", "Administrator"];

const DEFAULT_AVATAR =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'>
    <rect width='100%' height='100%' rx='12' fill='%2312151a' />
    <g fill='%237b8794' font-family='Arial, Helvetica, sans-serif' font-size='40' text-anchor='middle'>
      <text x='50%' y='56%' dy='.35em'>AH</text>
    </g>
  </svg>`
  );

export default function SettingsPage() {
  const { user } = useAuth();

  // profile keys are stored per-username when available: df_profile_<username>_*
  const profileKey = user ? `df_profile_${user.username}` : null;

  const read = (field: string, fallback = "") => {
    if (profileKey) {
      const v = localStorage.getItem(`${profileKey}_${field}`);
      if (v != null) return v;
    }
    const global = localStorage.getItem(`df_profile_${field}`);
    return global ?? fallback;
  };

  // Start with empty values and populate from logged-in user (no defaults)
  const [name, setName] = useState(() => read("name", user?.displayName || user?.username || ""));
  const [email, setEmail] = useState(() => read("email", user ? `${user.username}@example.com` : ""));
  const [role, setRole] = useState(() => read("role", (user?.role as string) || ""));
  const [notify, setNotify] = useState(() => read("email_notify", "0") === "1");
  const [avatar, setAvatar] = useState<string | null>(() => read("avatar", null) || null);
  const [createdAt, setCreatedAt] = useState(() => {
    if (profileKey) return localStorage.getItem(`${profileKey}_created_at`) || new Date().toISOString();
    return localStorage.getItem("df_profile_created_at") || new Date().toISOString();
  });
  const [lastSeen, setLastSeen] = useState(() => {
    if (profileKey) return localStorage.getItem(`${profileKey}_last_seen`) || new Date().toISOString();
    return localStorage.getItem("df_profile_last_seen") || new Date().toISOString();
  });
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // persist to per-user keys when user is logged in; otherwise fallback to global keys
    const setKey = (key: string, value: string | null) => {
      if (profileKey) {
        if (value === null) localStorage.removeItem(`${profileKey}_${key}`);
        else localStorage.setItem(`${profileKey}_${key}`, value);
      } else {
        if (value === null) localStorage.removeItem(`df_profile_${key}`);
        else localStorage.setItem(`df_profile_${key}`, value);
      }
    };

    setKey("name", name || null);
    setKey("email", email || null);
    setKey("role", role || null);
    setKey("email_notify", notify ? "1" : "0");
    setKey("avatar", avatar || null);

    // ensure createdAt exists for this profile
    if (profileKey) {
      if (!localStorage.getItem(`${profileKey}_created_at`)) {
        localStorage.setItem(`${profileKey}_created_at`, createdAt);
      }
    } else if (!localStorage.getItem("df_profile_created_at")) {
      localStorage.setItem("df_profile_created_at", createdAt);
    }
  }, [name, email, role, notify, avatar, profileKey, createdAt]);

  // When user logs in, populate form with their profile (per-user storage)
  useEffect(() => {
    if (!user) return;
    const pk = `df_profile_${user.username}`;
    const pName = localStorage.getItem(`${pk}_name`) ?? user.displayName ?? user.username;
    const pEmail = localStorage.getItem(`${pk}_email`) ?? `${user.username}@example.com`;
    const pRole = localStorage.getItem(`${pk}_role`) ?? user.role;
    const pNotify = (localStorage.getItem(`${pk}_email_notify`) ?? "0") === "1";
    const pAvatar = localStorage.getItem(`${pk}_avatar`);
    const pCreated = localStorage.getItem(`${pk}_created_at`);
    const pLastSeen = localStorage.getItem(`${pk}_last_seen`);

    setName(pName);
    setEmail(pEmail);
    setRole(pRole);
    setNotify(pNotify);
    setAvatar(pAvatar);
    if (pCreated) setCreatedAt(pCreated);
    if (pLastSeen) setLastSeen(pLastSeen);
  }, [user]);

  function onChooseAvatar() {
    fileRef.current?.click();
  }

  function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(f);
  }

  async function save() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 350));
    setSaving(false);
    const now = new Date().toISOString();
    setLastSeen(now);
    if (profileKey) localStorage.setItem(`${profileKey}_last_seen`, now);
    else localStorage.setItem("df_profile_last_seen", now);
    // update the global logged-in user so header and other places reflect changes
    if (user) {
      const updated = { ...user, displayName: name, role: (role as any) };
      localStorage.setItem("docuflow_user", JSON.stringify(updated));
      try {
        window.dispatchEvent(new Event("docuflow:user-updated"));
      } catch (e) {}
    }
  // show confirmation toast
  showToast("Updated successfully");
  }

  function showToast(msg: string) {
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add("visible"), 10);
    setTimeout(() => {
      t.classList.remove("visible");
      setTimeout(() => t.remove(), 300);
    }, 2500);
  }

  return (
    <div className="container">
      <div className="card settings-card">
        <div className="settings-grid">
          <aside className="settings-aside">
            <div className="avatar-wrap">
              <div className="avatar-frame">
                {avatar ? (
                  <img src={avatar} alt="avatar" className="avatar" />
                ) : (
                  <div className="avatar-placeholder">
                    {name
                      .split(" ")
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>
                )}
              </div>
              <div className="avatar-meta">
                <div style={{fontWeight:700, fontSize:16}}>{name}</div>
                <div className="role-badge">{role}</div>
                <div className="small-hint">Member since {new Date(createdAt).toLocaleDateString()}</div>
                <div className="small-hint">Last active: {new Date(lastSeen).toLocaleString()}</div>
                <div className="avatar-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={onChooseAvatar}
                  >
                    Change
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={onAvatarChange}
                  />
                </div>
              </div>
            </div>
          </aside>

          <section className="settings-main">
            <header className="settings-header">
              <h2>Profile Settings</h2>
              <p className="subtitle">Personal information and preferences</p>
            </header>

            <form
              className="settings-form"
              onSubmit={(e) => {
                e.preventDefault();
                save();
              }}
            >
              <div className="form-row">
                <div className="form-col">
                  <label className="subtitle">Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-col">
                  <label className="subtitle">Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row" style={{ alignItems: "center" }}>
                <div className="form-col">
                  <label className="subtitle">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-col form-notify">
                  <label className="subtitle">Notifications</label>
                  <div className="notify-row">
                    <div className="hint">
                      Email notifications for workflow updates
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={notify}
                        onChange={(e) => setNotify(e.target.checked)}
                      />
                      <span className="slider" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                    onClick={() => {
                    setAvatar(null);
                    if (profileKey) localStorage.removeItem(`${profileKey}_avatar`);
                    else localStorage.removeItem("df_profile_avatar");
                    showToast("Avatar removed successfully");
                  }}
                >
                  Remove Avatar
                </button>
                <button className="btn-primary" type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
