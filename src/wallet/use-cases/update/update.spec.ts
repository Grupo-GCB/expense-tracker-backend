import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { AccountType } from '@/shared/constants';
import { UpdateWalletDTO } from '@/wallet/dto';
import { IWalletRepository } from '@/wallet/interfaces';
import { UpdateWalletUseCase } from '@/wallet/use-cases';
import { FindBankByIdUseCase } from '@/bank/use-cases';
import { IBankRepository } from '@/bank/interfaces';
import { Bank } from '@/bank/infra/entities';
import { Wallet } from '@/wallet/infra/entities';

describe('Update Wallet Use Case', () => {
  let sut: UpdateWalletUseCase;
  let findBankByIdUseCase: FindBankByIdUseCase;
  let walletRepository: IWalletRepository;
  let findByIdMock: jest.SpyInstance;
  let updateMock: jest.SpyInstance;
  let findBankByIdMock: jest.SpyInstance;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateWalletUseCase,
        FindBankByIdUseCase,
        {
          provide: IWalletRepository,
          useFactory: () => ({
            update: jest.fn(),
            findById: jest.fn(),
          }),
        },
        {
          provide: IBankRepository,
          useFactory: () => ({
            findById: jest.fn(),
          }),
        },
      ],
    }).compile();

    sut = module.get<UpdateWalletUseCase>(UpdateWalletUseCase);
    findBankByIdUseCase = module.get<FindBankByIdUseCase>(FindBankByIdUseCase);
    walletRepository = module.get<IWalletRepository>(IWalletRepository);

    findByIdMock = jest.spyOn(walletRepository, 'findById');
    updateMock = jest.spyOn(walletRepository, 'update');
    findBankByIdMock = jest.spyOn(findBankByIdUseCase, 'execute');
  });

  beforeEach(async () => {
    findBankByIdMock.mockResolvedValue(bank);
    updateMock.mockResolvedValue(NotFoundException);
  });

  const validId = '4e8b5d94-6b16-4a42-b6d1-dc58b553d109';
  const invalidId = 'invalid-id';

  const updateData: UpdateWalletDTO = {
    bank_id: validId,
    account_type: AccountType.CHECKING_ACCOUNT,
    description: 'Nova descrição',
  };

  const bank = {
    id: validId,
    name: 'anyBank',
    logo_url: 'anyURL',
  } as Bank;

  const wallet = {
    id: validId,
  } as Wallet;

  it.skip('should be able to update a wallet', async () => {
    const updatedWallet = updateData as unknown as Wallet;

    findByIdMock.mockResolvedValue(updatedWallet);
    updateMock.mockResolvedValue(updatedWallet);

    const result = await sut.execute(wallet.id, updateData);

    expect(result).toEqual(updatedWallet);

    expect(findBankByIdUseCase.execute).toHaveBeenCalledTimes(1);
    expect(findBankByIdUseCase.execute).toHaveBeenCalledWith(
      updateData.bank_id,
    );

    expect(walletRepository.findById).toHaveBeenCalledTimes(1);
    expect(walletRepository.findById).toHaveBeenCalledWith(wallet.id);

    expect(walletRepository.update).toHaveBeenCalledTimes(1);
    expect(walletRepository.update).toHaveBeenCalledWith(updatedWallet);
  });

  it('should not be able to update a wallet if wallet does not exist', async () => {
    const nonExistingWalletData: UpdateWalletDTO = {
      bank_id: validId,
      account_type: AccountType.CHECKING_ACCOUNT,
      description: 'Nova descrição',
    };

    const nonExistingWallet = {
      id: invalidId,
    } as Wallet;

    findByIdMock.mockResolvedValue(null);

    await expect(
      sut.execute(nonExistingWallet.id, nonExistingWalletData),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(findBankByIdUseCase.execute).toHaveBeenCalledTimes(1);
    expect(findBankByIdUseCase.execute).toHaveBeenCalledWith(
      nonExistingWalletData.bank_id,
    );

    expect(walletRepository.findById).toHaveBeenCalledTimes(1);
    expect(walletRepository.findById).toHaveBeenCalledWith(
      nonExistingWallet.id,
    );
  });
});
