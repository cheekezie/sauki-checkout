import { createContext } from "react";

export interface OrgContextValue {
  activeOrgId: string | null;
  setActiveOrgId: (id: string | null) => void;
}

export const OrgContext = createContext<OrgContextValue | undefined>(undefined);


