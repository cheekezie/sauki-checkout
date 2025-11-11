export const TERTIARY_CATEGORY_OPTIONS = [
  { value: "university", label: "University" },
  { value: "polytechnic", label: "Polytechnic" },
  { value: "coe", label: "College of Education" },
] as const;

export const PRIMARY_SECONDARY_CATEGORY_OPTIONS = [
  { value: "privateSchool", label: "Private School" },
  { value: "methodistSchool", label: "Methodist School" },
  { value: "anglicanSchool", label: "Anglican School" },
  { value: "catholicSchool", label: "Catholic School" },
  { value: "publicPrimarySchool", label: "Public Primary School" },
  { value: "publicSecondarySchool", label: "Public Secondary School" },
  { value: "publicTechnicalSchool", label: "Public Technical School" },
  { value: "unitySchool", label: "Unity School" },
  { value: "islamic", label: "Islamic School" },
  { value: "adultEducation", label: "Adult Education" },
  { value: "nonCategory", label: "Non Category" },
] as const;

export const getCategoryOptions = (isTertiary: boolean) =>
  isTertiary ? TERTIARY_CATEGORY_OPTIONS : PRIMARY_SECONDARY_CATEGORY_OPTIONS;

export const getSchoolCategoryBoardOptions = (schoolType: 'primary' | 'secondary' | 'tertiary' | string) => {
  if (schoolType === "tertiary") {
    return TERTIARY_CATEGORY_OPTIONS;
  }
  if (schoolType === "primary") {
    return PRIMARY_SECONDARY_CATEGORY_OPTIONS.filter(
      (option) => 
        option.value !== "publicSecondarySchool" && 
        option.value !== "publicTechnicalSchool"
    );
  }
  if (schoolType === "secondary") {
    return PRIMARY_SECONDARY_CATEGORY_OPTIONS.filter(
      (option) => option.value !== "publicPrimarySchool"
    );
  }
  return PRIMARY_SECONDARY_CATEGORY_OPTIONS;
};
