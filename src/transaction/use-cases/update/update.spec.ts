import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { Categories, TransactionType } from '@/shared/constants/enums';
import { Transaction } from '@/transaction/infra/entities';
import { ITransactionRepository } from '@/transaction/interfaces';
import { UpdateTransactionUseCase } from '@/transaction/use-cases';
import { Wallet } from '@/wallet/infra/entities';
import { IWalletRepository } from '@/wallet/interfaces';
import { UpdateTransactionDTO } from '@/transaction/dto/update-transaction-dto';

describe('Update Transaction Use Case', () => {
  let sut: UpdateTransactionUseCase;
  let walletRepository: IWalletRepository;
  let transactionRepository: ITransactionRepository;

  const validWalletId = 'valid-id';
  const invalidWalletId = 'invalid-id';

  const validTransactionId = 'valid-id';
  const invalidTransactionId = 'invalid-id';

  const mockWallet = {
    id: validWalletId,
  } as Wallet;

  const mockTransactionResponse = {
    id: validTransactionId,
    categories: Categories.ELECTRONICS,
    description: 'atualizou',
    value: 25,
    type: TransactionType.EXPENSE,
    wallet: {
      id: validWalletId,
    } as Wallet,
  } as Transaction;

  const mockUpdateDTOData: UpdateTransactionDTO = {
    wallet_id: validWalletId,
    categories: Categories.HOME,
    description: 'atualizou',
    value: 50,
    type: TransactionType.INCOME,
    date: new Date('2023-11-10'),
  };

  const mockUpdatedTransaction = {
    id: validTransactionId,
    categories: Categories.HOME,
    description: 'atualizou',
    value: 50,
    type: TransactionType.INCOME,
    wallet: {
      id: validWalletId,
    } as Wallet,
  } as Transaction;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateTransactionUseCase,
        {
          provide: ITransactionRepository,
          useValue: {
            update: jest.fn().mockResolvedValue(mockUpdatedTransaction),
            findById: jest.fn().mockResolvedValue(mockTransactionResponse),
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

    sut = module.get<UpdateTransactionUseCase>(UpdateTransactionUseCase);
    transactionRepository = module.get<ITransactionRepository>(
      ITransactionRepository,
    );
    walletRepository = module.get<IWalletRepository>(IWalletRepository);
  });

  it('shold be defined', () => {
    expect(sut).toBeDefined();
    expect(transactionRepository).toBeDefined();
    expect(walletRepository).toBeDefined();
  });

  it('shold be able to update a transaction', async () => {
    const result = await sut.execute(validTransactionId, mockUpdateDTOData);

    expect(transactionRepository.findById).toHaveBeenCalledTimes(2);
    expect(transactionRepository.findById).toHaveBeenCalledWith(
      validTransactionId,
    );

    expect(walletRepository.findById).toHaveBeenCalledTimes(1);
    expect(walletRepository.findById).toHaveBeenCalledWith(
      mockUpdateDTOData.wallet_id,
    );

    expect(transactionRepository.update).toHaveBeenCalledTimes(1);
    expect(transactionRepository.update).toHaveBeenCalledWith(
      mockTransactionResponse,
    );

    expect(result).toEqual(mockTransactionResponse);
  });

  it('shold not be able to update a transaction if transaction does not exist', async () => {
    jest.spyOn(transactionRepository, 'findById').mockResolvedValueOnce(null);

    await expect(
      sut.execute(invalidTransactionId, mockUpdateDTOData),
    ).rejects.toThrow(new NotFoundException('Transação não encontrada'));

    expect(transactionRepository.findById).toHaveBeenCalledTimes(1);
    expect(transactionRepository.findById).toHaveBeenCalledWith(
      invalidTransactionId,
    );
  });

  it('shold not be able to update a transaction if wallet does not exist', async () => {
    jest.spyOn(walletRepository, 'findById').mockResolvedValueOnce(null);

    mockUpdateDTOData.wallet_id = invalidWalletId;

    await expect(
      sut.execute(validTransactionId, mockUpdateDTOData),
    ).rejects.toThrow(new NotFoundException('Carteira não encontrada.'));

    expect(walletRepository.findById).toHaveBeenCalledTimes(1);
    expect(walletRepository.findById).toHaveBeenCalledWith(
      invalidTransactionId,
    );
  });

  it('shold be able to transform the value into negative if the transaction type is expense', async () => {
    mockUpdateDTOData.type = TransactionType.EXPENSE;

    const result = await sut.execute(validTransactionId, mockUpdateDTOData);

    expect(result.value).toEqual(-mockUpdatedTransaction.value);
  });
});
