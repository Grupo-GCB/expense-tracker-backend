import { FindAllWalletsByUserIdUseCase } from '@/wallet/use-cases';
import { IWalletRepository } from '@/wallet/interfaces';
import { AccountType } from '@/shared/constants';
import { Wallet } from '@/wallet/infra/entities';

describe('Find All Wallets', () => {
  let findAllWalletsByUserIdUseCase: FindAllWalletsByUserIdUseCase;
  let walletRepository: jest.Mocked<IWalletRepository>;
  let findAllByUserIdMock: jest.SpyInstance;

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
    walletRepository = {
      findAllByUserId: jest.fn(),
    } as unknown as jest.Mocked<IWalletRepository>;

    findAllWalletsByUserIdUseCase = new FindAllWalletsByUserIdUseCase(
      walletRepository,
    );
    findAllByUserIdMock = jest.spyOn(walletRepository, 'findAllByUserId');
  });

  it('should be defined', () => {
    expect(walletRepository).toBeDefined();
    expect(findAllWalletsByUserIdUseCase).toBeDefined();
  });

  it('should be able to return all wallets', async () => {
    const wallets = [mockWallet, mockWallet];

    findAllByUserIdMock.mockResolvedValue(wallets);

    const result = await findAllWalletsByUserIdUseCase.execute(user_id);

    expect(result.wallets).toEqual(
      expect.arrayContaining(
        wallets.map((wallet) => ({
          ...wallet,
          bank: expect.any(Object),
        })),
      ),
    );

    expect(findAllByUserIdMock).toHaveBeenCalledTimes(1);
  });

  it('should not be able to return wallets if were not found', async () => {
    findAllByUserIdMock.mockResolvedValue([]);

    const result = await findAllWalletsByUserIdUseCase.execute(user_id);

    expect(result).toEqual({ wallets: [] });
  });
});
