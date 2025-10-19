'use client'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, Trash2, FileText } from "lucide-react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { useState, useEffect } from "react"

// Define types
type Client = {
  id: number
  nome: string
  cpf: string
  rg: string
  email: string
  telefone: string
  endereco: string
  numero: string
  semNumero: boolean
  complemento: string
  bairro: string
  cidade: string
  estado: string
}

type Vehicle = {
  id: number
  placa: string
  modelo: string
  ano: string
  kmInicial: string
  kmAtual: string
}

type Contract = {
  id: number
  idcliente: number
  idveiculo: number
  cliente_nome: string
  veiculo_modelo: string
  data_inicio: string
  data_final: string
  contrato_modelo: string
  data_criacao: string
}

export default function ContractContent() {
  // Load contracts from localStorage
  const [contracts, setContracts] = useState<Contract[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('contracts')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  // Load clients and vehicles for select options
  const [clients, setClients] = useState<Client[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentContractId, setCurrentContractId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    idcliente: '',
    idveiculo: '',
    cliente_nome: '',
    veiculo_modelo: '',
    data_inicio: '',
    data_final: '',
    contrato_modelo: ''
  })
  const [errorMessage, setErrorMessage] = useState('')

  // Load clients and vehicles from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedClients = localStorage.getItem('clients')
      const savedVehicles = localStorage.getItem('vehicles')
      
      setClients(savedClients ? JSON.parse(savedClients) : [])
      setVehicles(savedVehicles ? JSON.parse(savedVehicles) : [])
    }
  }, [])

  // Save contracts to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('contracts', JSON.stringify(contracts))
    }
  }, [contracts])

  const handleSelectClient = (clientId: string) => {
    const client = clients.find((c) => c.id === parseInt(clientId))
    setFormData(prev => ({
      ...prev,
      idcliente: clientId,
      cliente_nome: client ? client.nome : ''
    }))
  }

  const handleSelectVehicle = (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === parseInt(vehicleId))
    setFormData(prev => ({
      ...prev,
      idveiculo: vehicleId,
      veiculo_modelo: vehicle ? vehicle.modelo : ''
    }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error message when user starts typing
    if (errorMessage) {
      setErrorMessage('')
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error message when user makes a selection
    if (errorMessage) {
      setErrorMessage('')
    }
  }

  const handleAddContract = () => {
    setIsEditing(false)
    setCurrentContractId(null)
    setFormData({
      idcliente: '',
      idveiculo: '',
      cliente_nome: '',
      veiculo_modelo: '',
      data_inicio: '',
      data_final: '',
      contrato_modelo: ''
    })
    setErrorMessage('')
    setIsDialogOpen(true)
  }

  const handleEditContract = (contract: Contract) => {
    setIsEditing(true)
    setCurrentContractId(contract.id)
    setFormData({
      idcliente: contract.idcliente?.toString() || '',
      idveiculo: contract.idveiculo?.toString() || '',
      cliente_nome: contract.cliente_nome || '',
      veiculo_modelo: contract.veiculo_modelo || '',
      data_inicio: contract.data_inicio || '',
      data_final: contract.data_final || '',
      contrato_modelo: contract.contrato_modelo || ''
    })
    setErrorMessage('')
    setIsDialogOpen(true)
  }

  const handleDeleteContract = (contractId: number) => {
    setContracts(prev => prev.filter((contract) => contract.id !== contractId))
  }

  const handleGenerateContract = (contractId: number) => {
    // In a real application, this would generate a PDF or navigate to a contract view
    alert(`Gerando contrato para o contrato ID: ${contractId}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.idcliente || !formData.idveiculo || !formData.data_inicio || 
        !formData.data_final || !formData.contrato_modelo) {
      setErrorMessage('Todos os campos são obrigatórios!')
      return
    }
    
    // Validate date logic
    if (formData.data_inicio >= formData.data_final) {
      setErrorMessage('A data de início deve ser anterior à data de término!')
      return
    }
    
    if (isEditing && currentContractId) {
      // Update existing contract
      setContracts(prev => prev.map((contract) => 
        contract.id === currentContractId 
          ? {
              ...contract,
              idcliente: parseInt(formData.idcliente),
              idveiculo: parseInt(formData.idveiculo),
              cliente_nome: formData.cliente_nome,
              veiculo_modelo: formData.veiculo_modelo,
              data_inicio: formData.data_inicio,
              data_final: formData.data_final,
              contrato_modelo: formData.contrato_modelo
            }
          : contract
      ))
    } else {
      // Add new contract
      const newContract: Contract = {
        id: Date.now(),
        idcliente: parseInt(formData.idcliente),
        idveiculo: parseInt(formData.idveiculo),
        cliente_nome: formData.cliente_nome,
        veiculo_modelo: formData.veiculo_modelo,
        data_inicio: formData.data_inicio,
        data_final: formData.data_final,
        contrato_modelo: formData.contrato_modelo,
        data_criacao: new Date().toISOString()
      }
      
      setContracts(prev => [...prev, newContract])
    }
    
    // Reset form and close dialog
    setFormData({
      idcliente: '',
      idveiculo: '',
      cliente_nome: '',
      veiculo_modelo: '',
      data_inicio: '',
      data_final: '',
      contrato_modelo: ''
    })
    setErrorMessage('')
    setIsDialogOpen(false)
  }

  return (
    <>
      <Button className="mb-4" onClick={handleAddContract}>  
        Adicionar Contrato
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Contrato' : 'Cadastro de Contrato'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="text-red-500 text-sm">{errorMessage}</div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="idcliente">Contratante</Label>
              <Select 
                value={formData.idcliente} 
                onValueChange={(value) => handleSelectClient(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="idveiculo">Veículo</Label>
              <Select 
                value={formData.idveiculo} 
                onValueChange={(value) => handleSelectVehicle(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um veículo" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                      {vehicle.modelo} - {vehicle.placa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data_inicio">Data Início</Label>
                <Input 
                  id="data_inicio" 
                  name="data_inicio" 
                  type="date"
                  value={formData.data_inicio} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="data_final">Data Fim</Label>
                <Input 
                  id="data_final" 
                  name="data_final" 
                  type="date"
                  value={formData.data_final} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contrato_modelo">Modelo do Contrato</Label>
              <Select 
                value={formData.contrato_modelo} 
                onValueChange={(value) => handleSelectChange('contrato_modelo', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o modelo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Modelo A</SelectItem>
                  <SelectItem value="B">Modelo B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              {isEditing && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={() => {
                    if (currentContractId) {
                      handleDeleteContract(currentContractId)
                      setIsDialogOpen(false)
                    }
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </Button>
              )}
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? 'Salvar' : 'Cadastrar Contrato'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      <Table>
        <TableCaption>Lista de Contratos</TableCaption>
        <TableHeader>
          <TableRow >
            <TableHead className="text-center">Contratante</TableHead>
            <TableHead className="text-center">Criação Contrato</TableHead>
            <TableHead className="text-center">Inicio Contrato</TableHead>
            <TableHead className="text-center">Fim Contrato</TableHead>
            <TableHead className="text-center">Modelo Contrato</TableHead>
            <TableHead className="text-center">Gerar contrato</TableHead>
            <TableHead className="text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract) => {
            return(
              <TableRow key={contract.id} className="text-center" >
                <TableCell className="font-medium">{contract.cliente_nome}</TableCell>
                <TableCell>{new Date(contract.data_criacao).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(contract.data_inicio).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(contract.data_final).toLocaleDateString()}</TableCell>
                <TableCell>Modelo {contract.contrato_modelo}</TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleGenerateContract(contract.id)}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditContract(contract)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}