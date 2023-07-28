export const HttpExceptionConstants = {
  INVALID_CREDENTIALS: {
    statusCode: 401,
    message: 'Credenciais inválidas.',
  },
  NOT_FOUND: {
    statusCode: 404,
    message: 'Não encontrado.',
  },
  TOKEN_NOT_FOUND: {
    statusCode: 404,
    message: 'Token não encontrado.',
  },
  INVALID_REFRESH_TOKEN: {
    statusCode: 401,
    message: 'Token de atualização inválido.',
  },
  USER_ALREADY_EXISTS: {
    statusCode: 409,
    message: 'Usuário já existe.',
  },
  FAILED_TO_CREATE_USER: {
    statusCode: 500,
    message: 'Falha ao criar usuário.',
  },
  USER_NOT_FOUND: {
    statusCode: 404,
    message: 'Usuário não encontrado.',
  },
};
