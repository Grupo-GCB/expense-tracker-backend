import { NotFoundException } from '@nestjs/common';

import { IBankRepository } from '@/bank/interfaces';
import { FindBankByIdUseCase } from '@/bank/use-cases';
import { Bank } from '@/bank/infra/entities';

describe('Find Bank by Id', () => {
  let findBankById: FindBankByIdUseCase;
  let bankRepository: jest.Mocked<IBankRepository>;
  let findByIdMock: jest.SpyInstance;

  const bankId = '097d540a-2298-4600-b0f4-77f1e3aasf2';
  const nonExistentBankId = 'non-existent-bank-id';

  beforeAll(() => {
    bankRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<IBankRepository>;

    findBankById = new FindBankByIdUseCase(bankRepository);

    findByIdMock = jest.spyOn(bankRepository, 'findById');
  });

  it('should be able to return a bank', async () => {
    const bank = {
      id: bankId,
      name: 'anyBank',
      logo_url: 'anyURL',
    } as Bank;

    findByIdMock.mockResolvedValue(bank);

    const result = await findBankById.execute(bankId);

    expect(result.bank).toEqual(bank);
    expect(findByIdMock).toHaveBeenCalledWith(bankId);
    expect(findByIdMock).toHaveBeenCalledTimes(1);
  });

  it('should not be able to return a bank', async () => {
    findByIdMock.mockResolvedValueOnce(null);

    await expect(
      findBankById.execute(nonExistentBankId),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
