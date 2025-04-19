import { useEffect, useState } from 'react'
import { useInicialPage } from './model'
import {
  Cog6ToothIcon,
  ArrowLeftStartOnRectangleIcon,
  ChevronLeftIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import logo from '@/assets/logo_lizard.png'
import aciona from '@/assets/unnamed.png'
import mondial from '@/assets/mondial.png'
import juvo from '@/assets/logo_nova.png'
import { Plataforma } from '@/types/servicesType'
import { IconButton } from '@mui/material'
import CityModal from '@/components/modalConfigCity'

export const InicialPageView = (props: ReturnType<typeof useInicialPage>) => {
  const [selectedPlatform, setSelectedPlatform] = useState<Plataforma | null>(
    null
  )
  const [searchCity, setSearchCity] = useState('')
  const [searchService, setSearchService] = useState('')

  useEffect(() => {
    if (selectedPlatform) {
      const updatedPlatform = props.services.find(
        (p) => p.plataforma === selectedPlatform.plataforma
      )
      if (updatedPlatform) {
        setSelectedPlatform(updatedPlatform)
      }
    }
  }, [props.services])

  useEffect(() => {
    if (selectedPlatform) {
      const updatedPlatform = props.services.find(
        (p) => p.plataforma === selectedPlatform.plataforma
      )
      if (!updatedPlatform) return

      const citySelectedForConfigUpdated = updatedPlatform.cities.find(
        (city) => city.city === props.citySelectedForConfig?.city
      )
      if (!citySelectedForConfigUpdated) return

      props.handleSelectCityForConfig(citySelectedForConfigUpdated)
    }
  }, props.services)

  const toggleCity = async (filteredIndex: number) => {
    if (!selectedPlatform) return

    const originalIndex = filteredCities[filteredIndex].originalIndex
    const updatedPlatform = { ...selectedPlatform }
    updatedPlatform.cities[originalIndex].active =
      !updatedPlatform.cities[originalIndex].active
    setSelectedPlatform(updatedPlatform)

    const cityName = updatedPlatform.cities[originalIndex].city
    const plataforma = updatedPlatform.plataforma
    const value = updatedPlatform.cities[originalIndex].active

    await props.handleUpdateStatusCity(plataforma, cityName, value)
  }

  const toggleService = async (filteredIndex: number) => {
    if (!selectedPlatform) return

    const originalIndex = filteredServices[filteredIndex].originalIndex
    const updatedPlatform = { ...selectedPlatform }
    updatedPlatform.services[originalIndex].active =
      !updatedPlatform.services[originalIndex].active
    setSelectedPlatform(updatedPlatform)

    const serviceName = updatedPlatform.services[originalIndex].service
    const plataforma = updatedPlatform.plataforma
    const value = updatedPlatform.services[originalIndex].active
    await props.handleUpdateStatusService(plataforma, value, serviceName)
  }

  const handleWeekHoursChange = async (
    cityIndex: number,
    field: 'startTimeW' | 'endTimeW',
    value: string
  ) => {
    if (!selectedPlatform) return

    const updatedPlatform = { ...selectedPlatform }
    updatedPlatform.cities[cityIndex][field] = value
    setSelectedPlatform(updatedPlatform)

    await props.handleUpdateTimeCity(
      updatedPlatform.plataforma,
      updatedPlatform.cities[cityIndex].city,
      value,
      field
    )
  }

  const handleWeekendHoursChange = async (
    cityIndex: number,
    field: 'startTimeS' | 'endTimeS',
    value: string
  ) => {
    if (!selectedPlatform) return

    const updatedPlatform = { ...selectedPlatform }
    updatedPlatform.cities[cityIndex][field] = value
    setSelectedPlatform(updatedPlatform)

    await props.handleUpdateTimeCity(
      updatedPlatform.plataforma,
      updatedPlatform.cities[cityIndex].city,
      value,
      field
    )
  }

  const filteredCities =
    selectedPlatform?.cities
      .map((city, index) => ({ ...city, originalIndex: index }))
      .filter((city) =>
        city.city.toLowerCase().includes(searchCity.toLowerCase())
      ) || []

  const filteredServices =
    selectedPlatform?.services
      .map((service, index) => ({ ...service, originalIndex: index }))
      .filter((service) =>
        service.service.toLowerCase().includes(searchService.toLowerCase())
      ) || []

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-50 bg-gray-900 p-6 shadow-xl flex flex-col border-r border-gray-800">
        <div className="flex justify-center mb-10">
          <img
            src={logo}
            alt="Logo"
            className="w-28 filter brightness-0 invert"
          />
        </div>

        <nav className="flex-1">
          <a
            href="#"
            className="flex items-center gap-2 px-4 py-3 text-gray-300 rounded-xl
              bg-gray-800 transition-all duration-300"
          >
            <Cog6ToothIcon className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">Configurações</span>
          </a>
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-800">
          <a
            onClick={() => props.logout()}
            className="flex items-center gap-4 px-4 py-3 text-gray-300 rounded-xl
              hover:bg-gray-800 transition-all duration-300 cursor-pointer"
          >
            <ArrowLeftStartOnRectangleIcon className="w-6 h-6" />
            <span className="text-sm font-medium">Sair</span>
          </a>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-8 bg-gray-50 min-h-screen">
        {selectedPlatform ? (
          <>
            <button
              onClick={() => setSelectedPlatform(null)}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-8 cursor-pointer"
            >
              <ChevronLeftIcon className="w-5 h-5 mr-2" />
              Voltar
            </button>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900">
                {selectedPlatform.plataforma}
              </h1>
              <button
                onClick={() =>
                  props.handleUpdateAllStatusCity(
                    selectedPlatform.plataforma,
                    !selectedPlatform.cities.every((city) => city.active)
                  )
                }
                className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition"
              >
                {selectedPlatform.cities.every((city) => city.active)
                  ? 'Desativar todas as cidades'
                  : 'Ativar todas as cidades'}
              </button>
            </div>
            {/* Cidades Atendidas */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-700">
                  Cidades Atendidas
                </h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar cidade..."
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCities.map((city, index) => (
                  <div
                    key={city.originalIndex}
                    className="flex flex-col p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-col">
                        <div className="flex gap-6 items-center">
                          <h3 className="text-xl font-bold text-gray-900">
                            {city.city}
                          </h3>
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={city.active}
                              onChange={() => toggleCity(index)}
                              className="sr-only"
                            />
                            <span className="slider round"></span>
                          </label>
                        </div>
                        <span className="text-sm text-gray-500">
                          Emergencial:{' '}
                          <span
                            className={
                              city.is_emergency
                                ? 'font-bold text-green-500'
                                : 'font-bold text-red-500'
                            }
                          >
                            {city.is_emergency ? 'Ativado' : 'Desativado'}
                          </span>
                        </span>
                      </div>
                      <IconButton
                        onClick={() => {
                          props.handleSelectCityForConfig(city)
                          props.handleControlModalConfigCity()
                        }}
                      >
                        <Cog6ToothIcon className="w-6 h-6" />
                      </IconButton>
                    </div>
                    <div className="mt-4 space-y-4">
                      {/* Horários de Segunda a Sexta */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Segunda a Sexta
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-500">
                              Início
                            </label>
                            <input
                              type="time"
                              value={city.startTimeW}
                              onChange={(e) =>
                                handleWeekHoursChange(
                                  city.originalIndex,
                                  'startTimeW',
                                  e.target.value
                                )
                              }
                              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">
                              Fim
                            </label>
                            <input
                              type="time"
                              value={city.endTimeW}
                              onChange={(e) =>
                                handleWeekHoursChange(
                                  city.originalIndex,
                                  'endTimeW',
                                  e.target.value
                                )
                              }
                              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Horários de Sábado */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Sábado
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-500">
                              Início
                            </label>
                            <input
                              type="time"
                              value={city.startTimeS}
                              onChange={(e) =>
                                handleWeekendHoursChange(
                                  city.originalIndex,
                                  'startTimeS',
                                  e.target.value
                                )
                              }
                              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">
                              Fim
                            </label>
                            <input
                              type="time"
                              value={city.endTimeS}
                              onChange={(e) =>
                                handleWeekendHoursChange(
                                  city.originalIndex,
                                  'endTimeS',
                                  e.target.value
                                )
                              }
                              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Serviços Aceitos */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-700">
                  Serviços Aceitos
                </h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar serviço..."
                    value={searchService}
                    onChange={(e) => setSearchService(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredServices.map((service, index) => (
                  <div
                    key={service.originalIndex}
                    className="flex justify-between items-center p-4 border border-gray-200 rounded-lg"
                  >
                    <h3 className="text-lg font-medium text-gray-800">
                      {service.service}
                    </h3>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={service.active}
                        onChange={() => toggleService(index)}
                        className="sr-only"
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-8 text-gray-900">
              Olá, {props.user?.name}! 👋
            </h1>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
              <h2 className="text-2xl font-semibold mb-6 text-gray-700">
                Plataformas
              </h2>

              <div className="flex flex-wrap justify-start gap-4">
                {props.services.map((plataforma, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center p-3 border border-gray-300 rounded-md shadow-md bg-white hover:shadow-lg transition duration-300 w-36"
                  >
                    <div className="w-16 h-16 flex justify-center items-center">
                      <img
                        src={
                          (plataforma.plataforma === 'JUVO' && juvo) ||
                          (plataforma.plataforma === 'ACIONA' && aciona) ||
                          (plataforma.plataforma === 'MONDIAL' && mondial) ||
                          ''
                        }
                        alt={plataforma.plataforma}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>

                    <span className="mt-2 text-lg font-medium text-gray-800 text-center">
                      {plataforma.plataforma}
                    </span>
                    <button
                      onClick={() => setSelectedPlatform(plataforma)}
                      className="mt-2 px-4 py-1.5 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition cursor-pointer"
                    >
                      Acessar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
      {props.modalConfigCity && props.citySelectedForConfig && (
        <CityModal
          onChangeTimeEmergency={(value, field) => {
            if (!selectedPlatform || !props.citySelectedForConfig) return
            props.handleUpdateTimeEmergencyCity(
              value,
              field,
              selectedPlatform.plataforma
            )
          }}
          city={props.citySelectedForConfig}
          onCreateNeighborhood={(city, neighborhood, value) => {
            if (!selectedPlatform) return
            props.handleCreateNeighborhood(
              selectedPlatform?.plataforma,
              city,
              neighborhood,
              value
            )
          }}
          onToggleNeighborhoodStatus={(city, neighborhood, value) => {
            if (!selectedPlatform) return
            props.handleUpdateStatusNeighborhood(
              selectedPlatform?.plataforma,
              city,
              neighborhood,
              value
            )
          }}
          onClose={() => {
            props.handleControlModalConfigCity()
          }}
          onChangeEmergency={(value) => {
            if (!selectedPlatform || !props.citySelectedForConfig) return

            props.handleUpdateStatusEmergency(
              selectedPlatform?.plataforma,
              props.citySelectedForConfig.city,
              value
            )
          }}
        />
      )}
    </div>
  )
}
