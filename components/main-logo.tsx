import Link from "next/link";

export default function mainLogo() {
  return (
    <Link href="/">
      <svg viewBox="0 0 200 60" className="w-full h-full">
        {/* Abstract ridge/rooflines */}
        <path
          d="M10 35 L25 15 L40 35"
          stroke="#D4AF37"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M20 35 L35 20 L50 35"
          stroke="#D4AF37"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />
        <text
          x="60"
          y="26"
          fill="#FFFFFF"
          fontFamily="Helvetica, Arial, sans-serif"
          fontSize="17"
          fontWeight="700"
          letterSpacing="1"
        >
          RIDGELINE
        </text>
        <text
          x="60"
          y="42"
          fill="#D4AF37"
          fontFamily="Helvetica, Arial, sans-serif"
          fontSize="11"
          letterSpacing="4"
        >
          HOMES
        </text>
      </svg>
    </Link>
  );
}
