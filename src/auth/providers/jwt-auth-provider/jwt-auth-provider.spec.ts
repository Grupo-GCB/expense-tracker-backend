import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import * as jwksRsa from 'jwks-rsa';

import { IDecodedTokenPayload, IUserRepository } from '@/user/interfaces';
import { SignInUseCase } from '@/user/use-cases';
import { JwtAuthProvider } from '@/auth/providers';
import { JwtService } from '@nestjs/jwt';

describe('Jwt Auth Provider', () => {
  let usersRepository: IUserRepository;
  let jwtAuthProvider: JwtAuthProvider;
  let decodeMock: jest.SpyInstance;
  let getSigningKeyMock: jest.SpyInstance;
  let getPublicKeyMock: jest.SpyInstance;
  let verifyAsyncMock: jest.SpyInstance;
  let jwksRsaMock: jest.MockedFunction<typeof jwksRsa>;

  let userPayload: Pick<IDecodedTokenPayload, 'sub' | 'name' | 'email'>;

  beforeAll(async () => {
    jwtAuthProvider = new JwtAuthProvider();
    decodeMock = jest.spyOn(jwtAuthProvider, 'decode');
  });

  describe('decode', () => {
    it.only('Should be to throw an error if passed token is invalid', async () => {
      const expectedError = 'anyString';
      decodeMock.mockRejectedValue(new Error());

      expect(jwtAuthProvider.decode(expectedError)).rejects.toBeInstanceOf(
        Error,
      );
      expect(jwtAuthProvider.decode).toHaveBeenCalledTimes(1);
    });
  });

  //   describe('jwksRsa', () => { });

  //   describe('getSigningKey', () => {});

  //   describe('getPublicKey', () => {});

  //   describe('getPublicKey', () => {});
});
