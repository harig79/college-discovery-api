import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CollegesModule } from './colleges/colleges.module';
import { CompareModule } from './compare/compare.module';
import { PredictorModule } from './predictor/predictor.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CollegesModule,
    CompareModule,
    PredictorModule,
    AuthModule,
  ],
})
export class AppModule {}
