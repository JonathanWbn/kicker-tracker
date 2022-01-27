import { DetailedHTMLProps, HTMLAttributes } from "react";

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  isActive?: boolean;
}

function Card({ children, isActive = false, className, ...props }: Props) {
  return (
    <div
      {...props}
      className={`${
        isActive ? "bg-slate-600" : "bg-slate-700"
      } rounded-2xl p-4 text-slate-100 ${className || ""}`}
    >
      {children}
    </div>
  );
}

export default Card;
