import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT || 3000, function () {
    console.log(
      'express server listening on port %d in %s mode',
      this.address().port,
      app.settings.env,
    );
  });
}
bootstrap();
