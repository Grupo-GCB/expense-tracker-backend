import { Test } from '@nestjs/testing';

import { FindAllWalletsByUserIdUseCase } from '@/wallet/use-cases';
import { IWalletRepository } from '@/wallet/interfaces';
import { AccountType } from '@/shared/constants';
import { Wallet } from '@/wallet/infra/entities';

describe('Find All Wallets', () => {
  let findAllWalletsByUserIdUseCase: FindAllWalletsByUserIdUseCase;
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

  const user_id = 'auth0|user-id';

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindAllWalletsByUserIdUseCase,
        {
          provide: IWalletRepository,
          useValue: { findAllByUserId: jest.fn() },
        },
      ],
    }).compile();
    walletRepository = module.get(IWalletRepository);
    findAllWalletsByUserIdUseCase = module.get(FindAllWalletsByUserIdUseCase);
  });

  it('should be defined', () => {
    expect(walletRepository).toBeDefined();
    expect(findAllWalletsByUserIdUseCase).toBeDefined();
  });

  it('should be able to return all wallets', async () => {
    const wallets = [mockWallet, mockWallet];

    walletRepository.findAllByUserId.mockResolvedValue(wallets);

    const result = await findAllWalletsByUserIdUseCase.execute(user_id);

    expect(result.wallets).toEqual(wallets);
    expect(walletRepository.findAllByUserId).toHaveBeenCalledTimes(1);
  });

  it('should not be able to return wallets if were not found', async () => {
    walletRepository.findAllByUserId.mockResolvedValue([]);

    const result = await findAllWalletsByUserIdUseCase.execute(user_id);

    expect(result).toEqual({ wallets: [] });
  });
});
