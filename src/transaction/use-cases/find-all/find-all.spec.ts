import { FindTransactionsByUserUseCase } from '@/transaction/use-cases';
import { ITransactionRepository } from '@/transaction/interfaces';
import { Transaction } from '@/transaction/infra/entities';
import { Categories, TransactionType } from '@/shared/constants/enums';

describe('Find All Transactions', () => {
  let sut: FindTransactionsByUserUseCase;
  let findAllByUserIdMock: jest.SpyInstance;
  let transactionRepository: jest.Mocked<ITransactionRepository>;

  beforeAll(async () => {
    transactionRepository = {
      findAllByUserId: jest.fn(),
    } as unknown as jest.Mocked<ITransactionRepository>;

    sut = new FindTransactionsByUserUseCase(transactionRepository);
    findAllByUserIdMock = jest.spyOn(transactionRepository, 'findAllByUserId');
  });

  const validUserId = 'auth0|user-id';

  const transactions: Transaction[] = [
    {
      id: '01',
      categories: Categories.CLOTHES,
      description: 'Sample Transaction 1',
      value: 100.0,
      type: TransactionType.EXPENSE,
      date: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      wallet: null,
    },
  ];

  it('should be defined', () => {
    expect(transactionRepository).toBeDefined();
    expect(sut).toBeDefined();
  });

  it('should be able to return all transactions', async () => {
    findAllByUserIdMock.mockResolvedValue([{ transactions }]);

    const result = await sut.execute(validUserId);

    expect(result).toEqual(
      expect.arrayContaining(
        transactions.map((transaction) => ({
          transactions: expect.arrayContaining([transaction]),
        })),
      ),
    );

    expect(findAllByUserIdMock).toHaveBeenCalledTimes(1);
  });

  it('should not be able to return transactions if they were not found', async () => {
    findAllByUserIdMock.mockResolvedValue([]);

    const result = await sut.execute(validUserId);

    expect(result).toEqual([]);
    expect(findAllByUserIdMock).toHaveBeenCalledTimes(1);
  });
});
