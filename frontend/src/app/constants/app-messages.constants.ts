export const APP_MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: 'Login realizado com sucesso!',
    LOGIN_ERROR: 'Falha ao fazer login. Verifique suas credenciais.',
    LOGOUT_SUCCESS: 'Você foi desconectado.',
    SIGNUP_SUCCESS: 'Cadastro realizado com sucesso! Um e-mail com sua senha foi enviado.',
    SIGNUP_ERROR: 'Erro ao realizar o cadastro. Tente novamente.',
    INVALID_EMAIL: 'E-mail inválido.',
    INVALID_PASSWORD: 'Senha inválida.',
    SESSION_EXPIRED: 'Sua sessão expirou. Faça login novamente.'
  },
  SOLICITATION: {
    CREATE_SUCCESS: 'Solicitação criada com sucesso!',
    CREATE_ERROR: 'Erro ao criar solicitação. Tente novamente.',
    APPROVE_SUCCESS: 'Serviço aprovado com sucesso!',
    APPROVE_ERROR: 'Erro ao aprovar serviço.',
    REJECT_SUCCESS: 'Serviço rejeitado com sucesso!',
    REJECT_ERROR: 'Erro ao rejeitar serviço.',
    UPDATE_SUCCESS: 'Solicitação atualizada com sucesso!',
    UPDATE_ERROR: 'Erro ao atualizar solicitação.',
    DELETE_SUCCESS: 'Solicitação removida com sucesso!',
    DELETE_ERROR: 'Erro ao remover solicitação.',
    LOADING: 'Carregando solicitações...',
    NO_DATA: 'Nenhuma solicitação encontrada.'
  },
  BUDGET: {
    BUDGET_SUCCESS: 'Orçamento realizado com sucesso!',
    BUDGET_ERROR: 'Erro ao realizar orçamento.',
    INVALID_VALUE: 'Valor do orçamento inválido.',
    BUDGET_SUBMITTED: 'Orçamento enviado para o cliente.'
  },
  MAINTENANCE: {
    MAINTENANCE_SUCCESS: 'Manutenção realizada com sucesso!',
    MAINTENANCE_ERROR: 'Erro ao realizar manutenção.',
    REDIRECT_SUCCESS: 'Solicitação redirecionada com sucesso!',
    REDIRECT_ERROR: 'Erro ao redirecionar solicitação.',
    FINISH_SUCCESS: 'Solicitação finalizada com sucesso!',
    FINISH_ERROR: 'Erro ao finalizar solicitação.'
  },
  PAYMENT: {
    PAYMENT_SUCCESS: 'Pagamento confirmado com sucesso!',
    PAYMENT_ERROR: 'Erro ao processar pagamento.',
    INVALID_AMOUNT: 'Valor de pagamento inválido.'
  },
  CATEGORIES: {
    CREATE_SUCCESS: 'Categoria criada com sucesso!',
    CREATE_ERROR: 'Erro ao criar categoria.',
    UPDATE_SUCCESS: 'Categoria atualizada com sucesso!',
    UPDATE_ERROR: 'Erro ao atualizar categoria.',
    DELETE_SUCCESS: 'Categoria removida com sucesso!',
    DELETE_ERROR: 'Erro ao remover categoria.',
    LOADING: 'Carregando categorias...'
  },
  EMPLOYEES: {
    CREATE_SUCCESS: 'Funcionário criado com sucesso!',
    CREATE_ERROR: 'Erro ao criar funcionário.',
    UPDATE_SUCCESS: 'Funcionário atualizado com sucesso!',
    UPDATE_ERROR: 'Erro ao atualizar funcionário.',
    DELETE_SUCCESS: 'Funcionário removido com sucesso!',
    DELETE_ERROR: 'Erro ao remover funcionário.',
    CANNOT_DELETE_SELF: 'Você não pode remover a si mesmo.',
    CANNOT_DELETE_LAST: 'Não é possível remover o último funcionário ativo.'
  },
  VALIDATION: {
    REQUIRED_FIELD: 'Este campo é obrigatório.',
    INVALID_FORMAT: 'Formato inválido.',
    MINIMUM_LENGTH: 'Comprimento mínimo não atingido.',
    MAXIMUM_LENGTH: 'Comprimento máximo excedido.',
    EMAIL_ALREADY_REGISTERED: 'Este e-mail já está cadastrado.'
  },
  GENERAL: {
    ERROR: 'Ocorreu um erro. Tente novamente.',
    SUCCESS: 'Operação realizada com sucesso!',
    LOADING: 'Carregando...',
    CONFIRM_DELETE: 'Tem certeza que deseja remover este item?',
    CONFIRM_ACTION: 'Confirme a ação para prosseguir.',
    CANCEL: 'Cancelar',
    SAVE: 'Salvar',
    CLOSE: 'Fechar'
  }
};
