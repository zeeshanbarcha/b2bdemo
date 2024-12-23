"use client"

import { useEffect } from "react"

export const ResizeObserverHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      window.requestAnimationFrame(() => {
        if (!Array.isArray(entries) || !entries.length) {
          return;
        }
      });
    });

    resizeObserver.observe(document.body);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return <>{children}</>;
};

