import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Form from "./Pages/Form";
import Login from "./Pages/Login";
import Edit from "./Pages/Edit";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<Form />} />
        <Route path="/login" element={<Login />} />
        <Route path="/edit/:id" element={<Edit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
