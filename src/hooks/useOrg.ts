import { useContext } from "react";
import { OrgContext } from "@/contexts/orgContext";

export const useOrg = () => {
  const ctx = useContext(OrgContext);

  if (!ctx) {
    throw new Error("useOrg must be used within OrgProvider");
  }

  return ctx;
};

