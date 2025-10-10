import { signInWithEmailAndPassword } from "firebase/auth";
import { useRef, useState } from "react";
import { auth } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import Button from "../Components/Button.js";

function Login() {
  const [email, setEmail] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false)
    setLoading(true);

    try {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // const user = userCredential.user;
          navigate("/");
        })
        .catch((error) => {
          console.error("Firebase Login Error:", error);
          setError(true);
          if (emailRef.current) {
            emailRef.current.focus();
          }
          setPassword("");
        });
    } catch (error) {
      console.log("Error:", error);
    }
    setLoading(false);
  };
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white p-5 w-11/12 md:max-w-md rounded">
          <form onSubmit={handleLogin}>
            <div className="mb-2">
              <label>
                Email:
                <input
                  type="email"
                  className="border border-neutral-200 rounded w-full py-2 px-3"
                  ref={emailRef}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter Email"
                />
              </label>
            </div>
            <div className="mb-2">
              <label>
                Password:
                <input
                  type="password"
                  className="border border-neutral-200 rounded w-full py-2 px-3"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter Password"
                />
              </label>
            </div>
            {error && (
              <div className="bg-red-200 text-red-900 px-3 py-2 rounded">
                ชื่อหรือรหัสผ่านไม่ถูกต้อง
              </div>
            )}
            <Button
              type="submit"
              className="bg-blue-500 text-white mt-3"
              disabled={loading}
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
