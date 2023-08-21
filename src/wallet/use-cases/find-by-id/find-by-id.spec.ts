import { NotFoundException } from '@nestjs/common';

import { AccountType } from '@/shared/constants';
import { IWalletRepository } from '@/wallet/interfaces';
import { FindWalletByIdUseCase } from '@/wallet/use-cases';

describe('Find Bank by ID', () => {
  let sut: FindWalletByIdUseCase;
  let findByIdMock: jest.SpyInstance;
  let walletRepository: jest.Mocked<IWalletRepository>;

  beforeAll(() => {
    walletRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<IWalletRepository>;

    sut = new FindWalletByIdUseCase(walletRepository);
    findByIdMock = jest.spyOn(walletRepository, 'findById');
  });

  const walletId = 'existent-wallet-id';
  const invalidWalletId = 'non-existent-wallet-id';

  const wallet = {
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

  it('should be defined', () => {
    expect(walletRepository).toBeDefined();
    expect(findByIdMock).toBeDefined();
  });

  it('should be able to return a wallet', async () => {
    findByIdMock.mockResolvedValue(wallet);

    const result = await sut.execute(walletId);

    expect(result.wallet).toEqual({
      ...wallet,
      bank: expect.any(Object),
    });

    expect(findByIdMock).toHaveBeenCalledWith(walletId);
    expect(findByIdMock).toHaveBeenCalledTimes(1);
  });

  it('should not be able to return a wallet', async () => {
    findByIdMock.mockResolvedValueOnce(null);

    await expect(sut.execute(invalidWalletId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
