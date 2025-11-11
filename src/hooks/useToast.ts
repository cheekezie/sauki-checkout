import { useContext } from "react";
import { ToastContext } from "../contexts/toastContext";
import type { ToastContextType } from "../interface/auth.interface";

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
