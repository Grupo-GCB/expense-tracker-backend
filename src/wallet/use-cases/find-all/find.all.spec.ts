import { FindAllWalletsByUserIdUseCase } from '@/wallet/use-cases';
import { IWalletRepository } from '@/wallet/interfaces';
import { AccountType } from '@/shared/constants';
import { Wallet } from '@/wallet/infra/entities';

describe('Find All Wallets', () => {
  let walletRepository: jest.Mocked<IWalletRepository>;
  let findAllByUserIdMock: jest.SpyInstance;
  let sut: FindAllWalletsByUserIdUseCase;

  beforeAll(async () => {
    walletRepository = {
      findAllByUserId: jest.fn(),
    } as unknown as jest.Mocked<IWalletRepository>;

    sut = new FindAllWalletsByUserIdUseCase(walletRepository);
    findAllByUserIdMock = jest.spyOn(walletRepository, 'findAllByUserId');
  });

  const validUserId = 'auth0|user-id';

  const wallet: Wallet = {
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

  it('should be defined', () => {
    expect(walletRepository).toBeDefined();
    expect(sut).toBeDefined();
  });

  it('should be able to return all wallets', async () => {
    const wallets = [wallet, wallet];

    findAllByUserIdMock.mockResolvedValue(wallets);

    const result = await sut.execute(validUserId);

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

  it('should not be able to return wallets if they were not found', async () => {
    findAllByUserIdMock.mockResolvedValue([]);

    const result = await sut.execute(validUserId);

    expect(result).toEqual({ wallets: [] });
  });
});
