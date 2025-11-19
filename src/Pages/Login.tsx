import { signInWithEmailAndPassword } from "firebase/auth";
import { useRef, useState } from "react";
import { auth } from "../firebase.js";
import { useNavigate } from "react-router";
import Button from "../Components/Button.js";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

interface FormLoginProps {
  email: string;
  password: string;
}

function Login() {
  const [formLogin, setFormLogin] = useState<FormLoginProps>({
    email: "",
    password: "",
  });
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormLogin((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!executeRecaptcha) {
      console.error("Recaptcha not ready");
      return;
    }
    setError(false);
    setLoading(true);

    const token = await executeRecaptcha("login");

    if (!token) {
      console.error("Failed to get reCAPTCHA token");
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(
        auth,
        formLogin.email,
        formLogin.password,
      );
      navigate("/");
    } catch (err) {
      console.error("Firebase Login Error:", err);

      setError(true);
      setFormLogin({ ...formLogin, password: "" });

      if (passwordRef.current) {
        passwordRef.current.focus();
      }
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
                  name="email"
                  className="border border-neutral-200 rounded w-full py-2 px-3"
                  value={formLogin.email}
                  onChange={handleChange}
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
                  name="password"
                  className="border border-neutral-200 rounded w-full py-2 px-3"
                  ref={passwordRef}
                  value={formLogin.password}
                  onChange={handleChange}
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
              {loading ? "Loading..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
