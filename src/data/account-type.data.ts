import { GraduationCap, School } from "lucide-react";
import type { UserType } from "../interface";

export const USER_TYPES: UserType[] = [
  {
    id: "school",
    title: "School",
    description: "Access your student portal to view grades, assignments, and track your academic progress.",
    icon: GraduationCap,
  },
  {
    id: "other",
    title: "Other",
    description: "Manage your institution, track student performance, and handle administrative tasks.",
    icon: School,
  },
];

export const DEFAULT_USER_TYPE: UserType["id"] = "school";
