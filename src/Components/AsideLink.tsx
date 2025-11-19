import { NavLink } from "react-router";

interface AsideLinkProps {
  to: string;
  className?: string;
  children: string;
}

export default function AsideLink({
  to = "/",
  className,
  children,
}: AsideLinkProps) {
  return (
    <NavLink
      to={to}
      className={(isActive) =>
        `block p-2 rounded transition hover:bg-neutral-600 ${className}
        ${isActive ? "bg-neutral-600" : ""}
        `
      }
      end
    >
      {children}
    </NavLink>
  );
}
