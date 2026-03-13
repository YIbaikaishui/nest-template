import { v7 as uuidv7 } from 'uuid';

/**
 * ID 生成工具
 * 统一使用 UUIDv7（时间有序，适合数据库主键）
 */
export function generateId(): string {
  return uuidv7();
}
