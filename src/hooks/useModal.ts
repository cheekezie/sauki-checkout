import { useContext } from "react";
import { ModalContext } from "../contexts/modalContext";
import type { ModalContextType } from "../interface/ui.interface";

export function useModal(): ModalContextType {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
