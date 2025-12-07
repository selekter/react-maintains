import { useState } from "react";
import Button from "../Components/Button.js";
import { auth } from "../../firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (password === confirmPassword) {
        await createUserWithEmailAndPassword(auth, email, password).then(
          (userCredential) => {
            const user = userCredential.user;
          }
        );
        setErrorMessage("Sign up successfully");
      } else {
        setErrorMessage("กรุณาเช็ครหัสผ่านด้วยครับ");
      }
    } catch (error) {
      console.log("Authentication error:", error);
    }
  };

  return (
    <>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Confirm password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="text-red-500 font-bold text-sm">{errorMessage}</div>
        <Button type="submit">Register</Button>
      </form>
    </>
  );
}

export default Register;
