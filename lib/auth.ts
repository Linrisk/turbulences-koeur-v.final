export interface AdminUser {
  id: string;
  login: string;
  role: string;
  passwordHash?: string;
}

export async function authenticateAdmin(
  login: string,
  password: string
): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  try {
    console.log("[AUTH] Attempting login with:", { login, password: "***" });

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password }),
    });

    if (!response.ok) {
      return { success: false, error: "Identifiants incorrects" };
    }

    const data = await response.json();
    console.log("[AUTH] Login successful");
    return data;
  } catch (error) {
    console.error("[AUTH] Error:", error);
    return { success: false, error: "Erreur d'authentification" };
  }
}

export function setAdminAuth(user: AdminUser): void {
  if (typeof window !== "undefined") {
    console.log("[STORAGE] Setting admin auth");
    localStorage.setItem("admin_authenticated", "true");
    localStorage.setItem("admin_login_time", Date.now().toString());
    localStorage.setItem("admin_role", user.role);
    localStorage.setItem("admin_id", user.id);
    localStorage.setItem("admin_login", user.login);
  }
}

export function getAdminAuth(): AdminUser | null {
  if (typeof window !== "undefined") {
    const isAuth = localStorage.getItem("admin_authenticated");
    if (!isAuth) return null;

    return {
      id: localStorage.getItem("admin_id") || "",
      login: localStorage.getItem("admin_login") || "",
      role: localStorage.getItem("admin_role") || "",
    };
  }
  return null;
}

export function isAdminAuthenticated(): boolean {
  if (typeof window !== "undefined") {
    return localStorage.getItem("admin_authenticated") === "true";
  }
  return false;
}

export function logoutAdmin(): void {
  if (typeof window !== "undefined") {
    console.log("[STORAGE] Logging out admin");
    localStorage.removeItem("admin_authenticated");
    localStorage.removeItem("admin_login_time");
    localStorage.removeItem("admin_role");
    localStorage.removeItem("admin_id");
    localStorage.removeItem("admin_login");
  }
}
