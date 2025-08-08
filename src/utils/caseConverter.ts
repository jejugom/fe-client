//  snake_case → camelCase 변환 함수
export function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => toCamelCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const camelKey = key.replace(/([-_][a-z])/g, (g) => g[1].toUpperCase());
      acc[camelKey] = toCamelCase(value);
      return acc;
    }, {} as any);
  }
  return obj;
}

//  객체의 모든 키를 camelCase로 재귀 변환
export function toCamelCaseKeysDeep(input: any): any {
  if (Array.isArray(input)) {
    return input.map(toCamelCaseKeysDeep);
  }

  if (input !== null && typeof input === 'object') {
    return Object.entries(input).reduce(
      (acc, [key, value]) => {
        const camelKey = toCamelCase(key);
        acc[camelKey] = toCamelCaseKeysDeep(value);
        return acc;
      },
      {} as Record<string, any>
    );
  }

  return input;
}
