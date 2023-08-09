import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { RegisterWalletUseCase } from '@/wallet/use-cases';
import { IWalletRepository } from '@/wallet/interfaces';
import { SaveWalletDTO } from '@/wallet/dto';
import { AccountType } from '@/shared/constants/enums';

describe('RegisterWalletUseCase', () => {
  let registerWalletUseCase: RegisterWalletUseCase;
  let walletRepository: IWalletRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterWalletUseCase,
        {
          provide: IWalletRepository,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    registerWalletUseCase = module.get<RegisterWalletUseCase>(
      RegisterWalletUseCase,
    );
    walletRepository = module.get<IWalletRepository>(IWalletRepository);
  });

  describe('createWallet', () => {
    /*it('should create a new wallet', async () => {
      const walletData: SaveWalletDTO = {
        title: 'Minha Carteira',
        account_type: AccountType.CHECKING_ACCOUNT,
        description: 'Descrição da carteira',
        bankId: '4e8b5d94-6b16-4a42-b6d1-dc58b553d109',
        userId: 'auth0|58vfb567d5asdea52bc65ebba',
      };

      const createdWallet: Wallet = {
        id: 'b14948da-1e67-4f72-bcc6-f30dd5c42b9f',
        ...walletData,
        created_at: new Date(),
      };

      walletRepository.create = jest.fn().mockResolvedValue(createdWallet);

      const result = await registerWalletUseCase.createWallet(walletData);

      expect(result).toEqual(createdWallet);
      expect(walletRepository.create).toHaveBeenCalledWith(walletData);
    }); */

    it('should not be able to create a wallet', async () => {
      const walletData: SaveWalletDTO = {
        account_type: AccountType.CHECKING_ACCOUNT,
        description: 'Descrição da carteira',
        bank_id: '4e8b5d94-6b16-4a42-b6d1-dc58b553d109',
        user_id: 'auth0|58vfb567d5asdea52bc65ebba',
      };

      walletRepository.create = jest
        .fn()
        .mockRejectedValue(new BadRequestException('Failed to create wallet'));

      await expect(
        registerWalletUseCase.createWallet(walletData),
      ).rejects.toThrowError(BadRequestException);
    });
  });
});
