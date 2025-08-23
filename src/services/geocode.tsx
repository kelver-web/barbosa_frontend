import { useEffect, useState } from "react";

export default function useCurrentLocation() {
  const [location, setLocation] = useState<{ city: string; state: string }>({
    city: "Parnamirim",
    state: "RN",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLocation() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) throw new Error("Não foi possível obter localização");
        const data = await res.json();
        setLocation({
          city: data.city || "Parnamirim",
          state: data.region || "RN",
        });
      } catch (err) {
        console.warn("Erro ao buscar localização, usando fallback:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLocation();
  }, []);

  return { location, loading };
}
