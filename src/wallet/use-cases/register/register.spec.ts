import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { RegisterWalletUseCase } from '@/wallet/use-cases';
import { IWalletRepository } from '@/wallet/interfaces';
import { SaveWalletDTO } from '@/wallet/dto';
import { AccountType } from '@/shared/constants/enums';
import { FindUserByIdUseCase } from '@/user/use-cases';
import { FindBankByIdUseCase } from '@/bank/use-cases';
import { Wallet } from '@/wallet/infra/entities';

describe('Register Wallet Use Case', () => {
  let registerWalletUseCase: RegisterWalletUseCase;
  let walletRepository: IWalletRepository;
  let findUserByIdUseCase: FindUserByIdUseCase;
  let findBankByIdUseCase: FindBankByIdUseCase;
  let walletData: SaveWalletDTO;
  let createSpy: jest.SpyInstance;
  let findUserByIdExecuteMock: jest.SpyInstance;
  let findBankByIdExecuteMock: jest.SpyInstance;

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
          provide: FindUserByIdUseCase,
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
    findUserByIdUseCase = module.get<FindUserByIdUseCase>(FindUserByIdUseCase);
    findBankByIdUseCase = module.get<FindBankByIdUseCase>(FindBankByIdUseCase);

    createSpy = jest.spyOn(walletRepository, 'create');
    findUserByIdExecuteMock = jest.spyOn(findUserByIdUseCase, 'execute');
    findBankByIdExecuteMock = jest.spyOn(findBankByIdUseCase, 'execute');

    createSpy.mockResolvedValue({} as Wallet);
    findUserByIdExecuteMock.mockResolvedValue({});
    findBankByIdExecuteMock.mockResolvedValue({});

    walletData = {
      user_id: 'user_id',
      bank_id: 'bank_id',
      account_type: AccountType.CHECKING_ACCOUNT,
      description: 'Descrição da carteira',
    };
  });

  it('should be able to register a new wallet', async () => {
    const result = await registerWalletUseCase.createWallet(walletData);

    expect(result).toBeDefined();
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledWith(walletData);
  });

  it('should not be able to return a wallet when user id does not exist', async () => {
    findUserByIdExecuteMock.mockResolvedValue(undefined);

    await expect(
      registerWalletUseCase.createWallet(walletData),
    ).rejects.toThrowError(NotFoundException);

    expect(findUserByIdExecuteMock).toHaveBeenCalledTimes(1);
    expect(findUserByIdExecuteMock).toHaveBeenCalledWith(walletData.user_id);

    await expect(
      async () => await registerWalletUseCase.createWallet(walletData),
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should not be able to return a wallet when bank id does not exist', async () => {
    findBankByIdExecuteMock.mockResolvedValue(null);

    await expect(
      registerWalletUseCase.createWallet(walletData),
    ).rejects.toThrowError(NotFoundException);

    expect(findBankByIdExecuteMock).toHaveBeenCalledTimes(1);
    expect(findBankByIdExecuteMock).toHaveBeenCalledWith(walletData.bank_id);

    await expect(
      async () => await registerWalletUseCase.createWallet(walletData),
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should not be able to return a wallet if the wallet register fails', async () => {
    createSpy.mockRejectedValueOnce(
      new BadRequestException('Erro ao criar a carteira.'),
    );

    await expect(
      registerWalletUseCase.createWallet(walletData),
    ).rejects.toThrowError(BadRequestException);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledWith(walletData);
  });
});
