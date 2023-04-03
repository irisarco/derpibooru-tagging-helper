import "./globals.css";

export const metadata = {
  title: "Derpibooru tagging helper",
  description: "Add more tags with less effort",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-[#141a24] text-[#e0e0e0]">
      <body>{children}</body>
    </html>
  );
}
