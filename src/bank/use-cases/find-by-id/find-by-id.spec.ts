import { NotFoundException } from '@nestjs/common';

import { IBankRepository } from '@/bank/interfaces';
import { FindBankByIdUseCase } from '@/bank/use-cases';
import { Bank } from '@/bank/infra/entities';

describe('Find Bank by Id', () => {
  let bankRepository: jest.Mocked<IBankRepository>;
  let sut: FindBankByIdUseCase;
  let findByIdMock: jest.SpyInstance;

  beforeAll(() => {
    bankRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<IBankRepository>;

    sut = new FindBankByIdUseCase(bankRepository);

    findByIdMock = jest.spyOn(bankRepository, 'findById');
  });

  const bankId = '097d540a-2298-4600-b0f4-77f1e3aasf2';
  const invalidBankId = 'invalid-bank-id';

  const bank = {
    id: bankId,
    name: 'anyBank',
    logo_url: 'anyURL',
  } as Bank;

  it('should be defined', () => {
    expect(bankRepository).toBeDefined();
    expect(findByIdMock).toBeDefined();
    expect(sut).toBeDefined();
  });

  it('should be able to return a bank', async () => {
    findByIdMock.mockResolvedValue(bank);

    const result = await sut.execute(bankId);

    expect(result.bank).toEqual(bank);
    expect(findByIdMock).toHaveBeenCalledWith(bankId);
    expect(findByIdMock).toHaveBeenCalledTimes(1);
  });

  it('should not be able to return a bank', async () => {
    findByIdMock.mockResolvedValueOnce(null);

    await expect(sut.execute(invalidBankId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
