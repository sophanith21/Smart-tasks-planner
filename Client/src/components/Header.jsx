import logo from "../assets/Logo.jpg";

export default function Header() {
  return (
    <div className="header">
      <div className="logo">
        <img src={logo} alt="Smart Tasks Planner" />
      </div>

      <h1 id="title">Smart Tasks Planner</h1>
    </div>
  );
}
