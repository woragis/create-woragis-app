const {
  ListUsersCommand,
  SignUpCommand,
  InitiateAuthCommand,
  ConfirmSignUpCommand,
  AdminGetUserCommand
} = require('@aws-sdk/client-cognito-identity-provider')
const {
  cognitoClient,
  USER_POOL_ID,
  CLIENT_ID,
  genereteSecretHash
} = require('../config/cognito')

const createUser = async (user) => {
  const secretHash = genereteSecretHash(user.email)

  const params = {
    ClientId: CLIENT_ID,
    Username: user.email,
    Password: user.password,
    SecretHash: secretHash,
    UserAttributes: [
      { Name: 'email', Value: user.email },
      { Name: 'name', Value: user.name }
    ]
  }

  try {
    await cognitoClient.send(new SignUpCommand(params))
    return {
      message:
        'Usuário criado com sucesso. Um código de confirmação foi enviado ao e-mail.'
    }
  } catch (err) {
    console.error('Erro ao criar usuário no Cognito:', err)
    return { error: err.message }
  }
}

const loginUser = async (email, password) => {
  const secretHash = genereteSecretHash(email)

  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
      SECRET_HASH: secretHash
    }
  }

  try {
    const response = await cognitoClient.send(new InitiateAuthCommand(params))
    const token = response.AuthenticationResult.IdToken
    const refreshToken = response.AuthenticationResult.RefreshToken

    // Buscar os dados do usuário
    const userCommand = new AdminGetUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: email
    })

    const userResponse = await cognitoClient.send(userCommand)
    const user = {
      id: userResponse.Username,
      email:
        userResponse.UserAttributes.find((attr) => attr.Name === 'email')
          ?.Value || null,
      name:
        userResponse.UserAttributes.find((attr) => attr.Name === 'name')
          ?.Value || null,
      status: userResponse.UserStatus
    }

    return { token, user, refreshToken }
  } catch (err) {
    console.error('Erro ao fazer login no Cognito:', err)
    return { error: err.message }
  }
}

const getAllUsers = async () => {
  const params = {
    UserPoolId: USER_POOL_ID,
    Limit: 50 // Define um limite para a quantidade de usuários retornados
  }

  try {
    const command = new ListUsersCommand(params)
    const response = await cognitoClient.send(command)

    return response.Users.map((user) => ({
      id: user.Username,
      email:
        user.Attributes.find((attr) => attr.Name === 'email')?.Value || null,
      name: user.Attributes.find((attr) => attr.Name === 'name')?.Value || null,
      status: user.UserStatus
    }))
  } catch (err) {
    console.error('Erro ao buscar usuários no Cognito:', err)
    return { error: err.message }
  }
}

// Função para confirmar o email do usuário
const confirmEmail = async (email, confirmationCode) => {
  const secretHash = genereteSecretHash(email)

  const params = {
    Username: email,
    ConfirmationCode: confirmationCode,
    ClientId: CLIENT_ID,
    SecretHash: secretHash
  }

  try {
    await cognitoClient.send(new ConfirmSignUpCommand(params))
    return { message: 'E-mail confirmado com sucesso!' }
  } catch (err) {
    console.error('Erro ao confirmar e-mail:', err)
    return { error: err.message }
  }
}

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  confirmEmail // Exportando a nova função
}
