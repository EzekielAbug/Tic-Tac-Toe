import "./globals.css";

export const metadata = {
  title: "Garden Clash — Plants vs Zombies Tic-Tac-Toe",
  description:
    "A pixel-art themed Tic-Tac-Toe game featuring Plants vs Zombies. Play PvP or challenge the AI!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
