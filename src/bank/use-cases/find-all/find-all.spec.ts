import { IBankRepository } from '@/bank/interfaces';
import { FindAllBanksUseCase } from '@/bank/use-cases';
import { Bank } from '@/bank/infra/entities';
import { Test, TestingModule } from '@nestjs/testing';

describe('Find Banks by Id', () => {
  let findAll: FindAllBanksUseCase;
  let bankRepository: jest.Mocked<IBankRepository>;
  let findAllMock: jest.SpyInstance;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllBanksUseCase,
        { provide: IBankRepository, useValue: { findAll: jest.fn() } },
      ],
    }).compile();

    bankRepository = module.get(IBankRepository);
    findAll = module.get(FindAllBanksUseCase);

    findAllMock = jest.spyOn(bankRepository, 'findAll');
  });

  it('should be defined', () => {
    expect(bankRepository).toBeDefined();
    expect(findAll).toBeDefined();
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

    findAllMock.mockResolvedValue(banks);

    const result = await findAll.execute();

    expect(result.banks).toEqual(banks);
    expect(findAllMock).toHaveBeenCalledTimes(1);
  });

  it('should be able to return an empty list when no banks were found', async () => {
    findAllMock.mockResolvedValue([]);

    const result = await findAll.execute();

    expect(result).toEqual({ banks: [] });
  });
});
