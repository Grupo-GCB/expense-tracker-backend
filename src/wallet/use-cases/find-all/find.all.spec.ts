import { Test } from '@nestjs/testing';

import { FindAllWalletsUseCase } from '@/wallet/use-cases';
import { IWalletRepository } from '@/wallet/interfaces';
import { AccountType } from '@/shared/constants';
import { Wallet } from '@/wallet/infra/entities';

describe('Find All Wallets', () => {
  let findAll: FindAllWalletsUseCase;
  let walletRepository: jest.Mocked<IWalletRepository>;

  const mockWallet: Wallet = {
    id: '01',
    account_type: AccountType.CHECKING_ACCOUNT,
    description: 'Primeira Descrição de carteira.',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    bank: null,
    user: null,
    transactions: null,
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindAllWalletsUseCase,
        { provide: IWalletRepository, useValue: { findAll: jest.fn() } },
      ],
    }).compile();
    walletRepository = module.get(IWalletRepository);
    findAll = module.get(FindAllWalletsUseCase);
  });

  it('should be defined', () => {
    expect(walletRepository).toBeDefined();
    expect(findAll).toBeDefined();
  });

  it('should be able to return all wallets', async () => {
    const wallets = [mockWallet, mockWallet];

    walletRepository.findAll.mockResolvedValue(wallets);

    const result = await findAll.execute();

    expect(result.wallets).toEqual(wallets);
    expect(walletRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should not be able to return wallets if were not found', async () => {
    walletRepository.findAll.mockResolvedValue([]);

    const result = await findAll.execute();

    expect(result).toEqual({ wallets: [] });
  });
});
