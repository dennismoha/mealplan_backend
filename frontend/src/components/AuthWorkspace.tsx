import { ProfileFields, ProfileEditor, profileDraft, profileBody } from "./ProfessionalProfileForm";
import type { SessionUser } from "../features/auth/authSlice";
import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import type { RootState } from "../store";
import { clearCredentials, setCredentials } from "../features/auth/authSlice";
import {
  useCreateUserMutation,
  useGetUsersQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateUserMutation,
} from "../features/auth/authApi";

export function AuthGate({ register = false }: { register?: boolean }) {
  return (
    <main className="auth-gate">
      <div className="auth-gate-copy">
        <Link className="brand" to="/" aria-label="Plateful home">
          <span className="brand-mark">P</span>
          <span>plateful</span>
        </Link>
        <span className="eyebrow">Meal planning, made personal</span>
        <h1>
          {register ? (
            <>
              Join the table.
              <br />
              Make it yours.
            </>
          ) : (
            <>
              Welcome back.
              <br />
              Your table awaits.
            </>
          )}
        </h1>
        <p>
          {register
            ? "Create a free account to follow meal plans. Professional access can be assigned by an administrator."
            : "Sign in to continue to your professional or administration workspace."}
        </p>
        <p className="auth-route-switch">
          {register ? (
            <>
              Already registered? <Link to="/signin">Sign in</Link>
            </>
          ) : (
            <>
              New to Plateful? <Link to="/register">Create an account</Link>
            </>
          )}
        </p>
      </div>
      <div className="auth-inline">
        <AuthModal
          close={() => undefined}
          initialRegistering={register}
          fixedMode
          embedded
        />
      </div>
    </main>
  );
}

export function AccountButton() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [logout] = useLogoutMutation();
  if (!user)
    return (
      <Link className="account-button" to="/signin">
        Sign in
      </Link>
    );
  const dashboard =
    user.role === "admin"
      ? "/admin"
      : user.role === "professional"
        ? "/professional"
        : "/";
  return (
    <>
      <button className="account-button signed" onClick={() => setOpen(true)}>
        <span>{user.email.slice(0, 1).toUpperCase()}</span>
        <div>
          <strong>{user.email}</strong>
          <small>{user.role}</small>
        </div>
      </button>
      {open && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="modal compact">
            <button className="close" onClick={() => setOpen(false)}>
              ×
            </button>
            <span className="eyebrow">Your workspace</span>
            <h2>
              {user.role === "admin"
                ? "Administrator"
                : user.role === "professional"
                  ? "Meal professional"
                  : "Member"}
            </h2>
            <p className="modal-copy">Signed in as {user.email}</p>
            {user.role !== "user" && (
              <a className="primary workspace-link" href={dashboard}>
                Open dashboard
              </a>
            )}
            <button
              className="danger"
              onClick={async () => {
                await logout();
                dispatch(clearCredentials());
                setOpen(false);
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function AuthModal({
  close,
  initialRegistering = false,
  fixedMode = false,
  embedded = false,
}: {
  close: () => void;
  initialRegistering?: boolean;
  fixedMode?: boolean;
  embedded?: boolean;
}) {
  const [registering, setRegistering] = useState(initialRegistering);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading: l }] = useLoginMutation();
  const [register, { isLoading: r }] = useRegisterMutation();
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const result = registering
        ? await register({
            userEmail: email,
            password,
            confirm_password: password,
          }).unwrap()
        : await login({ userEmail: email, password }).unwrap();
      dispatch(setCredentials(result));
      close();
      // Navigate to appropriate dashboard based on role
      const redirectPath = 
        result.user.role === "admin" ? "/admin" :
        result.user.role === "professional" ? "/professional" :
        "/";
      navigate(redirectPath);
    } catch (err) {
      const data = (err as { data?: { message?: string; error?: string } })
        .data;
      setError(data?.message || data?.error || "Could not sign in");
    }
  };
  const form = (
    <form className="modal compact auth-form" onSubmit={submit}>
      {!embedded && (
        <button type="button" className="close" onClick={close}>
          ×
        </button>
      )}
      <span className="eyebrow">
        {registering ? "Join Plateful" : "Secure access"}
      </span>
      <h2>{registering ? "Create your account" : "Sign in"}</h2>
      <p className="modal-copy">
        {registering
          ? "Start discovering meal plans that work for you."
          : "Enter your details to open your workspace."}
      </p>
      <div className="stack-fields">
        <label>
          <span>Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          <span>Password</span>
          <input
            type="password"
            required
            minLength={6}
            autoComplete={registering ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>
      {error && <p className="auth-error">{error}</p>}
      <div className="auth-switch">
        {!fixedMode ? (
          <button type="button" onClick={() => setRegistering(!registering)}>
            {registering
              ? "Already have an account? Sign in"
              : "New here? Create an account"}
          </button>
        ) : (
          <span />
        )}
        <button className="primary" disabled={l || r}>
          {l || r ? "Please wait…" : registering ? "Create account" : "Sign in"}
        </button>
      </div>
    </form>
  );
  return embedded ? (
    form
  ) : (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      {form}
    </div>
  );
}

export function AdminPanel() {
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: users = [], isLoading } = useGetUsersQuery(undefined, {
    skip: user?.role !== "admin",
  });
  const [update] = useUpdateUserMutation();
  const [create] = useCreateUserMutation();
  const [showCreate, setShowCreate] = useState(false);
  const [profileUser, setProfileUser] = useState<SessionUser | null>(null);
  if (user?.role !== "admin") return null;
  return (
    <section className="admin-panel" id="admin">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Administration</span>
          <h2>People & access</h2>
        </div>
        <button className="primary" onClick={() => setShowCreate(true)}>
          ＋ Add user
        </button>
      </div>
      {isLoading ? (
        <div className="loading">
          <span />
        </div>
      ) : (
        <div className="users-table">
          <div className="user-row header">
            <span>Account</span>
            <span>Role</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          {users.map((item) => (
            <div className="user-row" key={item.id}>
              <span>
                <strong>{item.email}</strong>
                <small>#{item.id} {[item.first_name, item.last_name].filter(Boolean).join(" ")}</small>
                {item.role === "professional" && <button type="button" onClick={() => setProfileUser(item)}>Edit profile</button>}
              </span>
              <select
                value={item.role}
                onChange={(e) => update({ id: item.id, role: e.target.value })}
              >
                <option value="user">Member</option>
                <option value="professional">Professional</option>
                <option value="admin">Admin</option>
              </select>
              <span className={`status ${item.status}`}>{item.status}</span>
              <button
                className="secondary"
                disabled={item.id === user.id}
                onClick={() =>
                  update({
                    id: item.id,
                    status: item.status === "revoked" ? "active" : "revoked",
                  })
                }
              >
                {item.status === "revoked" ? "Restore" : "Revoke"}
              </button>
            </div>
          ))}
        </div>
      )}
      {profileUser && <ProfileEditor profile={profileUser} save={body => update({ id: profileUser.id, ...body }).unwrap()} close={() => setProfileUser(null)} />}
      {showCreate && (
        <CreateUser close={() => setShowCreate(false)} create={create} />
      )}
    </section>
  );
}

function CreateUser({
  close,
  create,
}: {
  close: () => void;
  create: ReturnType<typeof useCreateUserMutation>[0];
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [profile, setProfile] = useState(profileDraft());
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true); setError("");
    try { await create({ email, password, role, ...(role === "professional" ? profileBody(profile) : {}) }).unwrap(); close(); }
    catch (e) { setError((e as { data?: { message?: string } }).data?.message || "Could not create user"); } finally { setBusy(false); }
  };
  return (
    <div className="modal-backdrop">
      <form className="modal compact" onSubmit={submit}>
        <button type="button" className="close" onClick={close}>
          ×
        </button>
        <span className="eyebrow">Administrator action</span>
        <h2>Create an account</h2>
        <div className="stack-fields">
          <label>
            <span>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            <span>Temporary password</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label>
            <span>Role</span>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">Member</option>
              <option value="professional">Professional</option>
              <option value="admin">Administrator</option>
            </select>
          </label>
        </div>
        {role === "professional" && <ProfileFields value={profile} change={setProfile} />}
        {error && <p role="alert">{error}</p>}
        <div className="modal-actions">
          <span />
          <button type="button" className="secondary" onClick={close}>
            Cancel
          </button>
          <button className="primary" disabled={busy}>Create</button>
        </div>
      </form>
    </div>
  );
}
