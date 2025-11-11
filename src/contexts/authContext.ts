import { createContext } from "react";
import type { AuthContextType } from "../interface/auth.interface";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);


