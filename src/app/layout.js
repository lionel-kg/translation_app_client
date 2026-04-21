import Navbar from "@/app/components/navbar";
import Providers from "@/app/components/Providers";
import "./globals.scss";

export const metadata = {
  title: "Polyglot — Your Language Notebook",
  description: "Learn English with AI-powered exercises",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          <main>{children}</main>
          <Navbar />
        </Providers>
      </body>
    </html>
  );
}
