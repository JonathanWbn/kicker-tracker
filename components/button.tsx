interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  label: string;
}

function Button({ label, className = "bg-slate-700", ...props }: ButtonProps) {
  return (
    <button {...props} className={`text-xs rounded px-4 py-2 ${className}`}>
      {label.toUpperCase()}
    </button>
  );
}

export default Button;
