import axios from "axios";
import { useEffect, useState } from "react";

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
      const response = await axios.get<User>("http://localhost:8080/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setUser(response.data);
    };
    fetchUser();
  }, []);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-800 text-white">
      <h1>Bem vindo!</h1>
      <div className="flex flex-col mt-4 gap-4 w-[500px] text-center">
        <p>Primeiro nome: {user?.firstName}</p>
        <p>Sobrenome: {user?.lastName}</p>
        <p>E-mail: {user?.email}</p>
        <p>Idade: {user?.age}</p>
      </div>
    </div>
  );
};

export default Profile;
