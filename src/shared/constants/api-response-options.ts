export const createApiResponseOptions = (description: string) => ({
  description,
});

export const API_RESPONSES = {
  OK: createApiResponseOptions('Operação bem-sucedida.'),
  BAD_REQUEST: createApiResponseOptions(
    'Erro de validação. Veja a mensagem de erro para mais detalhes.',
  ),
  NOT_FOUND: createApiResponseOptions(
    'O recurso solicitado não foi encontrado.',
  ),
  INTERNAL_ERROR: createApiResponseOptions(
    'Erro interno no servidor. Consulte os logs para mais informações.',
  ),
  UNAUTHORIZED: createApiResponseOptions(
    'Não autorizado. É necessário autenticação para acessar este recurso.',
  ),
  FORBIDDEN: createApiResponseOptions(
    'Acesso proibido. Você não tem permissão para acessar este recurso.',
  ),
  NO_CONTENT: createApiResponseOptions(
    'A solicitação foi processada com sucesso.',
  ),
  CREATED: createApiResponseOptions('Recurso criado com sucesso.'),
  UPDATED: createApiResponseOptions('Recurso atualizado com sucesso.'),
  DELETED: createApiResponseOptions('Recurso excluído com sucesso.'),
};
