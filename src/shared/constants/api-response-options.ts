export const API_RESPONSE_OPTIONS = {
  description: 'Descrição da resposta personalizada.',
};

export const API_RESPONSE_OK = {
  ...API_RESPONSE_OPTIONS,
  description: 'Operação bem-sucedida.',
};

export const API_BAD_REQUEST_RESPONSE = {
  ...API_RESPONSE_OPTIONS,
  description: 'Erro de validação. Veja a mensagem de erro para mais detalhes.',
};

export const API_NOT_FOUND_RESPONSE = {
  ...API_RESPONSE_OPTIONS,
  description: 'O recurso solicitado não foi encontrado.',
};

export const API_INTERNAL_ERROR_RESPONSE = {
  ...API_RESPONSE_OPTIONS,
  description:
    'Erro interno no servidor. Consulte os logs para mais informações.',
};

export const API_UNAUTHORIZED_RESPONSE = {
  ...API_RESPONSE_OPTIONS,
  description:
    'Não autorizado. É necessário autenticação para acessar este recurso.',
};

export const API_FORBIDDEN_RESPONSE = {
  ...API_RESPONSE_OPTIONS,
  description:
    'Acesso proibido. Você não tem permissão para acessar este recurso.',
};

export const API_CREATED_RESPONSE = {
  ...API_RESPONSE_OPTIONS,
  description: 'Recurso criado com sucesso.',
};

export const API_UPDATED_RESPONSE = {
  ...API_RESPONSE_OPTIONS,
  description: 'Recurso atualizado com sucesso.',
};

export const API_DELETED_RESPONSE = {
  ...API_RESPONSE_OPTIONS,
  description: 'Recurso excluído com sucesso.',
};
