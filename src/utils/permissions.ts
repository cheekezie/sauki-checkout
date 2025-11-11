export const hasPermission = (perms: string[] | undefined, required: string | string[]) => {
  if (!perms || perms.length === 0) return false;
  const need = Array.isArray(required) ? required : [required];
  return need.every((p) => perms.includes(p));
};



