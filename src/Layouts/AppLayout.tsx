import { Outlet } from "react-router";
import Aside from "../Components/Aside";

function AppLayout() {
  return (
    <>
      <div className="flex flex-col md:flex-row">
        <Aside />
        <main className="w-full"><Outlet /></main>
      </div>
    </>
  );
}

export default AppLayout;
