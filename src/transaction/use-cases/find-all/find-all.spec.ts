import { FindTransactionsByUserUseCase } from '@/transaction/use-cases';
import { ITransactionRepository } from '@/transaction/interface';
import { Transaction } from '@/transaction/infra/entities';
import { Categories, TransactionType } from '@/shared/constants/enums';
import { IUserRepository } from '@/user/interfaces';

describe('Find All Transactions', () => {
  let sut: FindTransactionsByUserUseCase;
  let findAllByUserIdMock: jest.SpyInstance;
  let transactionRepository: jest.Mocked<ITransactionRepository>;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeAll(async () => {
    transactionRepository = {
      findAllByUserId: jest.fn(),
    } as unknown as jest.Mocked<ITransactionRepository>;

    userRepository = {
      findById: jest.fn().mockResolvedValue({}),
    } as unknown as jest.Mocked<IUserRepository>;

    sut = new FindTransactionsByUserUseCase(
      transactionRepository,
      userRepository,
    );
    findAllByUserIdMock = jest.spyOn(transactionRepository, 'findAllByUserId');
  });

  const validUserId = 'google-oauth2|456734566205483104315';

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
    expect(userRepository).toBeDefined();
    expect(sut).toBeDefined();
  });

  it('should be able to return all transactions', async () => {
    findAllByUserIdMock.mockResolvedValue(transactions);

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
