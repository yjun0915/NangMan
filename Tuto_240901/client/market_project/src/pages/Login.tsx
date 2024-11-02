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
      const response = await axios.post(
        "http://localhost:3000/api/login",
        {
          param: "id",
          where: `email="${ID}" and password="${PW}"`,
        },
        { withCredentials: true }
      ); // withCredentials 추가

      console.log("API Response:", response.data); // 응답 데이터 확인

      // 응답 데이터 구조를 확인
      if (response.data && response.data.length > 0 && response.data[0].token) {
        localStorage.setItem("pass", response.data[0].token);
        setSuccess("Login successful!");
        setError(""); // 에러 메시지 초기화
      } else {
        setError("Invalid email or password");
        setSuccess(""); // 성공 메시지 초기화
      }
    } catch (err) {
      console.error("Error occurred during login:", err);
      setError("Server error occurred");
      setSuccess("");
    }
  };

  const logout = () => {
    localStorage.removeItem("pass");
    setID("");
    setPW("");
    setSuccess(""); // 성공 메시지 초기화
    setError(""); // 에러 메시지 초기화
  };

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={setLogin}>
        {" "}
        {/* 폼 제출 처리 */}
        <input
          placeholder="ID"
          value={ID} // 입력값 제어
          onChange={(e) => setID(e.target.value)}
        />
        <p />
        <input
          placeholder="PW"
          value={PW} // 입력값 제어
          onChange={(e) => setPW(e.target.value)}
          type="password"
        />
        <p />
        <button type="submit">Login</button> {/* 버튼을 submit 타입으로 변경 */}
      </form>
      <button onClick={logout}>Logout</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </>
  );
}

export default Login;
