/**
 * 去除对象中为空或undefined的值
 * @param object 指定对象
 * @return {{}}
 */
export const removeObjectNil = object => {
  if (!object) return {};
  const newObject = {};
  Object.keys(object).forEach(key => {
    if (object[key] !== undefined && object[key] !== '') {
      newObject[key] = object[key];
    }
  });
  return newObject;
};
/**
 * 是否包含
 * @param value 指定值
 * @param list 全部值
 * @return {Boolean}
 */
export function oneOf(value, list) {
  return list.some(item => item === value);
}
