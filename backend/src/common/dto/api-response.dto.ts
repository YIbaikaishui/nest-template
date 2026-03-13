/**
 * 统一 API 响应体 DTO
 * 所有接口返回值必须使用此结构
 */
export class ApiResponseDto<T = unknown> {
  /** 是否成功 */
  success: boolean;

  /** 业务状态码 */
  code: number;

  /** 提示信息 */
  message: string;

  /** 响应数据 */
  data: T | null;

  /** 响应时间戳 */
  timestamp: string;

  constructor(
    success: boolean,
    code: number,
    message: string,
    data: T | null = null,
  ) {
    this.success = success;
    this.code = code;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  /** 成功响应 */
  static ok<T>(data: T, message = 'success'): ApiResponseDto<T> {
    return new ApiResponseDto(true, 200, message, data);
  }

  /** 创建成功响应 */
  static created<T>(data: T, message = 'created'): ApiResponseDto<T> {
    return new ApiResponseDto(true, 201, message, data);
  }

  /** 失败响应 */
  static fail(code: number, message: string): ApiResponseDto<null> {
    return new ApiResponseDto(false, code, message, null);
  }
}
