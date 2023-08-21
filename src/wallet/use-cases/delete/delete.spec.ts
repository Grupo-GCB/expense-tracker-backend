import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { AccountType } from '@/shared/constants';
import { Wallet } from '@/wallet/infra/entities';
import { IWalletRepository } from '@/wallet/interfaces';
import { DeleteWalletUseCase } from '@/wallet/use-cases';

describe('Delete Wallet Use Case', () => {
  let walletRepository: IWalletRepository;
  let sut: DeleteWalletUseCase;
  let findByIdMock: jest.SpyInstance;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteWalletUseCase,
        {
          provide: IWalletRepository,
          useFactory: () => ({
            findById: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
          }),
        },
      ],
    }).compile();

    sut = module.get<DeleteWalletUseCase>(DeleteWalletUseCase);
    walletRepository = module.get<IWalletRepository>(IWalletRepository);

    findByIdMock = jest.spyOn(walletRepository, 'findById');
  });

  const validId = '4e8b5d94-6b16-4a42-b6d1-dc58b553d109';
  const invalidId = 'invalid-id';

  const wallet = {
    id: validId,
    account_type: AccountType.CHECKING_ACCOUNT,
    description: 'Descrição',
    deleted_at: null as Date | null,
  } as Wallet;

  it('should be able to delete a wallet when a wallet exists', async () => {
    findByIdMock.mockResolvedValue(wallet);

    await sut.execute({ id: wallet.id });

    expect(walletRepository.findById).toHaveBeenCalledTimes(1);
    expect(walletRepository.findById).toHaveBeenCalledWith(wallet.id);

    expect(walletRepository.delete).toHaveBeenCalledTimes(1);
    expect(walletRepository.delete).toHaveBeenCalledWith(wallet.id);
  });

  it('should be able to delete a wallet when a wallet no exists', async () => {
    findByIdMock.mockRejectedValue(new NotFoundException());

    const nonExistingWalletId: Wallet = {
      ...wallet,
      id: invalidId,
    };

    await expect(sut.execute(nonExistingWalletId)).rejects.toBeInstanceOf(
      NotFoundException,
    );

    expect(walletRepository.findById).toHaveBeenCalledTimes(1);
    expect(walletRepository.findById).toHaveBeenCalledWith(
      nonExistingWalletId.id,
    );

    expect(walletRepository.delete).not.toHaveBeenCalled();
  });
});
