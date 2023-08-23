import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import {
  AccountType,
  Categories,
  TransactionType,
} from '@/shared/constants/enums';
import { Transaction } from '@/transaction/infra/entities';
import { ITransactionRepository } from '@/transaction/interface';
import { RegisterTransactionUseCase } from '@/transaction/use-cases';
import { Wallet } from '@/wallet/infra/entities';
import { IWalletRepository } from '@/wallet/interfaces';

describe('Register Transaction Use Case', () => {
  let sut: RegisterTransactionUseCase;
  let walletRepository: IWalletRepository;
  let transactionRepository: ITransactionRepository;

  const walletValidId = 'valid-id';
  const walletInvalidId = 'invalid-id';

  const mockWallet = {
    id: walletValidId,
    account_type: AccountType.CHECKING_ACCOUNT,
    description: 'Primeira Descrição de carteira.',
  } as Wallet;

  const mockTransactionResponse = {
    id: 'anyId',
    value: 50,
    type: TransactionType.INCOME,
    description: 'Descrição',
  } as Transaction;

  const transactionDataParams = {
    value: 50,
    type: TransactionType.INCOME,
    description: 'Descrição',
    categories: Categories.HOME,
  } as Transaction;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterTransactionUseCase,
        {
          provide: ITransactionRepository,
          useValue: {
            create: jest.fn().mockResolvedValue(mockTransactionResponse),
          },
        },
        {
          provide: IWalletRepository,
          useValue: {
            findById: jest.fn().mockResolvedValue(mockWallet),
          },
        },
      ],
    }).compile();

    sut = module.get<RegisterTransactionUseCase>(RegisterTransactionUseCase);
    transactionRepository = module.get<ITransactionRepository>(
      ITransactionRepository,
    );
    walletRepository = module.get<IWalletRepository>(IWalletRepository);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
    expect(walletRepository).toBeDefined();
    expect(transactionRepository).toBeDefined();
  });

  it('should be able to register a new transaction', async () => {
    const result = await sut.execute(walletValidId, transactionDataParams);

    expect(result).toEqual(mockTransactionResponse);

    expect(walletRepository.findById).toHaveBeenCalledTimes(1);
    expect(walletRepository.findById).toHaveBeenCalledWith(walletValidId);

    expect(transactionRepository.create).toHaveBeenCalledTimes(1);
    expect(transactionRepository.create).toHaveBeenCalledWith(
      walletValidId,
      transactionDataParams,
    );
  });

  it('should not be able to return a wallet when user id does not exist', async () => {
    jest.spyOn(walletRepository, 'findById').mockResolvedValueOnce(null);

    expect(
      async () => await sut.execute(walletInvalidId, transactionDataParams),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(walletRepository.findById).toHaveBeenCalledTimes(1);
    expect(walletRepository.findById).toHaveBeenCalledWith(walletInvalidId);

    expect(transactionRepository.create).not.toHaveBeenCalled();
  });

  it('shold be able to transform the value into negative if the transaction type is expense', async () => {
    transactionDataParams.type = TransactionType.EXPENSE;

    const result = await sut.execute(walletValidId, transactionDataParams);

    expect(result.value).toEqual(-transactionDataParams.value);

    expect(result).toEqual(mockTransactionResponse);

    expect(walletRepository.findById).toHaveBeenCalledTimes(1);
    expect(walletRepository.findById).toHaveBeenCalledWith(walletValidId);

    expect(transactionRepository.create).toHaveBeenCalledTimes(1);
    expect(transactionRepository.create).toHaveBeenCalledWith(
      walletValidId,
      transactionDataParams,
    );
  });
});
