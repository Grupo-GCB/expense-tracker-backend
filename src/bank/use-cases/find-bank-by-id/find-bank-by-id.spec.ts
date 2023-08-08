import { NotFoundException } from '@nestjs/common';

import { IBankRepository } from '@/bank/interfaces';
import { FindBankByIdUseCase } from '@/bank/use-cases';
import { Bank } from '@/bank/infra/entities';

describe('Find Bank by Id', () => {
  let findBankById: FindBankByIdUseCase;
  let bankRepository: jest.Mocked<IBankRepository>;

  const bankId = '097d540a-2298-4600-b0f4-77f1e3aasf2';
  const nonExistentBankId = 'non-existent-bank-id';

  beforeAll(() => {
    bankRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<IBankRepository>;

    findBankById = new FindBankByIdUseCase(bankRepository);
  });

  it('should be able to return a bank', async () => {
    const bank = {
      id: bankId,
      name: 'anyBank',
      logo_url: 'anyURL',
    } as Bank;

    bankRepository.findById.mockResolvedValue(bank);

    const result = await findBankById.execute(bankId);

    expect(result.bank).toEqual(bank);
    expect(bankRepository.findById).toHaveBeenCalledWith(bankId);
    expect(bankRepository.findById).toHaveBeenCalledTimes(1);
  });

  it('should not be able to return a bank', async () => {
    bankRepository.findById.mockResolvedValueOnce(null);

    await expect(
      findBankById.execute(nonExistentBankId),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
