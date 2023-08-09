import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { RegisterWalletUseCase } from '@/wallet/use-cases';
import { IWalletRepository } from '@/wallet/interfaces';
import { SaveWalletDTO } from '@/wallet/dto';
import { AccountType } from '@/shared/constants/enums';
import { ListUserByIdUseCase } from '@/user/use-cases';
import { FindBankByIdUseCase } from '@/bank/use-cases';
import { Wallet } from '@/wallet/infra/entities';

describe('RegisterWalletUseCase', () => {
  let registerWalletUseCase: RegisterWalletUseCase;
  let walletRepository: IWalletRepository;
  let listUserByIdUseCase: ListUserByIdUseCase;
  let findBankByIdUseCase: FindBankByIdUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterWalletUseCase,
        {
          provide: IWalletRepository,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: ListUserByIdUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: FindBankByIdUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    registerWalletUseCase = module.get<RegisterWalletUseCase>(
      RegisterWalletUseCase,
    );
    walletRepository = module.get<IWalletRepository>(IWalletRepository);
    listUserByIdUseCase = module.get<ListUserByIdUseCase>(ListUserByIdUseCase);
    findBankByIdUseCase = module.get<FindBankByIdUseCase>(FindBankByIdUseCase);
  });

  it('should create wallet successfully', async () => {
    listUserByIdUseCase.execute = jest.fn().mockResolvedValueOnce({});
    findBankByIdUseCase.execute = jest.fn().mockResolvedValueOnce({});
    walletRepository.create = jest.fn().mockResolvedValue({} as Wallet);

    const saveWalletDTO: SaveWalletDTO = {
      user_id: 'user_id',
      bank_id: 'bank_id',
      account_type: AccountType.CHECKING_ACCOUNT,
      description: 'Descrição da carteira',
    };

    const result = await registerWalletUseCase.createWallet(saveWalletDTO);

    expect(result).toBeDefined();
    expect(walletRepository.create).toHaveBeenCalledWith(saveWalletDTO);
  });

  it('should not be able to return wallet', async () => {
    listUserByIdUseCase.execute = jest.fn().mockResolvedValueOnce(null);

    const saveWalletDTO: SaveWalletDTO = {
      user_id: 'user_id',
      bank_id: 'bank_id',
      account_type: AccountType.CHECKING_ACCOUNT,
      description: 'Descrição da carteira',
    };

    await expect(
      registerWalletUseCase.createWallet(saveWalletDTO),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should throw BadRequestException if wallet creation fails', async () => {
    listUserByIdUseCase.execute = jest.fn().mockResolvedValueOnce({});
    findBankByIdUseCase.execute = jest.fn().mockResolvedValueOnce({});

    walletRepository.create = jest
      .fn()
      .mockRejectedValue(new BadRequestException('Erro ao criar a carteira.'));

    const saveWalletDTO: SaveWalletDTO = {
      user_id: 'user_id',
      bank_id: 'bank_id',
      account_type: AccountType.CHECKING_ACCOUNT,
      description: 'Wallet description',
    };

    await expect(
      registerWalletUseCase.createWallet(saveWalletDTO),
    ).rejects.toThrowError(BadRequestException);
  });
});
