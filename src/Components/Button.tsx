interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

function Button({
  children,
  className = "",
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={
        `py-2 px-2 md:px-5 rounded-md md:rounded shadow-lg transition duration-300 ${disabled && "opacity-25 "
        } ` + className
      }
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
