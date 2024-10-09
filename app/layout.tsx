import { QueryProvider } from "./components/query-provider";
import "./globals.css";
import PlausibleProvider from "next-plausible";

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
      <head>
        <PlausibleProvider
          domain="derpibooru-tagging-helper.netlify.app"
          trackOutboundLinks
        />
      </head>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
