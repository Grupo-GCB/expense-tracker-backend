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
    id: validId,
    bank_id: validId,
    account_type: AccountType.CHECKING_ACCOUNT,
    description: 'Nova descrição',
  };

  const bank = {
    id: validId,
    name: 'anyBank',
    logo_url: 'anyURL',
  } as Bank;

  it('should be able to update a wallet', async () => {
    const updatedWallet = updateData as unknown as Wallet;

    findByIdMock.mockResolvedValue(updatedWallet);
    updateMock.mockResolvedValue(updatedWallet);

    const result = await sut.execute(updateData);

    expect(result).toEqual(updatedWallet);

    expect(findBankByIdUseCase.execute).toHaveBeenCalledTimes(1);
    expect(findBankByIdUseCase.execute).toHaveBeenCalledWith(
      updateData.bank_id,
    );

    expect(walletRepository.findById).toHaveBeenCalledTimes(1);
    expect(walletRepository.findById).toHaveBeenCalledWith(updateData.id);

    expect(walletRepository.update).toHaveBeenCalledTimes(1);
    expect(walletRepository.update).toHaveBeenCalledWith(updatedWallet);
  });

  it('should not be able to update a wallet if wallet does not exist', async () => {
    const nonExistingWalletId: UpdateWalletDTO = {
      ...updateData,
      id: invalidId,
    };

    findByIdMock.mockResolvedValue(null);

    await expect(sut.execute(nonExistingWalletId)).rejects.toBeInstanceOf(
      NotFoundException,
    );

    expect(findBankByIdUseCase.execute).toHaveBeenCalledTimes(1);
    expect(findBankByIdUseCase.execute).toHaveBeenCalledWith(
      nonExistingWalletId.bank_id,
    );

    expect(walletRepository.findById).toHaveBeenCalledTimes(1);
    expect(walletRepository.findById).toHaveBeenCalledWith(
      nonExistingWalletId.id,
    );

    expect(walletRepository.update).not.toHaveBeenCalled();
  });

  it('should not be able to update a wallet if bank does not exist', async () => {
    const nonExistingBankId: UpdateWalletDTO = {
      ...updateData,
      bank_id: invalidId,
    };

    findBankByIdMock.mockResolvedValue(null);

    await expect(sut.execute(nonExistingBankId)).rejects.toBeInstanceOf(
      NotFoundException,
    );

    expect(findBankByIdUseCase.execute).toHaveBeenCalledTimes(1);
    expect(findBankByIdUseCase.execute).toHaveBeenCalledWith(
      nonExistingBankId.bank_id,
    );

    expect(walletRepository.findById).toHaveBeenCalledTimes(1);
    expect(walletRepository.findById).toHaveBeenCalledWith(
      nonExistingBankId.id,
    );

    expect(walletRepository.update).not.toHaveBeenCalled();
  });
});
