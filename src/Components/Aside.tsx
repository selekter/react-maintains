import AsideLink from "./AsideLink";

export default function Aside() {
  return (
    <aside className="md:min-h-screen bg-neutral-800 md:w-80">
      <nav>
        <ul className="text-white">
          <li className="p-2">
            <AsideLink to="/">Dashboard</AsideLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
