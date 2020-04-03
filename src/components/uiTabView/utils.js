export const oneOf = (value, list) => {
  if (!Array.isArray(list)) return false;
  return list.some(d => d === value);
};
