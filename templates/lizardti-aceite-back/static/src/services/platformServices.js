const { ScanCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb')
const db = require('../db/db')

const TABLE_SERVICES = process.env.DYNAMODB_TABLE_SERVICES

const getAllServices = async () => {
  try {
    const command = new ScanCommand({
      TableName: TABLE_SERVICES
    })
    const response = await db.send(command)

    return response.Items
  } catch (err) {
    console.error(err)
    throw new Error('Error getting services')
  }
}

const updateTimeCity = async (platform, cityName, value, field) => {
  try {
    const command = new ScanCommand({
      TableName: TABLE_SERVICES,
      FilterExpression: 'plataforma = :platform',
      ExpressionAttributeValues: {
        ':platform': platform
      }
    })

    const response = await db.send(command)
    const item = response.Items[0]
    if (!item) throw new Error(`Plataforma '${platform}' não encontrada`)
    const cityIndex = item.cities.findIndex((city) => city.city === cityName)
    if (cityIndex === -1)
      throw new Error(
        `Cidade '${cityName}' não encontrada na plataforma '${platform}'`
      )

    item.cities[cityIndex][field] = value

    const updateCommand = new UpdateCommand({
      TableName: TABLE_SERVICES,
      Key: { plataforma: platform },
      UpdateExpression: `SET cities[${cityIndex}].${field} = :value`,
      ExpressionAttributeValues: {
        ':value': value
      },
      ReturnValues: 'UPDATED_NEW'
    })

    const updateResponse = await db.send(updateCommand)
    return updateResponse.Attributes
  } catch (err) {
    console.error(err)
    throw new Error(err.message)
  }
}

const updateStatusCity = async (platform, cityName, value) => {
  try {
    // Buscar o item pelo nome da plataforma
    const command = new ScanCommand({
      TableName: TABLE_SERVICES,
      FilterExpression: 'plataforma = :platform',
      ExpressionAttributeValues: {
        ':platform': platform
      }
    })

    const response = await db.send(command)
    const item = response.Items[0]
    if (!item) throw new Error(`Plataforma '${platform}' não encontrada`)

    const cityIndex = item.cities.findIndex((city) => city.city === cityName)
    if (cityIndex === -1)
      throw new Error(
        `Cidade '${cityName}' não encontrada na plataforma '${platform}'`
      )

    item.cities[cityIndex].active = value

    const updateCommand = new UpdateCommand({
      TableName: TABLE_SERVICES,
      Key: { plataforma: platform },
      UpdateExpression: `SET cities[${cityIndex}].active = :value`,
      ExpressionAttributeValues: {
        ':value': value
      },
      ReturnValues: 'UPDATED_NEW'
    })

    const updateResponse = await db.send(updateCommand)
    return updateResponse.Attributes
  } catch (err) {
    console.error(err)
    throw new Error(err.message)
  }
}

const updateStatusEmergencyCity = async (platform, cityName, value) => {
  try {
    // Buscar o item pelo nome da plataforma
    const command = new ScanCommand({
      TableName: TABLE_SERVICES,
      FilterExpression: 'plataforma = :platform',
      ExpressionAttributeValues: {
        ':platform': platform
      }
    })

    const response = await db.send(command)
    const item = response.Items[0]
    if (!item) throw new Error(`Plataforma '${platform}' não encontrada`)

    const cityIndex = item.cities.findIndex((city) => city.city === cityName)
    if (cityIndex === -1)
      throw new Error(
        `Cidade '${cityName}' não encontrada na plataforma '${platform}'`
      )

    item.cities[cityIndex].active = value

    const updateCommand = new UpdateCommand({
      TableName: TABLE_SERVICES,
      Key: { plataforma: platform },
      UpdateExpression: `SET cities[${cityIndex}].is_emergency = :value`,
      ExpressionAttributeValues: {
        ':value': value
      },
      ReturnValues: 'UPDATED_NEW'
    })

    const updateResponse = await db.send(updateCommand)
    return updateResponse.Attributes
  } catch (err) {
    console.error(err)
    throw new Error(err.message)
  }
}

const updateTimeEmergencyCity = async (platform, cityName, value, field) => {
  try {
    const command = new ScanCommand({
      TableName: TABLE_SERVICES,
      FilterExpression: 'plataforma = :platform',
      ExpressionAttributeValues: {
        ':platform': platform
      }
    })

    const response = await db.send(command)
    const item = response.Items[0]
    if (!item) throw new Error(`Plataforma '${platform}' não encontrada`)
    const cityIndex = item.cities.findIndex((city) => city.city === cityName)
    if (cityIndex === -1)
      throw new Error(
        `Cidade '${cityName}' não encontrada na plataforma '${platform}'`
      )

    item.cities[cityIndex][field] = value

    const updateCommand = new UpdateCommand({
      TableName: TABLE_SERVICES,
      Key: { plataforma: platform },
      UpdateExpression: `SET cities[${cityIndex}].${field} = :value`,
      ExpressionAttributeValues: {
        ':value': value
      },
      ReturnValues: 'UPDATED_NEW'
    })

    const updateResponse = await db.send(updateCommand)
    return updateResponse.Attributes
  } catch (err) {
    console.error(err)
    throw new Error(err.message)
  }
}

const updateStatusService = async (platform, serviceName, value) => {
  try {
    const command = new ScanCommand({
      TableName: TABLE_SERVICES,
      FilterExpression: 'plataforma = :platform',
      ExpressionAttributeValues: {
        ':platform': platform
      }
    })

    const response = await db.send(command)
    const item = response.Items[0]
    if (!item) throw new Error(`Plataforma '${platform}' não encontrada`)

    const serviceIndex = item.services.findIndex(
      (service) => service.service === serviceName
    )
    if (serviceIndex === -1)
      throw new Error(
        `Serviço '${serviceName}' não encontrado na plataforma '${platform}'`
      )

    item.services[serviceIndex].active = value

    const updateCommand = new UpdateCommand({
      TableName: TABLE_SERVICES,
      Key: { plataforma: platform },
      UpdateExpression: `SET services[${serviceIndex}].active = :value`,
      ExpressionAttributeValues: {
        ':value': value
      },
      ReturnValues: 'UPDATED_NEW'
    })

    const updateResponse = await db.send(updateCommand)
    return updateResponse.Attributes
  } catch (err) {
    console.error(err)
    throw new Error(err.message)
  }
}

const updateTimeAllCities = async (platform, value, field) => {
  try {
    const command = new ScanCommand({
      TableName: TABLE_SERVICES,
      FilterExpression: 'plataforma = :platform',
      ExpressionAttributeValues: {
        ':platform': platform
      }
    })

    const response = await db.send(command)
    const item = response.Items[0]
    if (!item) throw new Error(`Plataforma '${platform}' não encontrada`)

    // Atualiza o campo para todas as cidades
    item.cities.forEach((city) => {
      city[field] = value
    })

    const updateCommand = new UpdateCommand({
      TableName: TABLE_SERVICES,
      Key: { plataforma: platform },
      UpdateExpression: `SET cities = :cities`,
      ExpressionAttributeValues: {
        ':cities': item.cities
      },
      ReturnValues: 'UPDATED_NEW'
    })

    const updateResponse = await db.send(updateCommand)
    return updateResponse.Attributes
  } catch (err) {
    console.error(err)
    throw new Error(err.message)
  }
}

const updateStatusAllCities = async (platform, value) => {
  try {
    const command = new ScanCommand({
      TableName: TABLE_SERVICES,
      FilterExpression: 'plataforma = :platform',
      ExpressionAttributeValues: {
        ':platform': platform
      }
    })

    const response = await db.send(command)
    const item = response.Items[0]
    if (!item) throw new Error(`Plataforma '${platform}' não encontrada`)

    // Atualiza o status para todas as cidades
    item.cities.forEach((city) => {
      city.active = value
    })

    const updateCommand = new UpdateCommand({
      TableName: TABLE_SERVICES,
      Key: { plataforma: platform },
      UpdateExpression: `SET cities = :cities`,
      ExpressionAttributeValues: {
        ':cities': item.cities
      },
      ReturnValues: 'UPDATED_NEW'
    })

    const updateResponse = await db.send(updateCommand)
    return updateResponse.Attributes
  } catch (err) {
    console.error(err)
    throw new Error(err.message)
  }
}

const toggleNeighborhoodStatus = async (
  platform,
  cityName,
  neighborhoodName,
  value
) => {
  try {
    // Buscar o item pelo nome da plataforma
    const command = new ScanCommand({
      TableName: TABLE_SERVICES,
      FilterExpression: 'plataforma = :platform',
      ExpressionAttributeValues: {
        ':platform': platform
      }
    })

    const response = await db.send(command)
    const item = response.Items[0]
    if (!item) throw new Error(`Plataforma '${platform}' não encontrada`)

    // Encontrar a cidade
    const cityIndex = item.cities.findIndex((city) => city.city === cityName)
    if (cityIndex === -1)
      throw new Error(
        `Cidade '${cityName}' não encontrada na plataforma '${platform}'`
      )

    // Encontrar o bairro
    const neighborhoodIndex = item.cities[cityIndex].neighborhoods.findIndex(
      (neighborhood) => neighborhood.name === neighborhoodName
    )
    if (neighborhoodIndex === -1)
      throw new Error(
        `Bairro '${neighborhoodName}' não encontrado na cidade '${cityName}'`
      )

    // Atualizar o status do bairro
    item.cities[cityIndex].neighborhoods[neighborhoodIndex].active = value

    const updateCommand = new UpdateCommand({
      TableName: TABLE_SERVICES,
      Key: { plataforma: platform },
      UpdateExpression: `SET cities[${cityIndex}].neighborhoods[${neighborhoodIndex}].active = :value`,
      ExpressionAttributeValues: {
        ':value': value
      },
      ReturnValues: 'UPDATED_NEW'
    })

    const updateResponse = await db.send(updateCommand)
    return updateResponse.Attributes
  } catch (err) {
    console.error(err)
    throw new Error(err.message)
  }
}

const createNeighborhood = async (
  platform,
  cityName,
  neighborhoodName,
  isActive
) => {
  try {
    // Buscar o item pelo nome da plataforma
    const command = new ScanCommand({
      TableName: TABLE_SERVICES,
      FilterExpression: 'plataforma = :platform',
      ExpressionAttributeValues: {
        ':platform': platform
      }
    })

    const response = await db.send(command)
    const item = response.Items[0]
    if (!item) throw new Error(`Plataforma '${platform}' não encontrada`)

    // Encontrar a cidade
    const cityIndex = item.cities.findIndex((city) => city.city === cityName)
    if (cityIndex === -1)
      throw new Error(
        `Cidade '${cityName}' não encontrada na plataforma '${platform}'`
      )

    // Verificar se o bairro já existe
    const neighborhoodExists = item.cities[cityIndex].neighborhoods.some(
      (neighborhood) => neighborhood.name === neighborhoodName
    )
    if (neighborhoodExists)
      throw new Error(
        `Bairro '${neighborhoodName}' já existe na cidade '${cityName}'`
      )

    // Criar novo bairro
    const newNeighborhood = {
      active: isActive,
      name: neighborhoodName
    }

    // Adicionar o novo bairro ao array de bairros
    item.cities[cityIndex].neighborhoods.push(newNeighborhood)

    const updateCommand = new UpdateCommand({
      TableName: TABLE_SERVICES,
      Key: { plataforma: platform },
      UpdateExpression: `SET cities[${cityIndex}].neighborhoods = :neighborhoods`,
      ExpressionAttributeValues: {
        ':neighborhoods': item.cities[cityIndex].neighborhoods
      },
      ReturnValues: 'UPDATED_NEW'
    })

    const updateResponse = await db.send(updateCommand)
    return updateResponse.Attributes
  } catch (err) {
    console.error(err)
    throw new Error(err.message)
  }
}

module.exports = {
  getAllServices,
  updateStatusCity,
  updateTimeAllCities,
  updateStatusAllCities,
  updateStatusEmergencyCity,
  updateTimeEmergencyCity,
  toggleNeighborhoodStatus,
  createNeighborhood,
  updateStatusService,
  updateTimeCity
}
