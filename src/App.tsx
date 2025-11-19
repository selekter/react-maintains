import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Edit from "./Pages/Edit";
import { Suspense } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

function App() {
  return (
    <BrowserRouter
    // future={{
    //   v7_relativeSplatPath: true,
    //   v7_startTransition: true,
    // }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_KEY}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/edit/:id" element={<Edit />} />
          </Routes>
        </GoogleReCaptchaProvider>
      </Suspense>
    </BrowserRouter >
  );
}

export default App;
