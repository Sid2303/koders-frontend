export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("authToken");
  return !!token;
};

export const isAdmin = (): boolean => {
  const userRole = localStorage.getItem("userRole");
  return userRole === "admin";
};

export const login = (token: string, role: string = "user"): void => {
  localStorage.setItem("authToken", token);
  localStorage.setItem("userRole", role);
};

export const logout = (): void => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userRole");
};
