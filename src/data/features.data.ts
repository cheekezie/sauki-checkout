import type { UserType } from "../interface";

export const FEATURE_CONTENT: Record<
  UserType["id"],
  { heading: string; items: string[] }
> = {
  school: {
    heading: "Join as a student to access these amazing features",
    items: [
      "View and download results",
      "Track assignments and deadlines",
      "Get notifications and reminders",
      "Secure access to your records",
    ],
  },
  other: {
    heading: "Register your organization to get amazing features",
    items: [
      "Complete financial analysis",
      "Easy navigation and setup",
      "Debt management - Easily spot debts",
      "Multiple fee cycles and reminders",
    ],
  },
} as const;
