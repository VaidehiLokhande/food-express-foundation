// Lightweight client-side "auth" — there is no backend/database yet.
// Accounts are stored in the visitor's own browser (localStorage) purely so the
// Login / Register pages are functional to click through. Replace this with a
// real API + database before relying on it for real user accounts.

export type StoredUser = {
  name: string;
  email: string;
  phone: string;
  password: string;
  createdAt: string;
};

const USERS_KEY = "fef_users";
const SESSION_KEY = "fef_session";

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerUser(user: Omit<StoredUser, "createdAt">): { ok: boolean; error?: string } {
  const users = readUsers();
  if (users.some((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
    return { ok: false, error: "An account with this email already exists. Please login instead." };
  }
  users.push({ ...user, createdAt: new Date().toISOString() });
  writeUsers(users);
  localStorage.setItem(SESSION_KEY, user.email);
  return { ok: true };
}

export function loginUser(email: string, password: string): { ok: boolean; error?: string } {
  const users = readUsers();
  const match = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!match) return { ok: false, error: "No account found with this email. Please sign up first." };
  if (match.password !== password) return { ok: false, error: "Incorrect password. Please try again." };
  localStorage.setItem(SESSION_KEY, match.email);
  return { ok: true };
}

export function currentUser(): StoredUser | null {
  const email = localStorage.getItem(SESSION_KEY);
  if (!email) return null;
  return readUsers().find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}
