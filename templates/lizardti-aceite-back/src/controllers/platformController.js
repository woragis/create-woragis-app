const {
  getAllServices,
  updateStatusCity,
  updateStatusService,
  updateTimeCity,
  updateStatusAllCities,
  updateStatusEmergencyCity,
  updateTimeEmergencyCity,
  toggleNeighborhoodStatus,
  createNeighborhood
} = require('../services/platformServices')

const createNewNeighborhood = async (req, res) => {
  try {
    const { plataforma, cityName, neighborhoodName, isActive } = req.body

    // Validação dos parâmetros (isActive é opcional, padrão true)
    if (!plataforma || !cityName || !neighborhoodName) {
      return res.status(400).json({
        message:
          'Parâmetros inválidos. Certifique-se de enviar: plataforma (string), cityName (string) e neighborhoodName (string).'
      })
    }

    // Se isActive não foi enviado, assume true
    const activeStatus = typeof isActive === 'boolean' ? isActive : true

    const newNeighborhood = await createNeighborhood(
      plataforma,
      cityName,
      neighborhoodName,
      activeStatus
    )

    res.status(201).json({
      message: `Bairro criado com sucesso (${
        activeStatus ? 'ativo' : 'inativo'
      })`,
      newNeighborhood
    })
  } catch (err) {
    console.error('Erro ao criar bairro:', err)

    // Tratamento de erros específicos
    if (
      err.message.includes('Plataforma') ||
      err.message.includes('Cidade') ||
      err.message.includes('já existe')
    ) {
      return res.status(400).json({ message: err.message })
    }

    res.status(500).json({
      message: 'Erro interno do servidor',
      error: err.message
    })
  }
}

const handleToggleNeighborhoodStatus = async (req, res) => {
  try {
    const { plataforma, cityName, neighborhoodName, activeStatus } = req.body

    // Validação dos parâmetros
    if (
      !plataforma ||
      !cityName ||
      !neighborhoodName ||
      typeof activeStatus !== 'boolean'
    ) {
      return res.status(400).json({
        message:
          'Parâmetros inválidos. Certifique-se de enviar: plataforma (string), cityName (string), neighborhoodName (string) e activeStatus (boolean).'
      })
    }

    const updatedNeighborhood = await toggleNeighborhoodStatus(
      plataforma,
      cityName,
      neighborhoodName,
      activeStatus
    )

    res.status(200).json({
      message: activeStatus
        ? 'Bairro ativado com sucesso'
        : 'Bairro desativado com sucesso',
      updatedNeighborhood
    })
  } catch (err) {
    console.error('Erro ao alterar status do bairro:', err)

    // Tratamento de erros específicos
    if (
      err.message.includes('Plataforma') ||
      err.message.includes('Cidade') ||
      err.message.includes('Bairro')
    ) {
      return res.status(404).json({ message: err.message })
    }

    res.status(500).json({
      message: 'Erro interno do servidor',
      error: err.message
    })
  }
}

const getServices = async (req, res) => {
  try {
    const services = await getAllServices()

    if (!services || services.length === 0) {
      return res.status(404).json({ message: 'Nenhum serviço encontrado' })
    }

    const reorganizedServices = services.map((service) => ({
      plataforma: service.plataforma,
      cities: service.cities,
      services: service.services
    }))

    res.status(200).json(reorganizedServices)
  } catch (err) {
    console.error('Erro ao buscar serviços:', err)
    res
      .status(500)
      .json({ message: 'Erro interno do servidor', error: err.message })
  }
}

const handleUpdateTimeCity = async (req, res) => {
  try {
    const { plataforma, cityName, value, field } = req.body

    if (!plataforma || !cityName || !value || !field) {
      return res.status(400).json({
        message:
          'Parâmetros inválidos. Certifique-se de enviar: plataforma (string), cityName (string), value (number) e field (string).'
      })
    }

    const updatedCity = await updateTimeCity(plataforma, cityName, value, field)

    res.status(200).json({
      message: 'Tempo atualizado com sucesso',
      updatedCity
    })
  } catch (err) {
    console.error('Erro ao atualizar tempo da cidade:', err)

    if (err.message.includes('Plataforma') || err.message.includes('Cidade')) {
      return res.status(404).json({ message: err.message })
    }

    res.status(500).json({
      message: 'Erro interno do servidor',
      error: err.message
    })
  }
}

const handleUpdateTimeEmergencyCity = async (req, res) => {
  try {
    const { plataforma, cityName, value, field } = req.body

    if (!plataforma || !cityName || !value || !field) {
      return res.status(400).json({
        message:
          'Parâmetros inválidos. Certifique-se de enviar: plataforma (string), cityName (string), value (number) e field (string).'
      })
    }

    const updatedCity = await updateTimeEmergencyCity(
      plataforma,
      cityName,
      value,
      field
    )

    res.status(200).json({
      message: 'Tempo atualizado com sucesso',
      updatedCity
    })
  } catch (err) {
    console.error('Erro ao atualizar tempo da cidade:', err)

    if (err.message.includes('Plataforma') || err.message.includes('Cidade')) {
      return res.status(404).json({ message: err.message })
    }

    res.status(500).json({
      message: 'Erro interno do servidor',
      error: err.message
    })
  }
}

const updateCityStatus = async (req, res) => {
  try {
    const { plataforma, cityName, value } = req.body

    if (!plataforma || !cityName || typeof value !== 'boolean') {
      return res.status(400).json({
        message:
          'Parâmetros inválidos. Certifique-se de enviar: plataforma (string), cityName (string) e value (boolean).'
      })
    }

    const updatedCity = await updateStatusCity(plataforma, cityName, value)

    res.status(200).json({
      message: 'Status atualizado com sucesso',
      updatedCity
    })
  } catch (err) {
    console.error('Erro ao atualizar status da cidade:', err)

    if (err.message.includes('Plataforma') || err.message.includes('Cidade')) {
      return res.status(404).json({ message: err.message })
    }

    res.status(500).json({
      message: 'Erro interno do servidor',
      error: err.message
    })
  }
}

const updateCityEmergencyStatus = async (req, res) => {
  try {
    const { plataforma, cityName, value } = req.body

    if (!plataforma || !cityName || typeof value !== 'boolean') {
      return res.status(400).json({
        message:
          'Parâmetros inválidos. Certifique-se de enviar: plataforma (string), cityName (string) e value (boolean).'
      })
    }

    const updatedCity = await updateStatusEmergencyCity(
      plataforma,
      cityName,
      value
    )

    res.status(200).json({
      message: 'Status atualizado com sucesso',
      updatedCity
    })
  } catch (err) {
    if (err.message.includes('Plataforma') || err.message.includes('Cidade')) {
      return res.status(404).json({ message: err.message })
    }

    res.status(500).json({
      message: 'Erro interno do servidor',
      error: err.message
    })
  }
}

const updateServiceStatus = async (req, res) => {
  try {
    const { plataforma, serviceName, value } = req.body

    if (!plataforma || !serviceName || typeof value !== 'boolean') {
      return res.status(400).json({
        message:
          'Parâmetros inválidos. Certifique-se de enviar: plataforma (string), serviceName (string) e value (boolean).'
      })
    }

    const updatedService = await updateStatusService(
      plataforma,
      serviceName,
      value
    )

    res.status(200).json({
      message: 'Status atualizado com sucesso',
      updatedService
    })
  } catch (err) {
    console.error('Erro ao atualizar status do serviço:', err)

    if (err.message.includes('Plataforma') || err.message.includes('Serviço')) {
      return res.status(404).json({ message: err.message })
    }

    res.status(500).json({
      message: 'Erro interno do servidor',
      error: err.message
    })
  }
}

const handleUpdateStatusAllCities = async (req, res) => {
  try {
    const { plataforma, value } = req.body

    if (!plataforma || typeof value !== 'boolean') {
      return res.status(400).json({
        message:
          'Parâmetros inválidos. Certifique-se de enviar: plataforma (string) e value (boolean).'
      })
    }

    const updatedCities = await updateStatusAllCities(plataforma, value)

    res.status(200).json({
      message: 'Status de todas as cidades atualizado com sucesso',
      updatedCities
    })
  } catch (err) {
    console.error('Erro ao atualizar status de todas as cidades:', err)

    if (err.message.includes('Plataforma')) {
      return res.status(404).json({ message: err.message })
    }

    res.status(500).json({
      message: 'Erro interno do servidor',
      error: err.message
    })
  }
}

module.exports = {
  getServices,
  updateCityStatus,
  handleUpdateTimeCity,
  updateServiceStatus,
  handleUpdateStatusAllCities,
  updateCityEmergencyStatus,
  handleUpdateTimeEmergencyCity,
  handleToggleNeighborhoodStatus,
  createNewNeighborhood
}
