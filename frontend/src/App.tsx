import React, { useState, useEffect } from "react";
import { Routes } from "./Routes";
import { setAccessToken } from "./accessToken";

interface Props {}

export const App: React.FC<Props> = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:4000/refresh_token", {
        method: "POST",
        credentials: "include",
      });
      const { accessToken } = await res.json();
      setAccessToken(accessToken);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return <Routes />;
};
