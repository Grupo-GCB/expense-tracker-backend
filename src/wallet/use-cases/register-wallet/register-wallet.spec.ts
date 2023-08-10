import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { RegisterWalletUseCase } from '@/wallet/use-cases';
import { IWalletRepository } from '@/wallet/interfaces';
import { SaveWalletDTO } from '@/wallet/dto';
import { AccountType } from '@/shared/constants/enums';
import { ListUserByIdUseCase } from '@/user/use-cases';
import { FindBankByIdUseCase } from '@/bank/use-cases';
import { Wallet } from '@/wallet/infra/entities';

describe('Register Wallet Use Case', () => {
  let registerWalletUseCase: RegisterWalletUseCase;
  let walletRepository: IWalletRepository;
  let listUserByIdUseCase: ListUserByIdUseCase;
  let findBankByIdUseCase: FindBankByIdUseCase;
  let createdUser: SaveWalletDTO;

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
        {
          provide: ListUserByIdUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: FindBankByIdUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    registerWalletUseCase = module.get<RegisterWalletUseCase>(
      RegisterWalletUseCase,
    );
    walletRepository = module.get<IWalletRepository>(IWalletRepository);
    listUserByIdUseCase = module.get<ListUserByIdUseCase>(ListUserByIdUseCase);
    findBankByIdUseCase = module.get<FindBankByIdUseCase>(FindBankByIdUseCase);

    createdUser = {
      user_id: 'user_id',
      bank_id: 'bank_id',
      account_type: AccountType.CHECKING_ACCOUNT,
      description: 'Descrição da carteira',
    };
  });

  it('should be able to register a new wallet', async () => {
    listUserByIdUseCase.execute = jest.fn().mockResolvedValueOnce({});
    findBankByIdUseCase.execute = jest.fn().mockResolvedValueOnce({});
    walletRepository.create = jest.fn().mockResolvedValue({} as Wallet);

    const result = await registerWalletUseCase.createWallet(createdUser);

    expect(result).toBeDefined();
    expect(walletRepository.create).toHaveBeenCalledWith(createdUser);
  });

  it('should not be able to return a wallet when bank id do not exist', async () => {
    listUserByIdUseCase.execute = jest.fn().mockResolvedValueOnce({});
    findBankByIdUseCase.execute = jest.fn().mockResolvedValueOnce(null);

    await expect(
      registerWalletUseCase.createWallet(createdUser),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should not be able to return a wallet when user id do not exist', async () => {
    listUserByIdUseCase.execute = jest.fn().mockResolvedValueOnce(undefined);
    findBankByIdUseCase.execute = jest.fn().mockResolvedValueOnce({});

    await expect(
      registerWalletUseCase.createWallet(createdUser),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should not be able to return a wallet if the wallet register fails', async () => {
    listUserByIdUseCase.execute = jest.fn().mockResolvedValueOnce({});
    findBankByIdUseCase.execute = jest.fn().mockResolvedValueOnce({});

    walletRepository.create = jest
      .fn()
      .mockRejectedValue(new BadRequestException('Erro ao criar a carteira.'));

    await expect(
      registerWalletUseCase.createWallet(createdUser),
    ).rejects.toThrowError(BadRequestException);
  });
});
