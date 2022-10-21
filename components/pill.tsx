import { DetailedHTMLProps, HTMLAttributes } from "react";

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

function Pill({ children, className, ...props }: Props) {
  return (
    <div
      {...props}
      className={`bg-slate-700 rounded-full px-2 py-1 ${className || ""}`}
    >
      {children}
    </div>
  );
}

export default Pill;
