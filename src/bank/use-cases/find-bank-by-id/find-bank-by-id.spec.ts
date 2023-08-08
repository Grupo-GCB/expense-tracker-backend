import { NotFoundException } from '@nestjs/common';

import { IBankRepository } from '@/bank/interfaces';
import { FindBankByIdUseCase } from '@/bank/use-cases';
import { Bank } from '@/bank/infra/entities';

describe('Find Bank by Id', () => {
  let findBankById: FindBankByIdUseCase;
  let bankRepository: jest.Mocked<IBankRepository>;

  global.Date.now = jest.fn(() => new Date('06/08/2020').getTime());

  const bankId = '097d540a-2298-4600-b0f4-77f1e3aasf2';
  const nonExistentBankId = 'non-existent-bank-id';
  const ceratedAtDateMock = new Date('02/05/2023');

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
      created_at: ceratedAtDateMock,
      deleted_at: null,
    } as Bank;

    bankRepository.findById.mockResolvedValue(bank);

    const result = await findBankById.execute(bankId);

    expect(result.bank).toEqual(bank);
    expect(bankRepository.findById).toHaveBeenCalledWith(bankId);
    expect(bankRepository.findById).toHaveBeenCalledTimes(1);
  });
});
