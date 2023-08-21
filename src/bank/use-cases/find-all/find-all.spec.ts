import { IBankRepository } from '@/bank/interfaces';
import { FindAllBanksUseCase } from '@/bank/use-cases';
import { Bank } from '@/bank/infra/entities';

describe('Find Banks by Id', () => {
  let sut: FindAllBanksUseCase;
  let findAllMock: jest.SpyInstance;
  let bankRepository: jest.Mocked<IBankRepository>;

  beforeAll(async () => {
    bankRepository = {
      findAll: jest.fn(),
    } as unknown as jest.Mocked<IBankRepository>;

    sut = new FindAllBanksUseCase(bankRepository);

    findAllMock = jest.spyOn(bankRepository, 'findAll');
  });

  const bank = {
    id: 'bank-01',
    name: 'anyBank',
    logo_url: 'anyURL',
  } as Bank;

  it('should be defined', () => {
    expect(bankRepository).toBeDefined();
    expect(sut).toBeDefined();
  });

  it('should be able to return all banks', async () => {
    const banks = [bank, bank];

    findAllMock.mockResolvedValue(banks);

    const result = await sut.execute();

    expect(result.banks).toEqual(banks);
    expect(findAllMock).toHaveBeenCalledTimes(1);
  });

  it('should be able to return an empty list when no banks were found', async () => {
    findAllMock.mockResolvedValue([]);

    const result = await sut.execute();

    expect(result).toEqual({ banks: [] });
  });
});
