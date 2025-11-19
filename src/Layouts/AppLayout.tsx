import Aside from "../Components/Aside";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex flex-col md:flex-row">
        <Aside />
        <main className="w-full">{children}</main>
      </div>
    </>
  );
}

export default AppLayout;
