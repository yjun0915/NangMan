import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();

  const toLogin = () => {
    nav("/login");
  };

  return (
    <div>
      <button onClick={toLogin}>login</button>
    </div>
  );
}
