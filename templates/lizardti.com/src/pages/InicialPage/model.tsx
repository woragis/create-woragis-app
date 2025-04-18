import { useEffect, useState } from 'react'
import { Services } from '../../services/services'
import { City, Plataforma } from '../../types/servicesType'
import { useLoadingStore } from '../../store/loadingStore'
import { useToastStore } from '../../store/toastStore'
import { useAuthStore } from '../../store/userStore'

export const useInicialPage = () => {
  const { dispatch: dispatchLoading } = useLoadingStore()
  const { dispatch: dispatchToast } = useToastStore()
  const { dispatch: dispatchUser, state: stateUser } = useAuthStore()

  const [services, setServices] = useState<Plataforma[]>([])
  const [citySelectedForConfig, setCitySelectedForConfig] = useState<City>()
  const [modalConfigCity, setModalConfigCity] = useState<boolean>(false)

  useEffect(() => {
    handleGetServices()
  }, [])

  const handleGetServices = async () => {
    dispatchLoading.setLoading(true)
    const response = await Services.getServices()
    dispatchLoading.setLoading(false)

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
    dispatchLoading.setLoading(true)
    const response = await Services.updateStatusCity(
      plataforma,
      cityName,
      value
    )
    dispatchLoading.setLoading(false)

    if (response.status === 200) {
      handleGetServices()
      dispatchToast.setOpenToast('success', response.message)
    }
  }

  const handleUpdateStatusNeighborhood = async (
    plataforma: string,
    cityName: string,
    neighborhoodName: string,
    value: boolean
  ) => {
    dispatchLoading.setLoading(true)
    const response = await Services.toggleNeighborhoodStatus(
      plataforma,
      cityName,
      neighborhoodName,
      value
    )
    dispatchLoading.setLoading(false)

    if (response.status === 200) {
      handleGetServices()
      dispatchToast.setOpenToast('success', response.message)
    }
  }

  const handleCreateNeighborhood = async (
    plataforma: string,
    cityName: string,
    neighborhoodName: string,
    value: boolean
  ) => {
    dispatchLoading.setLoading(true)
    const response = await Services.createNeighborhood(
      plataforma,
      cityName,
      neighborhoodName,
      value
    )
    dispatchLoading.setLoading(false)

    if (response.status === 201) {
      handleGetServices()
      dispatchToast.setOpenToast('success', response.message)
    }

    if (response.status === 400) {
      dispatchToast.setOpenToast('error', response.message)
    }
  }

  const handleUpdateStatusEmergency = async (
    plataforma: string,
    cityName: string,
    value: boolean
  ) => {
    dispatchLoading.setLoading(true)
    const response = await Services.updateStatusCityEmergency(
      plataforma,
      cityName,
      value
    )
    dispatchLoading.setLoading(false)

    if (response.status === 200) {
      handleGetServices()
      dispatchToast.setOpenToast('success', response.message)
    }
  }

  const handleUpdateStatusService = async (
    plataforma: string,
    value: boolean,
    serviceName: string
  ) => {
    dispatchLoading.setLoading(true)
    const response = await Services.updateStatusService(
      plataforma,
      serviceName,
      value
    )
    dispatchLoading.setLoading(false)

    if (response.status === 200) {
      handleGetServices()
      dispatchToast.setOpenToast('success', response.message)
    }
  }

  const handleUpdateTimeCity = async (
    plataforma: string,
    cityName: string,
    value: string,
    field: string
  ) => {
    dispatchLoading.setLoading(true)
    const response = await Services.updateTimeCity(
      plataforma,
      cityName,
      value,
      field
    )
    dispatchLoading.setLoading(false)

    if (response.status === 200) {
      handleGetServices()
      dispatchToast.setOpenToast('success', response.message)
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

    dispatchLoading.setLoading(true)
    const response = await Services.updateTimeCityEmergency(
      plataforma,
      citySelectedForConfig.city,
      value,
      nameField
    )
    dispatchLoading.setLoading(false)

    if (response.status === 200) {
      handleGetServices()
      dispatchToast.setOpenToast('success', response.message)
    }
  }

  const handleUpdateAllStatusCity = async (
    plataforma: string,
    value: boolean
  ) => {
    dispatchLoading.setLoading(true)
    const response = await Services.updateAllStatusCity(plataforma, value)
    dispatchLoading.setLoading(false)

    if (response.status === 200) {
      handleGetServices()
      dispatchToast.setOpenToast('success', response.message)
    }
  }

  return {
    services,
    handleUpdateStatusCity,
    handleUpdateStatusService,
    handleUpdateTimeCity,
    dispatchUser,
    stateUser,
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
