import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import { PrismaClientExceptionFilter } from './filters/prisma-client-exception.filter'
import { TransformInterceptor } from './interceptors/transform.interception'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api', {
    // exclude: ['']
  })
  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  )
  const config = new DocumentBuilder()
    .setTitle('Nest Server')
    .setDescription('The API Server Powered By Nest.js')
    .setVersion('0.1')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('doc', app, document)

  const { httpAdapter } = app.get(HttpAdapterHost)
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))

  await app.listen(3001)
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
