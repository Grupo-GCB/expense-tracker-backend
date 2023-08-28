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
  let walletRepository: IWalletRepository;
  let bankRepository: IBankRepository;
  let findByIdMock: jest.SpyInstance;
  let updateMock: jest.SpyInstance;

  const validId = '4e8b5d94-6b16-4a42-b6d1-dc58b553d109';
  const invalidId = 'invalid-id';

  const updateDataDTO: UpdateWalletDTO = {
    bank_id: validId,
    account_type: AccountType.CHECKING_ACCOUNT,
    description: 'Nova descrição',
  };

  const walletDataResponse = {
    id: validId,
    account_type: AccountType.CHECKING_ACCOUNT,
    description: 'Nova descrição',
  } as Wallet;

  const updatedWallet = {
    id: validId,
    account_type: AccountType.CASH,
    description: 'Nova descrição',
  } as Wallet;

  const bank = {
    id: validId,
    name: 'anyBank',
    logo_url: 'anyURL',
  } as Bank;

  const wallet = {
    id: validId,
  } as Wallet;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateWalletUseCase,
        FindBankByIdUseCase,
        {
          provide: IWalletRepository,
          useFactory: () => ({
            update: jest.fn().mockResolvedValue(updatedWallet),
            findById: jest.fn().mockResolvedValue(walletDataResponse),
          }),
        },
        {
          provide: IBankRepository,
          useFactory: () => ({
            findById: jest.fn().mockResolvedValue(bank),
          }),
        },
      ],
    }).compile();

    sut = module.get<UpdateWalletUseCase>(UpdateWalletUseCase);
    walletRepository = module.get<IWalletRepository>(IWalletRepository);
    bankRepository = module.get<IBankRepository>(IBankRepository);

    findByIdMock = jest.spyOn(walletRepository, 'findById');
    updateMock = jest.spyOn(walletRepository, 'update');
  });

  it('should be able to update a wallet', async () => {
    findByIdMock.mockResolvedValueOnce({
      id: wallet.id,
      bank: { id: validId },
    });

    const result = await sut.execute(validId, updateDataDTO);

    expect(result).toEqual(walletDataResponse);

    expect(bankRepository.findById).toHaveBeenCalledTimes(1);
    expect(bankRepository.findById).toHaveBeenCalledWith(updateDataDTO.bank_id);
  });

  it('should not be able to update a wallet if wallet does not exist', async () => {
    updateMock.mockResolvedValueOnce(NotFoundException);

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

    expect(bankRepository.findById).toHaveBeenCalledTimes(1);
    expect(bankRepository.findById).toHaveBeenCalledWith(
      nonExistingWalletData.bank_id,
    );

    expect(walletRepository.findById).toHaveBeenCalledTimes(1);
    expect(walletRepository.findById).toHaveBeenCalledWith(
      nonExistingWallet.id,
    );
  });
});
