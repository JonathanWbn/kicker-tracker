import "./globals.css";
import { Rubik } from "@next/font/google";

const rubik = Rubik({
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={rubik.className}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Thanks For Playing</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
