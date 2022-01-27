import { ReactNode } from "react";

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  label: ReactNode;
  textSize?: string;
}

function Button({
  label,
  textSize = "text-xs",
  className = "bg-slate-700",
  ...props
}: ButtonProps) {
  return (
    <button {...props} className={`${textSize} rounded px-4 py-2 ${className}`}>
      {typeof label === "string" ? label.toUpperCase() : label}
    </button>
  );
}

export default Button;
