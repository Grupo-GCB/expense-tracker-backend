import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { Transaction } from '@/transaction/infra/entities';
import { ITransactionRepository } from '@/transaction/interface';
import { DeleteTransactionUseCase } from '@/transaction/use-cases';

describe('Delete Transaction Use Case', () => {
  let transactionRepository: ITransactionRepository;
  let sut: DeleteTransactionUseCase;

  const validTransactionId = 'valid-id';
  const invalidTransactionId = 'invalid-id';

  const transaction: Transaction = {
    id: validTransactionId,
  } as Transaction;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteTransactionUseCase,
        {
          provide: ITransactionRepository,
          useValue: {
            findById: jest.fn().mockResolvedValue(transaction),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    sut = module.get<DeleteTransactionUseCase>(DeleteTransactionUseCase);
    transactionRepository = module.get<ITransactionRepository>(
      ITransactionRepository,
    );
  });

  it('should be able to delete a transaction if transaction exist', async () => {
    await sut.execute({ id: transaction.id });

    expect(transactionRepository.findById).toHaveBeenCalledTimes(1);
    expect(transactionRepository.findById).toHaveBeenCalledWith(transaction.id);

    expect(transactionRepository.delete).toHaveBeenCalledTimes(1);
    expect(transactionRepository.delete).toHaveBeenCalledWith(transaction.id);
  });

  it('should not be able to delete a transaction if transaction does not exist', async () => {
    jest
      .spyOn(transactionRepository, 'findById')
      .mockRejectedValueOnce(new NotFoundException());

    const nonExistingTransactionId: Transaction = {
      ...transaction,
      id: invalidTransactionId,
    };

    await expect(sut.execute(nonExistingTransactionId)).rejects.toBeInstanceOf(
      NotFoundException,
    );

    expect(transactionRepository.findById).toHaveBeenCalledTimes(1);
    expect(transactionRepository.findById).toHaveBeenCalledWith(
      nonExistingTransactionId.id,
    );

    expect(transactionRepository.delete).not.toHaveBeenCalled();
  });
});
