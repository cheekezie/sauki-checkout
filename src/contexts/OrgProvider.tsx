import { useEffect, useMemo, useState, type ReactNode } from "react";
import { OrgContext, type OrgContextValue } from "./orgContext";

interface OrgProviderProps {
  children: ReactNode;
}

export function OrgProvider({ children }: OrgProviderProps) {
  const [activeOrgId, setActiveOrgIdState] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("active_org_id");
    if (saved) setActiveOrgIdState(saved);
  }, []);

  const setActiveOrgId = (id: string | null) => {
    setActiveOrgIdState(id);
    if (id) localStorage.setItem("active_org_id", id);
    else localStorage.removeItem("active_org_id");
  };

  const value = useMemo<OrgContextValue>(() => ({ activeOrgId, setActiveOrgId }), [activeOrgId]);
  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
}
