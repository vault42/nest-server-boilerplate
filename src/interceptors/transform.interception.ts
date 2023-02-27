import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor
} from '@nestjs/common'
import { map, Observable } from 'rxjs'

interface Response<T> {
  data: T
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        const ctx = context.switchToHttp()
        const response = ctx.getResponse()
        const request = ctx.getRequest()

        const code = response.statusCode
        const url = request.url
        const res = {
          code,
          message: null,
          success: true,
          data
        }
        Logger.log(`path: ${url} --- res: ${JSON.stringify(res)}`)
        return res
      })
    )
  }
}
