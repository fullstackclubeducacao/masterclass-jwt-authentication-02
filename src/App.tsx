import { useEffect, useState } from "react";
import axios from "axios";
import Profile from "./components/Profile";

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      // pegar accessToken do Local Storage
      const accessToken = localStorage.getItem("accessToken");
      // chamar rota /profile com accessToken
      try {
        await axios.get("http://localhost:8080/profile", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        // se der certo, setar isAuthenticated como true
        setIsAuthenticated(true);
      } catch (error) {
        console.error(error);
      } finally {
        setIsInitializing(false);
      }
    };
    init();
  }, []);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post<{
        email: string;
        tokens: { accessToken: string; refreshToken: string };
      }>("http://localhost:8080/login", { email, password });
      const accessToken = response.data.tokens.accessToken;
      const refreshToken = response.data.tokens.refreshToken;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setEmail("");
      setPassword("");
      setIsAuthenticated(true);
      alert(`Welcome ${response.data.email}!`);
    } catch (error) {
      alert("Login failed");
      console.error(error);
    }
  };
  if (isInitializing) {
    return null;
  }
  if (isAuthenticated) {
    return <Profile />;
  }
  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-800">
      <form className="flex flex-col gap-4 w-[500px]" onSubmit={handleSubmit}>
        <input
          className="bg-slate-700 text-white border border-gray-500 p-2"
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="bg-slate-700 text-white border border-gray-500 p-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-slate-700 text-white border border-gray-500 p-2">
          Submit
        </button>
      </form>
    </div>
  );
};

export default App;
