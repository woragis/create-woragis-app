import { useState } from 'react'
import { City, Neighborhood } from '@/types/servicesType'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Switch from '@mui/material/Switch'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

interface ModalProps {
  city: City
  onClose: () => void
  onChangeEmergency: (isEmergency: boolean) => void
  onChangeTimeEmergency: (time: string, type: 'start' | 'end') => void
  onCreateNeighborhood: (
    city: string,
    neighborhood: string,
    active: boolean
  ) => void
  onToggleNeighborhoodStatus: (
    city: string,
    neighborhood: string,
    active: boolean
  ) => void
}

const CityModal = ({
  city,
  onClose,
  onChangeEmergency,
  onChangeTimeEmergency,
  onCreateNeighborhood,
  onToggleNeighborhoodStatus
}: ModalProps) => {
  const [isEmergency, setIsEmergency] = useState(city.is_emergency)
  const [startTime, setStartTime] = useState(city.emergencyStartTime)
  const [endTime, setEndTime] = useState(city.emergencyEndTime)
  const [searchNeighborhood, setSearchNeighborhood] = useState('')
  const [selectedNeighborhood, setSelectedNeighborhood] =
    useState<Neighborhood | null>(null)
  const [newNeighborhoodName, setNewNeighborhoodName] = useState('')
  const [newNeighborhoodStatus, setNewNeighborhoodStatus] = useState<
    'active' | 'inactive'
  >('active')

  const handleChangeEmergency = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isChecked = event.target.checked
    setIsEmergency(isChecked)
    onChangeEmergency(isChecked)
  }

  const handleChangeTimeEmergency = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'start' | 'end'
  ) => {
    const value = event.target.value
    if (type === 'start') {
      setStartTime(value)
    } else {
      setEndTime(value)
    }
    onChangeTimeEmergency(value, type)
  }

  const handleToggleNeighborhoodStatus = (
    neighborhood: Neighborhood,
    newStatus: boolean
  ) => {
    onToggleNeighborhoodStatus(city.city, neighborhood.name, newStatus)
    if (neighborhood === selectedNeighborhood) {
      setSelectedNeighborhood(null)
      setSearchNeighborhood('')
    }
  }

  const handleCreateNeighborhood = () => {
    if (newNeighborhoodName.trim()) {
      onCreateNeighborhood(
        city.city,
        newNeighborhoodName.trim(),
        newNeighborhoodStatus === 'active'
      )
      setNewNeighborhoodName('')
      setNewNeighborhoodStatus('active')
    }
  }

  const filteredNeighborhoods = city.neighborhoods?.filter((n) =>
    n.name.toLowerCase().includes(searchNeighborhood.toLowerCase())
  )

  const inactiveNeighborhoods = city.neighborhoods?.filter((n) => !n.active)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl p-6 space-y-6">
        {/* Header */}
        <div className="border-b pb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Editar Cidade: {city.city}
          </h3>
        </div>

        {/* Corpo do Modal - Layout Grid Responsivo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto pr-4">
          {/* Coluna da Esquerda - Configurações de Emergência */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-900 uppercase mb-4">
                Configurações de Emergência
              </h4>

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700">
                  Modo Emergencial
                </span>
                <Switch
                  checked={isEmergency}
                  onChange={(e) => handleChangeEmergency(e)}
                  color="warning"
                />
              </div>

              {isEmergency && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Início
                      </label>
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => handleChangeTimeEmergency(e, 'start')}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fim
                      </label>
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => handleChangeTimeEmergency(e, 'end')}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Horário no qual serão ACEITOS os serviços emergenciais.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Coluna da Direita - Gerenciamento de Bairros */}
          <div className="space-y-6">
            {/* Seção: Gerenciar Bairros Existentes */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-900 uppercase mb-4">
                Gerenciar Bairros
              </h4>

              <Autocomplete
                options={filteredNeighborhoods || []}
                getOptionLabel={(option) => option.name}
                value={selectedNeighborhood}
                onChange={(_, newValue) => {
                  setSelectedNeighborhood(newValue)
                  setSearchNeighborhood(newValue ? newValue.name : '')
                }}
                inputValue={searchNeighborhood}
                onInputChange={(_, newInputValue) =>
                  setSearchNeighborhood(newInputValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Pesquisar Bairro"
                    variant="outlined"
                    fullWidth
                    size="small"
                  />
                )}
              />

              {selectedNeighborhood && (
                <button
                  onClick={() =>
                    handleToggleNeighborhoodStatus(
                      selectedNeighborhood,
                      !selectedNeighborhood.active
                    )
                  }
                  className="w-full mt-4 py-2 px-4 bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  {selectedNeighborhood.active ? 'Desativar' : 'Reativar'}{' '}
                  Bairro Selecionado
                </button>
              )}
            </div>

            {/* Seção: Adicionar Novo Bairro */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-900 uppercase mb-4">
                Adicionar Novo Bairro
              </h4>

              <div className="flex gap-4 mb-4">
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Nome do Bairro"
                  value={newNeighborhoodName}
                  onChange={(e) => setNewNeighborhoodName(e.target.value)}
                  size="small"
                />
                <Select
                  value={newNeighborhoodStatus}
                  onChange={(e: SelectChangeEvent) =>
                    setNewNeighborhoodStatus(
                      e.target.value as 'active' | 'inactive'
                    )
                  }
                  className="min-w-[120px]"
                  size="small"
                >
                  <MenuItem value="active">Ativo</MenuItem>
                  <MenuItem value="inactive">Inativo</MenuItem>
                </Select>
              </div>

              <button
                onClick={handleCreateNeighborhood}
                className="w-full py-2 px-4 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Criar Novo Bairro
              </button>
            </div>

            {/* Seção: Bairros Inativos */}
            {inactiveNeighborhoods?.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-900 uppercase mb-4">
                  Bairros Desativados
                </h4>
                <div className="space-y-2">
                  {inactiveNeighborhoods.map((n, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 bg-white rounded-md"
                    >
                      <span className="text-sm text-gray-600">{n.name}</span>
                      <button
                        onClick={() => handleToggleNeighborhoodStatus(n, true)}
                        className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
                      >
                        Reativar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}

export default CityModal
