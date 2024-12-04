import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080",
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // verificar se o código de resposta é 401 (unauthorized)
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // se for, o token está inválido
        // se o token estiver inválido e EU TIVER UM REFRESH TOKEN, eu vou tentar atualizá-lo
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          return Promise.reject(error);
        }
        const response = await api.post("/refresh-token", { refreshToken });
        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;
        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        // depois de atualizá-lo, eu vou tentar fazer a requisição de novo, enviando o novo token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (error) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
