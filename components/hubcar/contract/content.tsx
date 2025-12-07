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

import ModelA from "./modelContract/modelA"

// Define types
type Client = {
  id: string
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
  cep: string
}

type Vehicle = {
  id: string
  placa: string
  modelo: string
  ano: string
  kmInicial: string
  kmAtual: string
  marca: string
  cor: string
  renavam: string
}

type Contract = {
  id: string
  idcliente: string
  idveiculo: string
  cliente_nome: string
  data_inicio: string // ISO format date string
  data_final: string   // ISO format date string
  contrato_modelo: string
  data_criacao: string
  hora_entrega: string
  valor_locacao: string
  franquia: string
  caucao: string
  numero_contrato: number
}

// Helper function to format date for input fields (YYYY-MM-DD)
const formatDateForInput = (dateString: string): string => {
  if (!dateString) return '';
  // If it's already in YYYY-MM-DD format, return as is
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateString;
  }
  // Otherwise convert from ISO string to YYYY-MM-DD
  return dateString.split('T')[0];
};

// Helper function to ensure date is stored as proper ISO string
const formatToISODate = (dateString: string): string => {
  if (!dateString) return '';
  // If it's already a full ISO date string, return as is
  if (dateString.includes('T')) {
    return dateString;
  }
  // If it's in YYYY-MM-DD format, convert to ISO with time
  return new Date(dateString + 'T12:00:00').toISOString();
};

export default function ContractContent() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  
  // Fetch contracts from API
  const fetchContracts = async () => {
    try {
      const response = await fetch('/api/contracts')
      const data = await response.json()
      setContracts(data)
    } catch (error) {
      console.error('Error fetching contracts:', error)
    }
  }

  // Fetch clients from API
  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients')
      const data = await response.json()
      setClients(data)
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }

  // Fetch vehicles from API
  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles')
      const data = await response.json()
      setVehicles(data)
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchContracts()
    fetchClients()
    fetchVehicles()
  }, [])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentContractId, setCurrentContractId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    idcliente: '',
    idveiculo: '',
    cliente_nome: '',
    data_inicio: '',
    data_final: '',
    contrato_modelo: '',
    hora_entrega: '',
    valor_locacao: '',
    franquia: '',
    caucao: '',
    numero_contrato: 0
  })
  const [errorMessage, setErrorMessage] = useState('')

  const handleSelectClient = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId)
    setFormData(prev => ({
      ...prev,
      idcliente: clientId,
      cliente_nome: client ? client.nome : ''
    }))
  }

  const handleSelectVehicle = (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId)
    setFormData(prev => ({
      ...prev,
      idveiculo: vehicleId
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
    
    // Generate the next contract number
    const nextContractNumber = contracts.length > 0 
      ? Math.max(...contracts.map(c => c.numero_contrato)) + 1 
      : 1
    
    setFormData({
      idcliente: '',
      idveiculo: '',
      cliente_nome: '',
      data_inicio: '',
      data_final: '',
      contrato_modelo: '',
      hora_entrega: '',
      valor_locacao: '',
      franquia: '',
      caucao: '',
      numero_contrato: nextContractNumber
    })
    setErrorMessage('')
    setIsDialogOpen(true)
  }

  const handleEditContract = (contract: Contract) => {
    setIsEditing(true)
    setCurrentContractId(contract.id)
    setFormData({
      idcliente: contract.idcliente || '',
      idveiculo: contract.idveiculo || '',
      cliente_nome: contract.cliente_nome || '',
      data_inicio: contract.data_inicio || '', // ISO format
      data_final: contract.data_final || '',   // ISO format
      contrato_modelo: contract.contrato_modelo || '',
      hora_entrega: contract.hora_entrega || '',
      valor_locacao: contract.valor_locacao || '',
      franquia: contract.franquia || '',
      caucao: contract.caucao || '',
      numero_contrato: contract.numero_contrato || 0
    })
    setErrorMessage('')
    setIsDialogOpen(true)
  }

  const handleDeleteContract = async (contractId: string) => {
    try {
      const response = await fetch(`/api/contracts/${contractId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        // Refresh contract list
        fetchContracts()
      } else {
        console.error('Failed to delete contract')
      }
    } catch (error) {
      console.error('Error deleting contract:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
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
    
    // Format dates to ensure proper ISO format without timezone issues
    const formattedStartDate = formatToISODate(formData.data_inicio);
    const formattedEndDate = formatToISODate(formData.data_final);
    
    try {
      if (isEditing && currentContractId) {
        // Update existing contract
        const response = await fetch(`/api/contracts/${currentContractId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idcliente: formData.idcliente,
            idveiculo: formData.idveiculo,
            cliente_nome: formData.cliente_nome,
            data_inicio: formattedStartDate, // ISO format
            data_final: formattedEndDate,   // ISO format
            contrato_modelo: formData.contrato_modelo,
            hora_entrega: formData.hora_entrega,
            valor_locacao: parseFloat(formData.valor_locacao),
            franquia: formData.franquia,
            caucao: formData.caucao,
            numero_contrato: formData.numero_contrato
          }),
        })
        
        if (response.ok) {
          // Refresh contract list
          fetchContracts()
        } else {
          console.error('Failed to update contract')
        }
      } else {
        // Add new contract
        const response = await fetch('/api/contracts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idcliente: formData.idcliente,
            idveiculo: formData.idveiculo,
            cliente_nome: formData.cliente_nome,
            data_inicio: formattedStartDate, // ISO format
            data_final: formattedEndDate,   // ISO format
            contrato_modelo: formData.contrato_modelo,
            hora_entrega: formData.hora_entrega,
            valor_locacao: parseFloat(formData.valor_locacao),
            franquia: formData.franquia,
            caucao: formData.caucao,
            numero_contrato: formData.numero_contrato
          }),
        })
        
        if (response.ok) {
          // Refresh contract list
          fetchContracts()
        } else {
          console.error('Failed to create contract')
        }
      }
      
      // Reset form and close dialog
      // Generate the next contract number for the next contract
      const nextContractNumber = contracts.length > 0 
        ? Math.max(...contracts.map(c => c.numero_contrato)) + 1 
        : 1
        
      setFormData({
        idcliente: '',
        idveiculo: '',
        cliente_nome: '',
        data_inicio: '',
        data_final: '',
        contrato_modelo: '',
        hora_entrega: '',
        valor_locacao: '',
        franquia: '',
        caucao: '',
        numero_contrato: nextContractNumber
      })
      setErrorMessage('')
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }


const handleGenerateContract = async (contractId: string) => {

    let contractToPdf = contracts.find((contract) => contract.id === contractId);
    let clientContract = clients.find((client) => client.id === contractToPdf?.idcliente);
    let vehicleContract = vehicles.find((vehicle) => vehicle.id === contractToPdf?.idveiculo);
    
    // Call ModelA as a function with the required parameters
    if (contractToPdf?.contrato_modelo === "A" && contractToPdf && clientContract && vehicleContract) {
      ModelA(contractToPdf, clientContract, vehicleContract);
    }
    if(contractToPdf?.contrato_modelo === "B") return alert("modelo B não implementado, favor alterar para modelo A")
};


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
                    <SelectItem key={client.id} value={client.id}>
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
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.marca} - {vehicle.placa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data Início</Label>
                <Input 
                  id="startDate" 
                  name="data_inicio" 
                  type="date"
                  value={formatDateForInput(formData.data_inicio)} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">Data Fim</Label>
                <Input 
                  id="endDate" 
                  name="data_final" 
                  type="date"
                  value={formatDateForInput(formData.data_final)} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hora_entrega">Hora da Entrega</Label>
                <Input 
                  id="hora_entrega" 
                  name="hora_entrega" 
                  type="time"
                  value={formData.hora_entrega} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valor_locacao">Valor da Locação (R$)</Label>
                <Input 
                  id="valor_locacao" 
                  name="valor_locacao" 
                  type="number"
                  step="0.01"
                  value={formData.valor_locacao} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="franquia">Franquia (KM)</Label>
                <Input 
                  id="franquia" 
                  name="franquia" 
                  type="number"
                  value={formData.franquia} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="caucao">Caução (R$)</Label>
                <Input 
                  id="caucao" 
                  name="caucao" 
                  type="number"
                  step="0.01"
                  value={formData.caucao} 
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
          <TableRow>
            <TableHead>Nº Contrato</TableHead>
            <TableHead>Contratante</TableHead>
            <TableHead>Data Contrato</TableHead>
            <TableHead>Data Inicio</TableHead>
            <TableHead>Data Final</TableHead>
            <TableHead>Modelo</TableHead>
            <TableHead>Contrato</TableHead>
            <TableHead>Edição</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract) => {
            return(
              <TableRow key={contract.id}>
                <TableCell className="font-medium">{contract.numero_contrato}</TableCell>
                <TableCell className="font-medium">{contract.cliente_nome}</TableCell>
                <TableCell>{new Date(contract.data_criacao).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>{new Date(contract.data_inicio).toLocaleDateString("pt-BR")}</TableCell>
                <TableCell>{new Date(contract.data_final).toLocaleDateString("pt-BR")}</TableCell>
                <TableCell>Modelo {contract.contrato_modelo}</TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleGenerateContract(contract.id)}
                  >
                   <FileText className="h-4 w-4" /> Contrato
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