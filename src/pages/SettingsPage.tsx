import React, { useEffect, useState, useRef } from "react";
import {
  FaUser,
  FaEnvelope,
  FaUserShield,
  FaBell,
  FaTrashAlt,
} from "react-icons/fa";

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
  const [name, setName] = useState(
    () => localStorage.getItem("df_profile_name") || "Alex Hartman"
  );
  const [email, setEmail] = useState(
    () => localStorage.getItem("df_profile_email") || "alex.hartman@example.com"
  );
  const [role, setRole] = useState(
    () => localStorage.getItem("df_profile_role") || "Submitter"
  );
  const [notify, setNotify] = useState(
    () => localStorage.getItem("df_profile_email_notify") === "1"
  );
  const [avatar, setAvatar] = useState<string | null>(
    () => localStorage.getItem("df_profile_avatar") || null
  );
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    localStorage.setItem("df_profile_name", name);
    localStorage.setItem("df_profile_email", email);
    localStorage.setItem("df_profile_role", role);
    localStorage.setItem("df_profile_email_notify", notify ? "1" : "0");
    if (avatar) localStorage.setItem("df_profile_avatar", avatar);
  }, [name, email, role, notify, avatar]);

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
    showToast("Profile saved");
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
                  <div className="avatar-placeholder">AH</div>
                )}
              </div>
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
                    localStorage.removeItem("df_profile_avatar");
                    showToast("Avatar removed");
                  }}
                >
                  Remove Avatar
                </button>
                <button className="btn-primary" type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
