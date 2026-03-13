import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponseDto } from '../dto/api-response.dto';

/**
 * 全局 HTTP 异常过滤器
 * 统一处理所有 HTTP 异常，返回标准响应格式
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // 提取错误信息
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as { message?: string | string[] }).message
          ? Array.isArray((exceptionResponse as { message: string[] }).message)
            ? (exceptionResponse as { message: string[] }).message[0]
            : (exceptionResponse as { message: string }).message
          : exception.message;

    this.logger.warn(
      `[${request.method}] ${request.url} -> ${status}: ${message}`,
    );

    response.status(status).json(ApiResponseDto.fail(status, message));
  }
}
