import { ReactNode } from "react";

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  label: ReactNode;
}

function Button({ label, className = "bg-slate-700", ...props }: ButtonProps) {
  return (
    <button {...props} className={`text-xs rounded px-4 py-2 ${className}`}>
      {typeof label === "string" ? label.toUpperCase() : label}
    </button>
  );
}

export default Button;
