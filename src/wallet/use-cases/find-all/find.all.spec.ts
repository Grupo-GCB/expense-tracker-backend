import { Test } from '@nestjs/testing';

import { Wallet } from '@/wallet/infra/entities';
import { FindAllWalletsUseCase } from '@/wallet/use-cases';
import { Bank } from '@/bank/infra/entities';
import { IWalletRepository } from '@/wallet/interfaces';

describe('Find All Wallets', () => {
  let findAll: FindAllWalletsUseCase;
  let walletRepository: jest.Mocked<IWalletRepository>;

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
    const wallets = [
      {
        id: '01',
        account_type: 'anyAccountType',
        description: 'Wallet Description',
        created_at: 'anyData',
        updated_at: 'anyData',
        deleted_at: null,
      },
    ];

    walletRepository.findAll.mockResolvedValue(wallets);

    const result = await findAll.execute();

    expect(result.wallets).toEqual(wallets);
    expect(walletRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
