import { NotFoundException } from '@nestjs/common';

import { RegisterWalletUseCase } from '@/wallet/use-cases';
import { IWalletRepository } from '@/wallet/interfaces';
import { SaveWalletDTO } from '@/wallet/dto';
import { AccountType } from '@/shared/constants/enums';
import { FindUserByIdUseCase } from '@/user/use-cases';
import { FindBankByIdUseCase } from '@/bank/use-cases';
import { Wallet } from '@/wallet/infra/entities';

describe('Register Wallet Use Case', () => {
  let walletData: SaveWalletDTO;
  let createSpy: jest.SpyInstance;
  let walletRepository: jest.Mocked<IWalletRepository>;
  let registerWalletUseCase: RegisterWalletUseCase;
  let findUserByIdUseCase: FindUserByIdUseCase;
  let findBankByIdUseCase: FindBankByIdUseCase;
  let findUserByIdExecuteMock: jest.SpyInstance;
  let findBankByIdExecuteMock: jest.SpyInstance;

  const mockWallet: Wallet = {
    id: '01',
    account_type: AccountType.CHECKING_ACCOUNT,
    description: 'Primeira Descrição de carteira.',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    bank: null,
    user: null,
    transactions: null,
  } as Wallet;

  beforeEach(() => {
    walletRepository = {
      create: jest.fn(),
    } as unknown as jest.Mocked<IWalletRepository>;

    findUserByIdUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<FindUserByIdUseCase>;

    findBankByIdUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<FindBankByIdUseCase>;

    createSpy = jest.spyOn(walletRepository, 'create');
    findUserByIdExecuteMock = jest.spyOn(findUserByIdUseCase, 'execute');
    findBankByIdExecuteMock = jest.spyOn(findBankByIdUseCase, 'execute');

    registerWalletUseCase = new RegisterWalletUseCase(
      walletRepository,
      findUserByIdUseCase,
      findBankByIdUseCase,
    );

    createSpy.mockResolvedValue(mockWallet);
    findUserByIdExecuteMock.mockResolvedValue({});
    findBankByIdExecuteMock.mockResolvedValue({});

    walletData = {
      user_id: 'user_id',
      bank_id: 'bank_id',
      account_type: AccountType.CHECKING_ACCOUNT,
      description: 'Descrição da carteira',
    };
  });

  it('should be defined', () => {
    expect(walletRepository).toBeDefined();
    expect(findUserByIdExecuteMock).toBeDefined();
    expect(findBankByIdExecuteMock).toBeDefined();
  });

  it('should be able to register a new wallet', async () => {
    const result = await registerWalletUseCase.createWallet(walletData);

    expect(result).toBeDefined();
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledWith(walletData);
  });

  it('should not be able to return a wallet when user id does not exist', async () => {
    findUserByIdExecuteMock.mockResolvedValue(null);

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
});
