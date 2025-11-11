import { ArrowLeft } from "lucide-react";
import type { BackButtonProps } from "../../interface";

const BackButton = ({ 
  onClick, 
  className = "", 
  children = "Back" 
}: BackButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 text-sm font-medium
        text-primary hover:text-primary/80
        transition-all duration-200 ease-in-out
        hover:scale-105
        bg-transparent border-0 outline-none
        group
        ${className}
      `}
      aria-label="Go back"
    >
      <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
      <span>{children}</span>
    </button>
  );
};

export default BackButton;
