// services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor: garante que sempre manda o token atualizado
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Função de login
export const login = async (username: string, password: string) => {
  const response = await api.post("token/", { username, password });
  const { access, refresh } = response.data;

  // Adicione esta linha: salva o nome de usuário no armazenamento local
  localStorage.setItem("loggedInUsername", username); 
  
  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);

  return response.data;
};

// Função para logout
export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("loggedInUsername"); // Limpe o nome de usuário ao sair
};

export default api;