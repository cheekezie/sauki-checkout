import { createContext } from "react";
import type { ModalContextType } from "../interface/ui.interface";

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
);


