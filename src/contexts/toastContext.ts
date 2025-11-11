import { createContext } from "react";
import type { ToastContextType } from "../interface";

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);


