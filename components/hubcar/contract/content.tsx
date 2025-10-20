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
  cep: string
}

type Vehicle = {
  id: number
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
  id: number
  idcliente: number
  idveiculo: number
  cliente_nome: string
  data_inicio: string
  data_final: string
  contrato_modelo: string
  data_criacao: string
  hora_entrega: string
  valor_locacao: string
  franquia: string
  caucao: string
  numero_contrato: number
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
      idcliente: contract.idcliente?.toString() || '',
      idveiculo: contract.idveiculo?.toString() || '',
      cliente_nome: contract.cliente_nome || '',
      data_inicio: contract.data_inicio || '',
      data_final: contract.data_final || '',
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

  const handleDeleteContract = (contractId: number) => {
    setContracts(prev => prev.filter((contract) => contract.id !== contractId))
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
              data_inicio: formData.data_inicio,
              data_final: formData.data_final,
              contrato_modelo: formData.contrato_modelo,
              hora_entrega: formData.hora_entrega,
              valor_locacao: formData.valor_locacao,
              franquia: formData.franquia,
              caucao: formData.caucao,
              numero_contrato: formData.numero_contrato
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
        data_inicio: formData.data_inicio,
        data_final: formData.data_final,
        contrato_modelo: formData.contrato_modelo,
        data_criacao: new Date().toISOString(),
        hora_entrega: formData.hora_entrega,
        valor_locacao: formData.valor_locacao,
        franquia: formData.franquia,
        caucao: formData.caucao,
        numero_contrato: formData.numero_contrato
      }
      
      setContracts(prev => [...prev, newContract])
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
  }


const handleGenerateContract = async (contractId: number) => {

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
                  value={formData.data_inicio} 
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
                  value={formData.data_final} 
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