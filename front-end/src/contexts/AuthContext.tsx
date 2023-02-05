import React, { createContext, ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { IClientsList, IContact, IContactRegister } from "../interfaces/client";

export const AuthContext = createContext<clientContextData>(
  {} as clientContextData
);

export interface IDataRegister {
  name: string;
  email: string;
  password: string;
  telephone: string;
  id?: string;
}

export interface IDataClientLogin {
  email: string;
  password: string;
}

export interface IClientID {
  id: string;
}

interface IClientProps {
  children: ReactNode;
}

interface clientContextData {
  clientRegister: (IDataRegister: IDataRegister) => void;
  clientLogin: (IDataClientLogin: IDataClientLogin) => void;
  listClients: (
    IClientsList: IClientsList | React.MouseEvent<HTMLButtonElement>
  ) => void;
  deleteClient: (id: string) => void;
  clients: IClientsList[];
  contacts: IContact[];
  client: IDataRegister;
  setClient: React.Dispatch<any>;
  setClientID: React.Dispatch<any>;
  clientID: IClientID | any;
  contactRegister: (IDataContactRegister: IContactRegister) => void;
  listContacts: (
    IDataContactRegister: IContactRegister | React.MouseEvent<HTMLButtonElement>
  ) => void;
  deleteContact: (id: string) => void;
}
const AuthProvider = ({ children }: IClientProps) => {
  const clientUser = localStorage.getItem("clientObject");
  const [client, setClient] = useState(JSON.parse(clientUser!));
  const [clients, setClients] = useState<IClientsList[]>([]);
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [clientID, setClientID] = useState<IClientID | any>();
  const navigate = useNavigate();

  const clientRegister = async (data: IDataRegister) => {
    try {
      const response = await api.post("/clients", data);
      if (response.status === 201) {
        navigate("/login");
        toast.success("Account successfully created!");
        setClientID(data.id);
        console.log(data.id, clientID);
      } else {
        toast.error("Account already registered!");
      }
    } catch (error) {
      toast.error("There was an error creating the account");
    }
  };

  const clientLogin = (data: IDataClientLogin) => {
    api
      .post("/login", data)
      .then((response) => {
        localStorage.setItem("@TOKEN", response.data.token);
        setClient(response.data.token);
        navigate("/dashboard");
      })
      .catch(() => {
        toast.error("Incorrect login or password");
      });
  };

  const listClients = async () => {
    try {
      const token = localStorage.getItem("@TOKEN");
      if (token) {
        const response = await api.get("clients", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClients(response.data);
      } else {
        navigate("/login");
      }
    } catch (error) {
      localStorage.removeItem("@TOKEN");
      console.error(error);
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const token = localStorage.getItem("@TOKEN");

      if (token) {
        const response = await api.delete(`/clients/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 204) {
          setClients(clients.filter((client) => client.id !== id));
          toast.success("Client deleted with sucess!");
        } else {
          toast.error("Client not found");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const contactRegister = async (data: IContactRegister) => {
    try {
      const token = localStorage.getItem("@TOKEN");
      const response = await api.post("/contacts", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 201) {
        toast.success("Contact successfully created!");
      } else {
        toast.error("Contact already registered!");
      }
    } catch (error) {
      toast.error("There was an error creating the contact");
      console.error(error);
    }
  };

  const listContacts = async () => {
    try {
      const token = localStorage.getItem("@TOKEN");
      if (token) {
        const response = await api.get("/contacts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setContacts(response.data);
      } else {
        navigate("/login");
      }
    } catch (error) {
      localStorage.removeItem("@TOKEN");
      console.error(error);
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const token = localStorage.getItem("@TOKEN");

      if (token) {
        const response = await api.delete(`/contacts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 204) {
          setContacts(contacts.filter((client) => client.id !== id));
          toast.success("Contact deleted with sucess!");
        } else {
          toast.error("Contact not found");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        clientRegister,
        clientLogin,
        listClients,
        clients,
        client,
        setClient,
        deleteClient,
        contactRegister,
        listContacts,
        contacts,
        deleteContact,
        setClientID,
        clientID,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
