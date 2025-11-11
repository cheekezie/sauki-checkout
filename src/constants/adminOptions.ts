import { GENDER_OPTIONS_WITH_UNSPECIFIED } from "./sharedOptions";
import { MerchantRoles } from "@/enums/merchant.enum";

export const roleOptions = [
  { value: MerchantRoles.PORTAL_ADMIN, label: "Portal Admin" },
  { value: MerchantRoles.ORG_ADMIN, label: "Organization Admin" },
  { value: MerchantRoles.GROUP_ADMIN, label: "Group Admin" },
  { value: MerchantRoles.BASIC_STAFF, label: "Basic Staff" },
];

export const genderOptions = GENDER_OPTIONS_WITH_UNSPECIFIED;
