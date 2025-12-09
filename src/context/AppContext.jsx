import React, { createContext, useState, useContext, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load from local storage on init
  useEffect(() => {
    const saved = localStorage.getItem("healflow_prescription");
    if (saved) {
      try {
        setPrescription(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved prescription", e);
      }
    }
  }, []);

  const savePrescription = (data) => {
    setPrescription(data);
    localStorage.setItem("healflow_prescription", JSON.stringify(data));
  };

  return (
    <AppContext.Provider
      value={{ prescription, savePrescription, loading, setLoading }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
