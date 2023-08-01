import { IsJWT, IsNotEmpty } from 'class-validator';

export class UserTokenDTO {
  @IsNotEmpty({ message: 'Necessário informar o id.' })
  @IsJWT({ message: 'token deve ser um JWT.' })
  token: string;
}
