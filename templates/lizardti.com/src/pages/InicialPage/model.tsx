import { useEffect, useState } from 'react'
import { Services } from '@/services/services'
import { City, Plataforma } from '@/types/servicesType'
import { setLoading } from '@/store/loading/actions'
import { showToast } from '@/store/toast/actions'
import { logout } from '@/store/user/actions'
import { useUser } from '@/store/user/hooks'

export const useInicialPage = () => {
  const [services, setServices] = useState<Plataforma[]>([])
  const [citySelectedForConfig, setCitySelectedForConfig] = useState<City>()
  const [modalConfigCity, setModalConfigCity] = useState<boolean>(false)

  useEffect(() => {
    handleGetServices()
  }, [])

  const handleGetServices = async () => {
    setLoading(true)
    const response = await Services.getServices()
    setLoading(false)

    if (response.status === 200) {
      setServices(response.data)
    }
  }

  const handleControlModalConfigCity = () => {
    setModalConfigCity(!modalConfigCity)
  }

  const handleSelectCityForConfig = (city: City) => {
    setCitySelectedForConfig(city)
  }

  const handleUpdateStatusCity = async (
    plataforma: string,
    cityName: string,
    value: boolean
  ) => {
    setLoading(true)
    const response = await Services.updateStatusCity(
      plataforma,
      cityName,
      value
    )
    setLoading(false)

    if (response.status === 200) {
      handleGetServices()
      showToast('success', response.message)
    }
  }

  const handleUpdateStatusNeighborhood = async (
    plataforma: string,
    cityName: string,
    neighborhoodName: string,
    value: boolean
  ) => {
    setLoading(true)
    const response = await Services.toggleNeighborhoodStatus(
      plataforma,
      cityName,
      neighborhoodName,
      value
    )
    setLoading(false)

    if (response.status === 200) {
      handleGetServices()
      showToast('success', response.message)
    }
  }

  const handleCreateNeighborhood = async (
    plataforma: string,
    cityName: string,
    neighborhoodName: string,
    value: boolean
  ) => {
    setLoading(true)
    const response = await Services.createNeighborhood(
      plataforma,
      cityName,
      neighborhoodName,
      value
    )
    setLoading(false)

    if (response.status === 201) {
      handleGetServices()
      showToast('success', response.message)
    }

    if (response.status === 400) {
      showToast('error', response.message)
    }
  }

  const handleUpdateStatusEmergency = async (
    plataforma: string,
    cityName: string,
    value: boolean
  ) => {
    setLoading(true)
    const response = await Services.updateStatusCityEmergency(
      plataforma,
      cityName,
      value
    )
    setLoading(false)

    if (response.status === 200) {
      handleGetServices()
      showToast('success', response.message)
    }
  }

  const handleUpdateStatusService = async (
    plataforma: string,
    value: boolean,
    serviceName: string
  ) => {
    setLoading(true)
    const response = await Services.updateStatusService(
      plataforma,
      serviceName,
      value
    )
    setLoading(false)

    if (response.status === 200) {
      handleGetServices()
      showToast('success', response.message)
    }
  }

  const handleUpdateTimeCity = async (
    plataforma: string,
    cityName: string,
    value: string,
    field: string
  ) => {
    setLoading(true)
    const response = await Services.updateTimeCity(
      plataforma,
      cityName,
      value,
      field
    )
    setLoading(false)

    if (response.status === 200) {
      handleGetServices()
      showToast('success', response.message)
    }
  }

  const handleUpdateTimeEmergencyCity = async (
    value: string,
    type: 'start' | 'end',
    plataforma: string
  ) => {
    if (!citySelectedForConfig) return
    const nameField =
      type === 'start' ? 'emergencyStartTime' : 'emergencyEndTime'

    setLoading(true)
    const response = await Services.updateTimeCityEmergency(
      plataforma,
      citySelectedForConfig.city,
      value,
      nameField
    )
    setLoading(false)

    if (response.status === 200) {
      handleGetServices()
      showToast('success', response.message)
    }
  }

  const handleUpdateAllStatusCity = async (
    plataforma: string,
    value: boolean
  ) => {
    setLoading(true)
    const response = await Services.updateAllStatusCity(plataforma, value)
    setLoading(false)

    if (response.status === 200) {
      handleGetServices()
      showToast('success', response.message)
    }
  }

  const { user } = useUser()

  return {
    services,
    handleUpdateStatusCity,
    handleUpdateStatusService,
    handleUpdateTimeCity,
    logout,
    user,
    handleUpdateAllStatusCity,
    handleSelectCityForConfig,
    handleControlModalConfigCity,
    modalConfigCity,
    citySelectedForConfig,
    handleUpdateStatusEmergency,
    handleUpdateTimeEmergencyCity,
    handleUpdateStatusNeighborhood,
    handleCreateNeighborhood
  }
}
