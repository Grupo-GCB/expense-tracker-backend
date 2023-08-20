import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class UserTokenDTO {
  @IsNotEmpty({ message: 'Necessário informar o id.' })
  @IsString({ message: 'Id deve ser uma string.' })
  @IsJWT({ message: 'Token deve ser um JWT.' })
  @ApiProperty({
    example:
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IasdasdweZCI6IkxjdU1WSmRRbjNjanRsV0NfNGh1dyJ9.eyJnaXZlbl9uYW1lIubkuSWEFdXN0byIsImZhbWlseV9uYW1lIjoic2FudGFuYSIsIm5pY2tuYW1lIjoiZ3V0eS52ZXJ0b2xpcyIsIm5hbWUiOiJhdWd1c3RvIHNhbnRhbmEiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUFjSFR0ZlYxdFItVlBhNlFsU3V6M2ZqbHo5aGtDZHE4RkU2SmRxLUtkbDAtSXY2blJzPXM5Ni1jIiwibG9jYWxlIjoiZW4iLCJ1cGRhdGVkX2F0IjoiMjAyMy0wOC0wMVQxMjo1OToyMS4zNjBaIiwiZW1haWwiOiJndXR5LnZlcnRvbGlzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL2djYi1hY2FkZW15LnVzLmF1dGgwLmNvbS8iLCJhdWQiOiJ4VVh6SlcwalNvWUtwYkpvVlNDbDlNUWI4U2dnaW5INiIsImlhdCI6MTY5MDg5NDc2MiwiZXhwIjoxNjkwOTMwNzYyLCJzdWIiOiJnb29nbGUtb2F1dGgyfDEwNDIzNDU2NjIwNTQ4MzEwNDMxNSIsInNpZCI6IkQ0S2g1S0F4SjhRMTZTcGNRNXhCVkJVQzlDSkstUWxYIiwibm9uY2UiOiJENDVTeENKTUktQWtwVS1CZXVQbFVpNjNwZXZ3ZUpHU21hMVhDYVN6WjM4In0.ykR5ru7RriuGRVvE-5u8aPmeunxAdi-MmMP8ZhwrsZ2oXZMAm5rZRRMhfXmFdR64ekxscMWzMjfDWX6A6ulco3BMjXTu9FUXQcMFz0lP6fqEtosW2WjHcKgXNdkCM3Xzh2BDItguL0U03fzvj1q9T63cpZLAbr_4N7dYw5Nad1d18GJDdtxBetmszXf3b_Tag8hlytvlb5PBoByDZPeQv23EbXKfUsKuITM5VZ1InqUoq8ARrgrpDRN-U7PkiVLrzCxjH5EBs7Qi0i-gm5iFwcDAgas8d4f6asd3MCme6Gg_m7df0AEaadf51gadfg1BdefXGHeuH3lGQ',
    description: 'Token do usuário.',
    type: 'string',
    required: true,
  })
  token: string;
}
