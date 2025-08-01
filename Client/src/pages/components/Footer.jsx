import GitHub from "../../assets/github-mark-c791e9551fe4/github-mark/github-mark-white.svg";
import "./footer.css";
export default function Footer() {
  return (
    <footer className="container">
      <div className="upper">
        <div className="left">
          <h3>Contact</h3>
          <a
            href="mailto:sophanithmeas91@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p>sophanithmeas91@gmail.com</p>
          </a>
          <a
            href="mailto:pichsokreaksa505@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p>pichsokreaksa505@gmail.com</p>
          </a>
        </div>
        <div className="mid">
          <h3>Privacy Policy</h3>
          <p>Terms of Service</p>
        </div>
        <div className="right">
          <a
            href="https://github.com/sophanith21/Smart-tasks-planner.git"
            target="_blank"
            rel="noopener noreferrer"
            className="!items-center !flex !flex-col"
          >
            <img src={GitHub} alt="GitHub" />
            <h3>Github</h3>
          </a>
        </div>
      </div>
      <div className="lower">
        <h3>&copy; {new Date(Date.now()).getFullYear()} Smart Tasks Planner</h3>
      </div>
    </footer>
  );
}
