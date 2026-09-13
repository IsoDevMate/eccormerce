"use client";

import { Analytics } from "@vercel/analytics/react";
import { useEffect, useState } from "react";

export function ConsentAnalytics() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const sync = () => {
      setAllowed(localStorage.getItem("sable-cookie-consent") === "accepted");
    };
    sync();
    window.addEventListener("sable:consent", sync);
    return () => window.removeEventListener("sable:consent", sync);
  }, []);

  if (!allowed) return null;
  return <Analytics />;
}
