/* eslint-disable react/prop-types */
function Button({
  children,
  className = "",
  disabled,
  type = "button",
  ...props
}) {
  return (
    <button
      {...props}
      type={type}
      className={
        `py-2 px-2 md:px-5 rounded shadow-lg transition duration-300 ${
          disabled && "opacity-25 "
        } ` + className
      }
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
