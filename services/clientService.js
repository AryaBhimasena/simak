// services/clientService.js
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";

const clientCollection = collection(db, "dataClient");

// Get all clients
export const getAllClients = async () => {
  const snapshot = await getDocs(clientCollection);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Get one client by id
export const getClientById = async (id) => {
  const clientRef = doc(db, "dataClient", id);
  const clientSnap = await getDoc(clientRef);
  return clientSnap.exists() ? { id: clientSnap.id, ...clientSnap.data() } : null;
};

// Add or update client
export const setClient = async (id, data) => {
  await setDoc(doc(db, "dataClient", id), data, { merge: true });
};

// Delete client
export const deleteClient = async (id) => {
  await deleteDoc(doc(db, "dataClient", id));
};
