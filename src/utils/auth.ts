export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token");
  return !!token;
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  if (user) {
    try {
      return JSON.parse(user);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  return null;
};

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
