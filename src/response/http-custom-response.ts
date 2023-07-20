import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class HttpCustomResponse {
  public HttpResponse(data: any, method?: string) {
    if (this.isNullOrEmpty(data)) {
      throw new NotFoundException(['no records found']);
    }
    return {
      statusCode: method == 'POST' ? 201 : 200,
      data,
      timestamp: new Date().toISOString(),
      message: [data?.message || 'success'],
      method,
    };
  }

  private isNullOrEmpty(data: any): boolean {
    return data == undefined || data == null || data == '';
  }
}
