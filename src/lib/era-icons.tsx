import React from "react";

export interface EraIconProps {
  className?: string;
  size?: number;
}

/**
 * 👑 1단계: 고려의 건국과 후삼국 통일 — 태조 왕건 황제관 & 개국 보검 (Wang Geon Imperial Crown & Sword)
 */
export function GoryeoCrownIcon({ className, size = 28 }: EraIconProps) {
  return (
    <svg
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 32 32"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* 황금빛 그라데이션 */}
        <linearGradient id="crownGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="45%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        {/* 보검 은빛 날 그라데이션 */}
        <linearGradient id="bladeSteel" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="50%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        {/* 중앙 루비 보석 방사형 광채 */}
        <radialGradient id="rubyGlow" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="50%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#991b1b" />
        </radialGradient>
      </defs>

      {/* 후면 개국 보검 실루엣 */}
      <path
        d="M 16 2 L 17.5 7 L 16 11 L 14.5 7 Z"
        fill="url(#bladeSteel)"
        stroke="#475569"
        strokeLinejoin="round"
        strokeWidth="0.8"
      />
      <line stroke="#ffffff" strokeLinecap="round" strokeWidth="0.6" x1="16" x2="16" y1="3" y2="9" />

      {/* 왕관 본체 후광 빛 */}
      <circle cx="16" cy="17" fill="#fef08a" opacity="0.25" r="9" />

      {/* 태조 왕건 3봉 황금관 본체 */}
      <path
        d="M 4 19 L 5.5 10.5 L 10.5 14.5 L 16 6 L 21.5 14.5 L 26.5 10.5 L 28 19 L 26 25 L 6 25 Z"
        fill="url(#crownGold)"
        stroke="#78350f"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />

      {/* 왕관 봉우리 상단 골드 비즈 */}
      <circle cx="5.5" cy="9.5" fill="#fef9c3" r="1.3" stroke="#b45309" strokeWidth="0.6" />
      <circle cx="16" cy="5" fill="#fef9c3" r="1.8" stroke="#b45309" strokeWidth="0.8" />
      <circle cx="26.5" cy="9.5" fill="#fef9c3" r="1.3" stroke="#b45309" strokeWidth="0.6" />

      {/* 왕관 하단 장식 띠 */}
      <path
        d="M 5.5 20.5 L 26.5 20.5 L 25.5 24.5 L 6.5 24.5 Z"
        fill="#92400e"
        stroke="#b45309"
        strokeWidth="0.8"
      />

      {/* 중앙 붉은 루비 보석 */}
      <polygon
        fill="url(#rubyGlow)"
        points="16,14.5 19,17.5 16,20.5 13,17.5"
        stroke="#7f1d1d"
        strokeLinejoin="round"
        strokeWidth="0.8"
      />
      <circle cx="15.3" cy="16.7" fill="#ffffff" opacity="0.8" r="0.6" />

      {/* 하단 띠 보석 비즈 */}
      <circle cx="10" cy="22.5" fill="#fef08a" r="1" />
      <circle cx="16" cy="22.5" fill="#38bdf8" r="1" />
      <circle cx="22" cy="22.5" fill="#fef08a" r="1" />
    </svg>
  );
}

/**
 * 🏮 2단계: 고려 사회의 모습 — 화려한 연등회 등불과 전각 (Lotus Lantern of Yeondeunghoe)
 */
export function GoryeoLanternIcon({ className, size = 28 }: EraIconProps) {
  return (
    <svg
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 32 32"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* 등불 프레임 에메랄드 그라데이션 */}
        <linearGradient id="lanternEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#064e3b" />
        </linearGradient>
        {/* 연등 내부 온화한 등불 광채 */}
        <radialGradient id="lanternGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="55%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
        {/* 하단 실크 술 그라데이션 */}
        <linearGradient id="tasselRed" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
      </defs>

      {/* 상단 전각 처마형 황금 덮개 & 고리 */}
      <path
        d="M 16 3 L 16 5 M 13 5 C 13 4 19 4 19 5"
        stroke="#f59e0b"
        strokeLinecap="round"
        strokeWidth="1.2"
      />
      <path
        d="M 8.5 7.5 C 12 5.8 20 5.8 23.5 7.5 L 21.5 9 L 10.5 9 Z"
        fill="url(#lanternEmerald)"
        stroke="#064e3b"
        strokeLinejoin="round"
        strokeWidth="1"
      />

      {/* 연등 본체 팽창형 외곽 */}
      <path
        d="M 10.5 9 C 7 12.5 7 18 10.5 21.5 L 21.5 21.5 C 25 18 25 12.5 21.5 9 Z"
        fill="url(#lanternGlow)"
        stroke="#b45309"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />

      {/* 연등 내부 연꽃 잎 맥선 (Lotus petal patterns) */}
      <path
        d="M 16 9 L 16 21.5 M 12.5 10.2 C 11.5 13.5 11.5 17 12.5 20.3 M 19.5 10.2 C 20.5 13.5 20.5 17 19.5 20.3"
        stroke="#b45309"
        strokeLinecap="round"
        strokeOpacity="0.6"
        strokeWidth="1"
      />
      <ellipse cx="16" cy="15.2" fill="#ffffff" opacity="0.6" rx="2" ry="3" />

      {/* 하단 연꽃 받침대 */}
      <path
        d="M 11 21.5 L 21 21.5 L 19 23.5 L 13 23.5 Z"
        fill="url(#lanternEmerald)"
        stroke="#064e3b"
        strokeLinejoin="round"
        strokeWidth="0.8"
      />

      {/* 하단 붉은 실크 매듭 & 태슬 (Tassels) */}
      <circle cx="16" cy="24.8" fill="#facc15" r="1.1" />
      <path
        d="M 14.5 25.5 L 13.5 29 M 16 26 L 16 30 M 17.5 25.5 L 18.5 29"
        stroke="url(#tasselRed)"
        strokeLinecap="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}

/**
 * 🛡️ 3단계: 주변 나라와의 관계 — 귀주대첩 호국 철갑 방패 & 교차 고려검 (Goryeo Defender Shield & Crossed Swords)
 */
export function GoryeoShieldIcon({ className, size = 28 }: EraIconProps) {
  return (
    <svg
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 32 32"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* 방패 사파이어 블루 그라데이션 */}
        <linearGradient id="shieldBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#075985" />
        </linearGradient>
        {/* 방패 외곽 골드 리벳 테두리 */}
        <linearGradient id="shieldRim" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
        {/* 교차 검 메탈릭 그라데이션 */}
        <linearGradient id="swordSteel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>

      {/* 뒤편 교차하는 2자루의 고려 보검 (왼쪽 위 -> 오른쪽 아래) */}
      <line stroke="url(#swordSteel)" strokeLinecap="round" strokeWidth="2.2" x1="5" x2="27" y1="5" y2="27" />
      <path d="M 4 4 L 7 5 L 5 7 Z" fill="#e2e8f0" />
      <circle cx="26" cy="26" fill="#f59e0b" r="1.3" />

      {/* (오른쪽 위 -> 왼쪽 아래) */}
      <line stroke="url(#swordSteel)" strokeLinecap="round" strokeWidth="2.2" x1="27" x2="5" y1="5" y2="27" />
      <path d="M 28 4 L 25 5 L 27 7 Z" fill="#e2e8f0" />
      <circle cx="6" cy="26" fill="#f59e0b" r="1.3" />

      {/* 호국 방패 외곽 테두리 */}
      <path
        d="M 16 4.5 L 25 7.8 C 25 15.5 21.5 22.5 16 26.5 C 10.5 22.5 7 15.5 7 7.8 Z"
        fill="url(#shieldRim)"
        stroke="#854d0e"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />

      {/* 방패 코어 사파이어 플레이트 */}
      <path
        d="M 16 6.5 L 23 9 C 23 15 20.2 20.8 16 24.2 C 11.8 20.8 9 15 9 9 Z"
        fill="url(#shieldBlue)"
        stroke="#0369a1"
        strokeLinejoin="round"
        strokeWidth="1"
      />

      {/* 방패 중앙 호국 십자 성채 엠블럼 */}
      <path
        d="M 16 9.5 L 16 21 M 11.5 14.5 L 20.5 14.5"
        stroke="#fef08a"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <circle cx="16" cy="14.5" fill="#ffffff" r="1.8" stroke="#ca8a04" strokeWidth="0.8" />
      <circle cx="16" cy="14.5" fill="#0284c7" r="0.8" />

      {/* 코너 리벳 장식 */}
      <circle cx="11.5" cy="10" fill="#fef08a" r="0.8" />
      <circle cx="20.5" cy="10" fill="#fef08a" r="0.8" />
    </svg>
  );
}

/**
 * 🏺 4단계: 고려의 문화와 생활 — 국보 상감청자 운학문 매병 (Goryeo Inlaid Celadon Vase)
 */
export function GoryeoCeladonIcon({ className, size = 28 }: EraIconProps) {
  return (
    <svg
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 32 32"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* 비취빛 옥색 상감청자 그라데이션 */}
        <linearGradient id="celadonJade" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="40%" stopColor="#14b8a6" />
          <stop offset="85%" stopColor="#0f766e" />
          <stop offset="100%" stopColor="#134e4a" />
        </linearGradient>
        {/* 도자기 하이라이트 */}
        <linearGradient id="celadonShine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 후광 은은한 문화 빛 */}
      <circle cx="16" cy="16" fill="#a855f7" opacity="0.15" r="10" />

      {/* 매병 본체 유려한 어깨 곡선 실루엣 */}
      <path
        d="M 13.5 4.5 L 18.5 4.5 L 18 6.5 C 23.5 8 25 12 23.5 17.5 C 22.2 22 21 25.5 20.5 27.5 L 11.5 27.5 C 11 25.5 9.8 22 8.5 17.5 C 7 12 8.5 8 14 6.5 Z"
        fill="url(#celadonJade)"
        stroke="#115e59"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />

      {/* 도자기 좌측 반사 하이라이트 곡선 */}
      <path
        d="M 12 8.5 C 9.5 12 9.5 16 11.2 21"
        fill="none"
        stroke="url(#celadonShine)"
        strokeLinecap="round"
        strokeWidth="1.5"
      />

      {/* 주둥이(구연부) 연판문 띠 */}
      <path
        d="M 12.5 4.5 C 14 3.8 18 3.8 19.5 4.5"
        stroke="#99f6e4"
        strokeLinecap="round"
        strokeWidth="1.2"
      />

      {/* 상감 구름과 날아오르는 학(雲鶴) 문양 (Inlaid flying crane & clouds) */}
      {/* 1. 상단 원형 흑백 상감 테두리 */}
      <circle
        cx="16"
        cy="14"
        fill="#042f2e"
        fillOpacity="0.35"
        r="4.2"
        stroke="#ccfbf1"
        strokeDasharray="1 1.2"
        strokeWidth="0.8"
      />
      {/* 2. 구름 위를 날아오르는 백학 실루엣 */}
      <path
        d="M 14 14.8 C 15 13.8 16.5 13.5 18 13.2 M 16 12 C 16.2 13.8 16.2 15 15.5 16"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeWidth="1"
      />
      <circle cx="17.8" cy="13.2" fill="#ef4444" r="0.6" />

      {/* 하단 국화/연꽃 상감 포인트 */}
      <circle cx="16" cy="22" fill="#fef08a" r="1.1" stroke="#0f766e" strokeWidth="0.5" />
      <circle cx="13.5" cy="23.5" fill="#ffffff" r="0.8" />
      <circle cx="18.5" cy="23.5" fill="#ffffff" r="0.8" />

      {/* 매병 굽 하단 띠 */}
      <line stroke="#042f2e" strokeLinecap="round" strokeWidth="1" x1="12" x2="20" y1="26.5" y2="26.5" />
    </svg>
  );
}

/**
 * ⚔️ 5단계: 파이널 존 — 홀로그램 마법 배틀 카드 & 번개 (Hologram Battle Cards & Lightning Aura)
 */
export function GoryeoBattleCardsIcon({ className, size = 28 }: EraIconProps) {
  return (
    <svg
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 32 32"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* 뒤쪽 카드 바이올렛 홀로그램 */}
        <linearGradient id="backCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="50%" stopColor="#7e22ce" />
          <stop offset="100%" stopColor="#3b0764" />
        </linearGradient>
        {/* 앞쪽 카드 루비 레드 배틀 그라데이션 */}
        <linearGradient id="frontCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="50%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#881337" />
        </linearGradient>
        {/* 번개 스파크 골드 그라데이션 */}
        <linearGradient id="sparkGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#eab308" />
        </linearGradient>
      </defs>

      {/* 후면 마법 카드 (왼쪽으로 기울어짐) */}
      <rect
        fill="url(#backCardGrad)"
        height="18"
        rx="2.5"
        stroke="#d8b4fe"
        strokeWidth="1.2"
        transform="rotate(-14 11 16)"
        width="12.5"
        x="4.5"
        y="7"
      />
      {/* 후면 카드 중앙 문양 */}
      <circle
        cx="11"
        cy="16"
        fill="none"
        r="3"
        stroke="#f3e8ff"
        strokeDasharray="1.5 1.5"
        strokeWidth="0.8"
        transform="rotate(-14 11 16)"
      />

      {/* 전면 마법 카드 (오른쪽으로 기울어짐, 입체 그림자 효과) */}
      <rect
        fill="url(#frontCardGrad)"
        height="18"
        rx="2.5"
        stroke="#fecdd3"
        strokeWidth="1.4"
        transform="rotate(12 21 16)"
        width="12.5"
        x="14.5"
        y="7"
      />

      {/* 전면 카드 내부 골드 프레임 */}
      <rect
        fill="#4c0519"
        fillOpacity="0.4"
        height="14"
        rx="1.5"
        stroke="#facc15"
        strokeWidth="0.8"
        transform="rotate(12 21 16)"
        width="9.5"
        x="16"
        y="9"
      />

      {/* 전면 카드 중앙 빛나는 황금 별 엠블럼 */}
      <path
        d="M 21 12.5 L 21.8 15 L 24 15.8 L 21.8 16.6 L 21 19.5 L 20.2 16.6 L 18 15.8 L 20.2 15 Z"
        fill="#fef08a"
        stroke="#ca8a04"
        strokeLinejoin="round"
        strokeWidth="0.6"
        transform="rotate(12 21 16)"
      />

      {/* 카드 사이에서 튀어나오는 번개 볼트 이펙트 */}
      <path
        d="M 16 3 L 13 12 L 18 11.5 L 14.5 22"
        fill="none"
        stroke="url(#sparkGold)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <circle cx="16" cy="3" fill="#ffffff" r="1.2" />
      <circle cx="14.5" cy="22" fill="#facc15" r="1" />
    </svg>
  );
}

/**
 * 하위 호환성을 위한 구 명칭 Export (기존 import 안전 유지)
 */
export const HandaxeIcon = GoryeoCrownIcon;
export const CombPotteryIcon = GoryeoLanternIcon;
export const BronzeDaggerIcon = GoryeoShieldIcon;
export const GojoseonCrownIcon = GoryeoCeladonIcon;
export const BattleCardsIcon = GoryeoBattleCardsIcon;

/**
 * 🏛️ 스테이지 번호(1~5)에 따라 고품질 고려 시대 테마 SVG 아이콘을 반환하는 통합 컴포넌트
 */
export function StageEraIcon({
  stageId,
  size = 28,
  className,
}: {
  stageId: number;
  size?: number;
  className?: string;
}) {
  switch (stageId) {
    case 1:
      return <GoryeoCrownIcon className={className} size={size} />;
    case 2:
      return <GoryeoLanternIcon className={className} size={size} />;
    case 3:
      return <GoryeoShieldIcon className={className} size={size} />;
    case 4:
      return <GoryeoCeladonIcon className={className} size={size} />;
    case 5:
      return <GoryeoBattleCardsIcon className={className} size={size} />;
    default:
      return null;
  }
}

/**
 * 🔔 3단계 고유 유물: 고려 청동 방울 (Bronze Ritual Bell)
 */
export function BronzeBellIcon({ className, size = 22 }: EraIconProps) {
  return (
    <svg
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bronzeBellGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="50%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#115e59" />
        </linearGradient>
      </defs>
      <path
        d="M 12 2 C 10.3 2 9 3.2 9 4.8 L 15 4.8 C 15 3.2 13.7 2 12 2 Z"
        fill="#0f766e"
        stroke="#2dd4bf"
        strokeWidth="1.6"
      />
      <path
        d="M 9 4.8 C 7 7 5.5 11 5 15 C 4.5 18 7.2 19.5 12 19.5 C 16.8 19.5 19.5 18 19 15 C 18.5 11 17 7 15 4.8 Z"
        fill="url(#bronzeBellGrad)"
        stroke="#2dd4bf"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M 7.5 10 L 12 12.5 L 16.5 10"
        stroke="#99f6e4"
        strokeLinecap="round"
        strokeWidth="1.2"
      />
      <circle cx="12" cy="7.8" fill="#99f6e4" r="1" />
      <line
        stroke="#134e4a"
        strokeLinecap="round"
        strokeWidth="2.2"
        x1="8"
        x2="16"
        y1="16.5"
        y2="16.5"
      />
      <circle
        cx="12"
        cy="16.5"
        fill="#fde047"
        r="1.4"
        stroke="#0f766e"
        strokeWidth="0.8"
      />
    </svg>
  );
}
