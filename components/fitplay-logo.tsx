import Image from "next/image";

interface FitplayLogoProps {
  variant?: "black" | "white";
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  showText?: boolean;
  textColor?: "light" | "dark";
  title?: string;
  subtitle?: string;
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8", 
  lg: "h-12 w-12",
  xl: "h-16 w-16",
  "2xl": "h-20 w-20"
};

const textSizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg", 
  xl: "text-xl",
  "2xl": "text-2xl"
};

export function FitplayLogo({ 
  variant = "black", 
  size = "md", 
  className = "",
  showText = false,
  textColor = "dark",
  title = "Fitplay B2B",
  subtitle = "Business Portal"
}: FitplayLogoProps) {
  const logoSrc = variant === "black" ? "/logo_black.png" : "/logo_white.png";
  const logoAlt = `Fitplay ${variant} logo`;
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizeClasses[size]} relative flex-shrink-0`}>
        <Image
          src={logoSrc}
          alt={logoAlt}
          fill
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <div className="overflow-hidden min-w-0">
          <h1 className={`font-semibold truncate ${textSizeClasses[size]} ${
            textColor === "light" ? "text-white" : "text-gray-900"
          }`}>
            {title}
          </h1>
          <p className={`text-xs truncate ${
            textColor === "light" ? "text-gray-300" : "text-gray-500"
          }`}>
            {subtitle}
          </p>
        </div>
      )}
    </div>
  );
}