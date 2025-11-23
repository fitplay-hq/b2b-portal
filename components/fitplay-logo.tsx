import Image from "next/image";

interface FitplayLogoProps {
  variant?: "black" | "white";
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  className?: string;
  showText?: boolean;
  textColor?: "light" | "dark";
  subtitle?: string;
  tight?: boolean; // New prop to control tight cropping
  spacing?: "tight" | "normal" | "loose" | "sidebar"; 
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8", 
  lg: "h-12 w-12",
  xl: "h-16 w-16",
  "2xl": "h-20 w-20",
  "3xl": "h-24 w-24",
  "4xl": "h-32 w-32"
};

export function FitplayLogo({ 
  variant = "black", 
  size = "md", 
  className = "",
  showText = false,
  textColor = "dark",
  subtitle = "Business Ordering Portal",
  tight = false,
  spacing = "normal"
}: FitplayLogoProps) {
  const logoSrc = variant === "black" ? "/logo_black.png" : "/logo_white.png";
  const logoAlt = `Fitplay ${variant} logo`;
  
  const spacingClasses = {
    tight: "-mt-17",
    normal: "-mt-6", 
    loose: "-mt-8",
    sidebar: "-mt-4"
  };
  
  return (
    <div className={`${showText ? 'flex flex-col items-start' : 'flex items-center gap-3'} ${className}`}>
      <div className={`${sizeClasses[size]} relative flex-shrink-0 ${tight ? 'overflow-hidden' : ''}`}>
        <Image
          src={logoSrc}
          alt={logoAlt}
          fill
          className={`${tight ? 'object-cover scale-110' : 'object-contain object-top'}`}
          priority
        />
      </div>
      {showText && (
        <div className={`overflow-hidden min-w-0 ${spacingClasses[spacing]}`}>
          <p className={`text-base font-medium truncate ${
            textColor === "light" ? "text-gray-300" : "text-gray-600"
          }`}>
            {subtitle}
          </p>
        </div>
      )}
    </div>
  );
}


