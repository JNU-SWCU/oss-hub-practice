import type { Metadata } from "next";

export const metadata: Metadata = { title: "JNU OSS Hub" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
