import "./globals.css";

export const metadata = {
  title: "Hair CRM",
  description: "CRM для парикмахера",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}