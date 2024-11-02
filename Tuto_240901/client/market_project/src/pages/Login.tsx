import { useState } from "react";
import axios from "axios";

function Login() {
  const [ID, setID] = useState("");
  const [PW, setPW] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const setLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        param: "id",
        where: `email="${ID}" and password="${PW}"`,
      });
      // console.log(response.data[0].token);

      if (response.data[0].token) {
        localStorage.setItem("pass", response.data[0].token);
        setSuccess("Login successful!");
        setError(""); // 에러 메시지 초기화
      } else {
        setError("Invalid email or password");
        setSuccess(""); // 성공 메시지 초기화
      }
    } catch (err) {
      console.log(err);
      console.error(err);
      setError("Server error occurred");
      setSuccess("");
    }
  };

  const logout = () => {
    localStorage.removeItem("pass");
    setID("");
    setPW("");
  };

  return (
    <>
      <h1>Login</h1>

      <input
        placeholder="ID"
        onChange={(e) => {
          setID(e.target.value);
        }}
      />
      <p />
      <input
        placeholder="PW"
        onChange={(e) => {
          setPW(e.target.value);
        }}
        type="password"
      />
      <p />
      <button onClick={setLogin}>Login</button>
      <button onClick={logout}>Logout</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </>
  );
}

export default Login;
