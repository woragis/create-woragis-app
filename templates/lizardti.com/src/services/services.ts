import { Plataforma } from '../types/servicesType'
import api from './api'
import { AxiosError } from 'axios'

export const Services = {
  getServices: async (): Promise<{
    status: number
    message: string
    data?: any
  }> => {
    try {
      const response = await api.get('/services')
      if (response.status === 200) {
        return {
          status: 200,
          message: 'Serviços encontrados com sucesso',
          data: response.data as Plataforma[]
        }
      } else {
        return {
          status: 500,
          message: 'Erro ao buscar serviços',
          data: null
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          status: error.response?.status || 500,
          message: error.response?.data?.message || 'Erro ao buscar serviços',
          data: null
        }
      } else {
        return {
          status: 500,
          message: 'Erro desconhecido',
          data: null
        }
      }
    }
  },

  updateStatusCity: async (
    plataforma: string,
    cityName: string,
    value: boolean
  ): Promise<{ status: number; message: string; data?: any }> => {
    try {
      const response = await api.put(`/update-city-status`, {
        plataforma,
        cityName,
        value
      })
      if (response.status === 200) {
        return {
          status: 200,
          message: 'Status da cidade atualizado com sucesso',
          data: response.data
        }
      } else {
        return {
          status: 500,
          message: 'Erro ao atualizar status da cidade',
          data: null
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          status: error.response?.status || 500,
          message:
            error.response?.data?.message ||
            'Erro ao atualizar status da cidade',
          data: null
        }
      } else {
        return {
          status: 500,
          message: 'Erro desconhecido',
          data: null
        }
      }
    }
  },

  toggleNeighborhoodStatus: async (
    plataforma: string,
    cityName: string,
    neighborhoodName: string,
    activeStatus: boolean
  ): Promise<{ status: number; message: string; data?: any }> => {
    try {
      const response = await api.put(`/update-status-neighborhood`, {
        plataforma,
        cityName,
        neighborhoodName,
        activeStatus
      })

      if (response.status === 200) {
        return {
          status: 200,
          message: activeStatus
            ? 'Bairro ativado com sucesso'
            : 'Bairro desativado com sucesso',
          data: response.data
        }
      } else {
        return {
          status: 500,
          message: 'Erro ao alterar status do bairro',
          data: null
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          status: error.response?.status || 500,
          message:
            error.response?.data?.message || 'Erro ao alterar status do bairro',
          data: null
        }
      } else {
        return {
          status: 500,
          message: 'Erro desconhecido',
          data: null
        }
      }
    }
  },

  createNeighborhood: async (
    plataforma: string,
    cityName: string,
    neighborhoodName: string,
    isActive: boolean
  ): Promise<{ status: number; message: string; data?: any }> => {
    try {
      const response = await api.post(`/neighborhood`, {
        plataforma,
        cityName,
        neighborhoodName,
        isActive
      })

      if (response.status === 201) {
        return {
          status: 201,
          message: `Bairro criado com sucesso (${
            isActive ? 'ativo' : 'inativo'
          })`,
          data: response.data
        }
      } else {
        return {
          status: 500,
          message: 'Erro ao criar bairro',
          data: null
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          status: error.response?.status || 500,
          message: error.response?.data?.message || 'Erro ao criar bairro',
          data: null
        }
      } else {
        return {
          status: 500,
          message: 'Erro desconhecido',
          data: null
        }
      }
    }
  },

  updateStatusCityEmergency: async (
    plataforma: string,
    cityName: string,
    value: boolean
  ): Promise<{ status: number; message: string; data?: any }> => {
    try {
      const response = await api.put(`/update-emergency-status-city`, {
        plataforma,
        cityName,
        value
      })
      if (response.status === 200) {
        return {
          status: 200,
          message: 'Status emergencial da cidade atualizado com sucesso',
          data: response.data
        }
      } else {
        return {
          status: 500,
          message: 'Erro ao atualizar status emergencial da cidade',
          data: null
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          status: error.response?.status || 500,
          message:
            error.response?.data?.message ||
            'Erro ao atualizar status emergencial da cidade',
          data: null
        }
      } else {
        return {
          status: 500,
          message: 'Erro desconhecido',
          data: null
        }
      }
    }
  },

  updateAllStatusCity: async (
    plataforma: string,
    value: boolean
  ): Promise<{ status: number; message: string; data?: any }> => {
    try {
      const response = await api.put(`/update-all-cities-status`, {
        plataforma,
        value
      })
      if (response.status === 200) {
        return {
          status: 200,
          message: 'Status de todas as cidades atualizado com sucesso',
          data: response.data
        }
      } else {
        return {
          status: 500,
          message: 'Erro ao atualizar status de todas as cidades',
          data: null
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          status: error.response?.status || 500,
          message:
            error.response?.data?.message ||
            'Erro ao atualizar status de todas as cidades',
          data: null
        }
      } else {
        return {
          status: 500,
          message: 'Erro desconhecido',
          data: null
        }
      }
    }
  },

  updateStatusService: async (
    plataforma: string,
    serviceName: string,
    value: boolean
  ): Promise<{ status: number; message: string; data?: any }> => {
    try {
      const response = await api.put(`/update-service-status`, {
        plataforma,
        serviceName,
        value
      })
      if (response.status === 200) {
        return {
          status: 200,
          message: 'Status do serviço atualizado com sucesso',
          data: response.data
        }
      } else {
        return {
          status: 500,
          message: 'Erro ao atualizar status do serviço',
          data: null
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          status: error.response?.status || 500,
          message:
            error.response?.data?.message ||
            'Erro ao atualizar status do serviço',
          data: null
        }
      } else {
        return {
          status: 500,
          message: 'Erro desconhecido',
          data: null
        }
      }
    }
  },

  updateTimeCity: async (
    plataforma: string,
    cityName: string,
    value: string,
    field: string
  ): Promise<{ status: number; message: string; data?: any }> => {
    try {
      const response = await api.put(`/update-city-time`, {
        plataforma,
        cityName,
        value,
        field
      })
      if (response.status === 200) {
        return {
          status: 200,
          message: 'Horário da cidade atualizado com sucesso',
          data: response.data
        }
      } else {
        return {
          status: 500,
          message: 'Erro ao atualizar horário da cidade',
          data: null
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          status: error.response?.status || 500,
          message:
            error.response?.data?.message ||
            'Erro ao atualizar horário da cidade',
          data: null
        }
      } else {
        return {
          status: 500,
          message: 'Erro desconhecido',
          data: null
        }
      }
    }
  },

  updateTimeCityEmergency: async (
    plataforma: string,
    cityName: string,
    value: string,
    field: string
  ): Promise<{ status: number; message: string; data?: any }> => {
    try {
      const response = await api.put(`/update-emergency-time-city`, {
        plataforma,
        cityName,
        value,
        field
      })
      if (response.status === 200) {
        return {
          status: 200,
          message: 'Horário da cidade atualizado com sucesso',
          data: response.data
        }
      } else {
        return {
          status: 500,
          message: 'Erro ao atualizar horário da cidade',
          data: null
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          status: error.response?.status || 500,
          message:
            error.response?.data?.message ||
            'Erro ao atualizar horário da cidade',
          data: null
        }
      } else {
        return {
          status: 500,
          message: 'Erro desconhecido',
          data: null
        }
      }
    }
  }
}
