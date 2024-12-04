import { useEffect, useState } from "react";
import { api } from "../lib/axios";

interface User {
  email: string;
  age: number;
  firstName: string;
  lastName: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | undefined>();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await api.get<User>("/profile");
      setUser(response.data);
    };
    fetchUser();
  }, []);

  const handleSignOutClick = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.reload();
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-800 text-white">
      <h1>Bem vindo!</h1>
      <div className="flex flex-col mt-4 gap-4 w-[500px] text-center">
        <p>Primeiro nome: {user?.firstName}</p>
        <p>Sobrenome: {user?.lastName}</p>
        <p>E-mail: {user?.email}</p>
        <p>Idade: {user?.age}</p>
        <button
          onClick={handleSignOutClick}
          className="
          bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Sair
        </button>
      </div>
    </div>
  );
};

export default Profile;
