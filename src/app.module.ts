import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5431,
      username: 'academy',
      password: 'academy',
      database: 'expense-tracker',
      synchronize: true,
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      migrations: [
        `${__dirname}/shared/infra/database/typeorm/migrations/**/*{.ts,.js}`,
      ],
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
