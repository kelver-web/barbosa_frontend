import { Navigate, Outlet } from "react-router-dom";

function isValidJWT(token: string) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // exp é em segundos → converter p/ ms
    return typeof payload.exp === "number" && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export default function PrivateRoute() {
  const token = localStorage.getItem("access");
  const ok = token && isValidJWT(token);

  if (!ok) {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}
