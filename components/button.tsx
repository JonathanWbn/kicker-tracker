interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  textSize?: TextSize;
  backgroundColor?: BackgroundColor;
}

function Button({
  textSize = "text-xs",
  backgroundColor,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`uppercase rounded px-4 py-2 ${[
        textSize,
        backgroundColor,
        className,
      ].join(" ")}`}
    />
  );
}

export default Button;

type TextSize = `text-${
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "8xl"
  | "9xl"}`;

type BackgroundColor = `bg-${string}`;
