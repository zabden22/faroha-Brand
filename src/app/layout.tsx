import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FarOha_Brand | الأناقة في كل التفاصيل",
  description: "FarOha_Brand بتقدملك ملابس للمرأة اللي بتحب الحشمة، الراحة، والأناقة البسيطة. إسدالات، دريسات، ملابس واسعة ومريحة.",
  keywords: "ملابس محتشمة, إسدالات, دريسات, ملابس واسعة, أزياء إسلامية, FarOha Brand",
  openGraph: {
    title: "FarOha_Brand | الأناقة في كل التفاصيل",
    description: "اكتشفي تشكيلتنا من الملابس المحتشمة، المريحة والأنيقة.",
    type: "website",
    locale: "ar_EG",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {children}
      </body>
    </html>
  );
}
