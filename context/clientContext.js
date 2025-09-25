// context/clientContext.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getAllClients } from "@/services/clientService";

const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    setLoading(true);
    const data = await getAllClients();
    setClients(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <ClientContext.Provider value={{ clients, loading, refresh: fetchClients }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClients = () => useContext(ClientContext);
