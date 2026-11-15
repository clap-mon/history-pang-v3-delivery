import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "역사팡: 후삼국과 고려",
  description: "초등 5학년 2학기 사회 교과 연계 역사 탐구 시간여행 - 후삼국 통일, 고려 사회, 대외 관계, 고려의 문화와 생활",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
