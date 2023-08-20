import { NotFoundException } from '@nestjs/common';

import { AccountType } from '@/shared/constants';
import { IWalletRepository } from '@/wallet/interfaces';
import { FindWalletByIdUseCase } from '@/wallet/use-cases';

describe('Find Bank by ID', () => {
  let findWalletById: FindWalletByIdUseCase;
  let walletRepository: jest.Mocked<IWalletRepository>;
  let findByIdMock: jest.SpyInstance;

  const walletId = 'existent-wallet-id';
  const nonExistentWalletId = 'non-existent-wallet-id';

  beforeAll(() => {
    walletRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<IWalletRepository>;

    findWalletById = new FindWalletByIdUseCase(walletRepository);
    findByIdMock = jest.spyOn(walletRepository, 'findById');
  });

  const walletData = {
    id: 'existent-wallet-id',
    account_type: AccountType.CHECKING_ACCOUNT,
    description: 'Primeira Descrição de carteira.',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    bank: null,
    user: null,
    transactions: null,
  };

  it('should be able to return a wallet', async () => {
    findByIdMock.mockResolvedValue(walletData);

    const result = await findWalletById.execute(walletId);

    expect(result.wallet).toEqual({
      ...walletData,
      bank: expect.any(Object),
    });

    expect(findByIdMock).toHaveBeenCalledWith(walletId);
    expect(findByIdMock).toHaveBeenCalledTimes(1);
  });

  it('should not be able to return a wallet', async () => {
    findByIdMock.mockResolvedValueOnce(null);

    await expect(
      findWalletById.execute(nonExistentWalletId),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
