import { IBankRepository } from '@/bank/interfaces';
import { FindAllBanksUseCase } from '@/bank/use-cases';
import { Bank } from '@/bank/infra/entities';

describe('Find Bank by Id', () => {
  let findAll: FindAllBanksUseCase;
  let bankRepository: jest.Mocked<IBankRepository>;

  beforeAll(() => {
    bankRepository = {
      findAll: jest.fn(),
    } as unknown as jest.Mocked<IBankRepository>;

    findAll = new FindAllBanksUseCase(bankRepository);
  });

  it('should be able to return all banks', async () => {
    const banks = [
      {
        id: 'bank-01',
        name: 'anyBank',
        logo_url: 'anyURL',
      } as Bank,
      {
        id: 'bank-02',
        name: 'anyBank',
        logo_url: 'anyURL',
      } as Bank,
    ];

    bankRepository.findAll.mockResolvedValue(banks);

    const result = await findAll.execute();

    expect(result.banks).toEqual(banks);
    expect(bankRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should be able to return empty list', async () => {
    bankRepository.findAll.mockResolvedValue([]);

    const result = await findAll.execute();

    expect(result).toEqual({ banks: [] });
  });
});
