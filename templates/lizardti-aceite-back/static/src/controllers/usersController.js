const userService = require('../services/usersService')

const createUser = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: 'Nome, email e senha são obrigatórios.' })
  }

  try {
    const result = await userService.createUser({ name, email, password })
    if (result.error) {
      return res.status(400).json({ error: result.error })
    }
    return res.status(201).json(result)
  } catch (err) {
    console.error('Erro ao criar usuário:', err)
    return res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}

const loginUser = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' })
  }

  try {
    const result = await userService.loginUser(email, password)
    if (!result) {
      return res.status(401).json({ error: 'Credenciais inválidas.' })
    }

    const object = {
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      status: result.user.status,
      tokens: {
        token: result.token,
        refreshToken: result.refreshToken
      }
    }
    return res.status(200).json(object)
  } catch (err) {
    console.error('Erro ao fazer login:', err)
    return res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers()
    if (users.error) {
      return res.status(400).json({ error: users.error })
    }
    return res.status(200).json(users)
  } catch (err) {
    console.error('Erro ao buscar usuários:', err)
    return res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}

const confirmUserEmail = async (req, res) => {
  const { email, confirmationCode } = req.body

  if (!email || !confirmationCode) {
    return res
      .status(400)
      .json({ error: 'Email e código de confirmação são obrigatórios.' })
  }

  try {
    const result = await userService.confirmEmail(email, confirmationCode)
    if (result.error) {
      return res.status(400).json({ error: result.error })
    }
    return res.status(200).json(result)
  } catch (err) {
    console.error('Erro ao confirmar e-mail:', err)
    return res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  confirmUserEmail
}
