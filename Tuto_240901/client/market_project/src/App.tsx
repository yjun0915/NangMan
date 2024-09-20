import { useState } from "react";
import axios from "axios";

function App() {
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
      console.log(response);

      if (response.data && response.data.length > 0) {
        setSuccess("Login successful!");
        setError(""); // 에러 메시지 초기화
      } else {
        setError("Invalid email or password");
        setSuccess(""); // 성공 메시지 초기화
      }
    } catch (err) {
      console.error(err);
      setError("Server error occurred");
      setSuccess("");
    }
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
      />
      <p />
      <button onClick={setLogin}>Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </>
  );
}

export default App;
