import { Test } from '@nestjs/testing';

import { FindAllWalletsByUserIdUseCase } from '@/wallet/use-cases';
import { IWalletRepository } from '@/wallet/interfaces';
import { AccountType } from '@/shared/constants';

describe('Find All Wallets By User ID', () => {
  let findAllByUserId: FindAllWalletsByUserIdUseCase;
  let walletRepository: jest.Mocked<IWalletRepository>;

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
    findAllByUserId = module.get(FindAllWalletsByUserIdUseCase);
  });

  it('should be defined', () => {
    expect(walletRepository).toBeDefined();
    expect(findAllByUserId).toBeDefined();
  });

  it('should be able to return all wallets by user ID', async () => {
    const user_id = 'auth0|user-id'; // Replace with the actual user ID
    const wallets = [
      {
        id: '01',
        account_type: AccountType.CHECKING_ACCOUNT,
        description: 'Primeira Descrição de carteira.',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        bank: null,
        user: null,
        transactions: null,
      },
      {
        id: '02',
        account_type: AccountType.CASH,
        description: 'Segunda Descrição de carteira.',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        bank: null,
        user: null,
        transactions: null,
      },
    ];

    walletRepository.findAllByUserId.mockResolvedValue(wallets);

    const result = await findAllByUserId.execute(user_id);

    expect(result.wallets).toEqual(wallets);
    expect(walletRepository.findAllByUserId).toHaveBeenCalledWith(user_id);
  });

  it('should not be able to return wallets if they were not found', async () => {
    const user_id = 'auth0|user-id';
    walletRepository.findAllByUserId.mockResolvedValue([]);

    const result = await findAllByUserId.execute(user_id);

    expect(result).toEqual({ wallets: [] });
    expect(walletRepository.findAllByUserId).toHaveBeenCalledWith(user_id);
  });
});
