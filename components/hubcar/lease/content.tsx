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
import { Pencil, Trash2, Upload } from "lucide-react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
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

type Lease = {
  id: number
  idcliente: number
  idveiculo: number
  cliente_nome: string
  veiculo_info: string
  kmatual: string
  kmrodado: string
  franquia: string
  valor: string
  datainicial: string
  datafinal: string
  status: string
  data_criacao: string
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

export default function LeaseContent() {
  const { toast } = useToast()
  
  // Load leases from localStorage
  const [leases, setLeases] = useState<Lease[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('leases')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  // Load clients and vehicles for select options
  const [clients, setClients] = useState<Client[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  
  // Load contracts for import functionality
  const [contracts, setContracts] = useState<Contract[]>([])
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentLeaseId, setCurrentLeaseId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    idcliente: '',
    idveiculo: '',
    cliente_nome: '',
    veiculo_info: '',
    kmatual: '',
    kmrodado: '',
    franquia: '',
    valor: '',
    datainicial: '',
    datafinal: '',
    status: 'Ativo'
  })
  const [errorMessage, setErrorMessage] = useState('')

  // State for import contract modal
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  
  // State for kmrodado input modal
  const [isKmModalOpen, setIsKmModalOpen] = useState(false)
  const [kmrodadoValue, setKmrodadoValue] = useState('')
  const [calculatedValue, setCalculatedValue] = useState('')
  const [currentLeaseForKm, setCurrentLeaseForKm] = useState<number | null>(null)
  const [currentLeaseFranquia, setCurrentLeaseFranquia] = useState<number>(0)
  const [currentLeaseValor, setCurrentLeaseValor] = useState<number>(0)
  const [isValueManuallyChanged, setIsValueManuallyChanged] = useState(false)
  
  // Load clients, vehicles, and contracts from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedClients = localStorage.getItem('clients')
      const savedVehicles = localStorage.getItem('vehicles')
      const savedContracts = localStorage.getItem('contracts')
      
      setClients(savedClients ? JSON.parse(savedClients) : [])
      setVehicles(savedVehicles ? JSON.parse(savedVehicles) : [])
      setContracts(savedContracts ? JSON.parse(savedContracts) : [])
    }
  }, [])

  // Save leases to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('leases', JSON.stringify(leases))
    }
  }, [leases])

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
      veiculo_info: vehicle ? `${vehicle.marca} : ${vehicle.placa}` : '',
      kmatual: vehicle ? vehicle.kmAtual || '' : ''
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

  const handleAddLease = () => {
    setIsEditing(false)
    setCurrentLeaseId(null)
    
    setFormData({
      idcliente: '',
      idveiculo: '',
      cliente_nome: '',
      veiculo_info: '',
      kmatual: '',
      kmrodado: '',
      franquia: '',
      valor: '',
      datainicial: '',
      datafinal: '',
      status: 'Ativo'
    })
    setErrorMessage('')
    setIsDialogOpen(true)
  }

  const handleEditLease = (lease: Lease) => {
    setIsEditing(true)
    setCurrentLeaseId(lease.id)
    setFormData({
      idcliente: lease.idcliente?.toString() || '',
      idveiculo: lease.idveiculo?.toString() || '',
      cliente_nome: lease.cliente_nome || '',
      veiculo_info: lease.veiculo_info || '',
      kmatual: lease.kmatual || '',
      kmrodado: lease.kmrodado || '',
      franquia: lease.franquia || '',
      valor: lease.valor || '',
      datainicial: lease.datainicial || '',
      datafinal: lease.datafinal || '',
      status: lease.status || 'Ativo'
    })
    setErrorMessage('')
    setIsDialogOpen(true)
  }

  const handleDeleteLease = (leaseId: number) => {
    // Before deleting, if the lease was completed, revert the KM change
    const leaseToDelete = leases.find(lease => lease.id === leaseId);
    if (leaseToDelete && leaseToDelete.status === 'Concluído' && leaseToDelete.kmrodado) {
      updateVehicleKM(leaseToDelete.idveiculo, -parseFloat(leaseToDelete.kmrodado));
    }
    
    setLeases(prev => prev.filter((lease) => lease.id !== leaseId))
  }

  // Function to update vehicle KM
  const updateVehicleKM = (vehicleId: number, kmChange: number) => {
    if (typeof window !== 'undefined') {
      const storedVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
      const updatedVehicles = storedVehicles.map((vehicle: Vehicle) => {
        if (vehicle.id === vehicleId) {
          const currentKM = parseFloat(vehicle.kmAtual) || 0;
          const newKM = currentKM + kmChange;
          return {
            ...vehicle,
            kmAtual: newKM.toString()
          };
        }
        return vehicle;
      });
      
      localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
      setVehicles(updatedVehicles);
    }
  };

  // Function to update lease status directly from table
  const updateLeaseStatus = (leaseId: number, newStatus: string) => {
    // Get the lease to check current status and kmrodado
    const leaseToUpdate = leases.find(lease => lease.id === leaseId);
    
    if (!leaseToUpdate) return;
    
    // Validate that the vehicle doesn't have an active lease when setting status to "Ativo"
    if (newStatus === 'Ativo') {
      const vehicleId = leaseToUpdate.idveiculo;
      const hasActiveLease = leases.some(lease => 
        lease.idveiculo === vehicleId && 
        lease.status === 'Ativo' && 
        lease.id !== leaseId // Allow changing the current lease
      );
      
      if (hasActiveLease) {
        toast({
          title: "Erro",
          description: "Este veículo já possui uma locação ativa!",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Validate kmrodado is required when status is "Concluído"
    if (newStatus === 'Concluído') {
      const existingLeaseData = leases.find(lease => lease.id === leaseId);
      if (existingLeaseData) {
        const kmrodado = parseFloat(existingLeaseData.kmrodado || '0') || 0;
        if (kmrodado <= 0) {
          // Instead of showing toast, open modal to input kmrodado
          setCurrentLeaseForKm(leaseId);
          setCurrentLeaseFranquia(parseFloat(existingLeaseData.franquia) || 0);
          setCurrentLeaseValor(parseFloat(existingLeaseData.valor) || 0);
          setKmrodadoValue('');
          setCalculatedValue(existingLeaseData.valor || '');
          setIsKmModalOpen(true);
          return;
        }
      }
    }
    
    // Update the lease status
    const updatedLeases = leases.map(lease => {
      if (lease.id === leaseId) {
        const updatedLease = {
          ...lease,
          status: newStatus
        };
        
        // Handle status change logic for KM updates
        if (lease.status === 'Concluído' && newStatus !== 'Concluído' && lease.kmrodado) {
          // If was completed and now is not, subtract KM
          updateVehicleKM(lease.idveiculo, -parseFloat(lease.kmrodado));
        } else if (newStatus === 'Concluído' && lease.status !== 'Concluído' && lease.kmrodado) {
          // If now is completed and wasn't before, add KM
          updateVehicleKM(lease.idveiculo, parseFloat(lease.kmrodado));
        }
        
        return updatedLease;
      }
      return lease;
    });
    
    setLeases(updatedLeases);
    
    // Show success toast
    toast({
      title: "Status atualizado",
      description: `O status da locação foi atualizado para ${newStatus}.`,
    });
  };

  // Function to calculate the new value based on kmrodado and franquia
  const calculateNewValue = () => {
    const kmValue = parseFloat(kmrodadoValue) || 0;
    const franquia = currentLeaseFranquia;
    const baseValue = currentLeaseValor;
    
    if (kmValue > franquia) {
      const extraKm = kmValue - franquia;
      const extraValue = extraKm * 1.20;
      const newValue = baseValue + extraValue;
      return newValue.toFixed(2);
    } else {
      return baseValue.toFixed(2);
    }
  };

  // Update calculated value when kmrodado changes
  useEffect(() => {
    if (isKmModalOpen && kmrodadoValue && !isValueManuallyChanged) {
      const newValue = calculateNewValue();
      setCalculatedValue(newValue);
    }
  }, [kmrodadoValue, isKmModalOpen, isValueManuallyChanged]);

  // Function to handle value field changes
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCalculatedValue(newValue);
    setIsValueManuallyChanged(true);
  };

  // Function to handle kmrodado field changes
  const handleKmrodadoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKmValue = e.target.value;
    setKmrodadoValue(newKmValue);
    // Reset manual change flag when kmrodado changes
    setIsValueManuallyChanged(false);
  };

  // Function to save kmrodado value
  const saveKmrodado = () => {
    if (!currentLeaseForKm) return;
    
    const kmValue = parseFloat(kmrodadoValue) || 0;
    if (kmValue <= 0) {
      toast({
        title: "Erro",
        description: "O KM rodado deve ser um valor positivo!",
        variant: "destructive",
      });
      return;
    }
    
    const valueToSave = parseFloat(calculatedValue) || 0;
    if (valueToSave <= 0) {
      toast({
        title: "Erro",
        description: "O valor deve ser um valor positivo!",
        variant: "destructive",
      });
      return;
    }
    
    // Update the lease with kmrodado value and calculated value
    const updatedLeases = leases.map(lease => {
      if (lease.id === currentLeaseForKm) {
        return {
          ...lease,
          kmrodado: kmValue.toString(),
          valor: valueToSave.toString(),
          status: 'Concluído'
        };
      }
      return lease;
    });
    
    setLeases(updatedLeases);
    
    // Update vehicle KM
    const lease = leases.find(l => l.id === currentLeaseForKm);
    if (lease) {
      updateVehicleKM(lease.idveiculo, kmValue);
    }
    
    // Close modal and show success toast
    setIsKmModalOpen(false);
    setCurrentLeaseForKm(null);
    setKmrodadoValue('');
    setCalculatedValue('');
    setIsValueManuallyChanged(false);
    
    toast({
      title: "KM Registrado",
      description: "O KM rodado foi registrado e o status atualizado para Concluído.",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.idcliente || !formData.idveiculo || !formData.kmatual || 
        !formData.franquia || !formData.valor || !formData.datainicial || 
        !formData.datafinal) {
      setErrorMessage('Todos os campos são obrigatórios!')
      return
    }
    
    // Validate date logic
    if (formData.datainicial >= formData.datafinal) {
      setErrorMessage('A data inicial deve ser anterior à data final!')
      return
    }
    
    // Validate KM values
    const kmatual = parseFloat(formData.kmatual) || 0;
    const kmrodado = parseFloat(formData.kmrodado) || 0;
    
    if (kmrodado < 0) {
      setErrorMessage('O KM rodado não pode ser negativo!')
      return
    }
    
    // Validate that the vehicle doesn't have an active lease
    const vehicleId = parseInt(formData.idveiculo);
    const hasActiveLease = leases.some(lease => 
      lease.idveiculo === vehicleId && 
      lease.status === 'Ativo' && 
      lease.id !== currentLeaseId // Allow editing the current lease
    );
    
    if (hasActiveLease) {
      setErrorMessage('Este veículo já possui uma locação ativa!')
      return
    }
    
    // Validate kmrodado is required when status is "Concluído"
    if (formData.status === 'Concluído' && (!formData.kmrodado || kmrodado <= 0)) {
      setErrorMessage('O campo KM rodado é obrigatório quando o status é Concluído!')
      return
    }
    
    if (isEditing && currentLeaseId) {
      // Get the existing lease to check status changes
      const existingLease = leases.find(lease => lease.id === currentLeaseId);
      
      // Update existing lease
      const updatedLeases = leases.map((lease) => {
        if (lease.id === currentLeaseId) {
          const updatedLease = {
            ...lease,
            idcliente: parseInt(formData.idcliente),
            idveiculo: parseInt(formData.idveiculo),
            cliente_nome: formData.cliente_nome,
            veiculo_info: formData.veiculo_info,
            kmatual: formData.kmatual,
            kmrodado: formData.kmrodado,
            franquia: formData.franquia,
            valor: formData.valor,
            datainicial: formData.datainicial,
            datafinal: formData.datafinal,
            status: formData.status
          };
          
          // Handle status change logic
          if (existingLease) {
            // If lease was previously completed and now is not, subtract KM
            if (existingLease.status === 'Concluído' && formData.status !== 'Concluído' && existingLease.kmrodado) {
              updateVehicleKM(parseInt(formData.idveiculo), -parseFloat(existingLease.kmrodado));
            }
            // If lease is now completed and wasn't before, add KM
            else if (formData.status === 'Concluído' && existingLease.status !== 'Concluído' && formData.kmrodado) {
              updateVehicleKM(parseInt(formData.idveiculo), parseFloat(formData.kmrodado));
            }
            // If lease was completed and still is, but KM changed, update the difference
            else if (formData.status === 'Concluído' && existingLease.status === 'Concluído' && formData.kmrodado !== existingLease.kmrodado) {
              const kmDifference = (parseFloat(formData.kmrodado) || 0) - (parseFloat(existingLease.kmrodado) || 0);
              if (kmDifference !== 0) {
                updateVehicleKM(parseInt(formData.idveiculo), kmDifference);
              }
            }
          }
          
          return updatedLease;
        }
        return lease;
      });
      
      setLeases(updatedLeases);
    } else {
      // Add new lease
      const newLease: Lease = {
        id: Date.now(),
        idcliente: parseInt(formData.idcliente),
        idveiculo: parseInt(formData.idveiculo),
        cliente_nome: formData.cliente_nome,
        veiculo_info: formData.veiculo_info,
        kmatual: formData.kmatual,
        kmrodado: formData.kmrodado,
        franquia: formData.franquia,
        valor: formData.valor,
        datainicial: formData.datainicial,
        datafinal: formData.datafinal,
        status: formData.status,
        data_criacao: new Date().toISOString()
      }
      
      setLeases(prev => [...prev, newLease])
    }
    
    // Reset form and close dialog
    setFormData({
      idcliente: '',
      idveiculo: '',
      cliente_nome: '',
      veiculo_info: '',
      kmatual: '',
      kmrodado: '',
      franquia: '',
      valor: '',
      datainicial: '',
      datafinal: '',
      status: 'Ativo'
    })
    setErrorMessage('')
    setIsDialogOpen(false)
  }

  // Format currency
  const formatCurrency = (value: string) => {
    if (!value) return '';
    const number = parseFloat(value);
    return isNaN(number) ? '' : number.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Handle import contract
  const handleImportContract = (contract: Contract) => {
    // Find client and vehicle info
    const client = clients.find(c => c.id === contract.idcliente);
    const vehicle = vehicles.find(v => v.id === contract.idveiculo);
    
    // Set form data with contract information
    setFormData({
      idcliente: contract.idcliente?.toString() || '',
      idveiculo: contract.idveiculo?.toString() || '',
      cliente_nome: client ? client.nome : contract.cliente_nome || '',
      veiculo_info: vehicle ? `${vehicle.marca} : ${vehicle.placa}` : '',
      kmatual: vehicle ? vehicle.kmAtual || '' : '',
      kmrodado: '',
      franquia: contract.franquia || '',
      valor: contract.valor_locacao || '',
      datainicial: contract.data_inicio || '',
      datafinal: contract.data_final || '',
      status: 'Ativo'
    });
    
    // Close import dialog and open lease dialog
    setIsImportDialogOpen(false);
    setIsEditing(false);
    setCurrentLeaseId(null);
    setErrorMessage('');
    setIsDialogOpen(true);
  };

  // Filter contracts based on search term
  const filteredContracts = contracts.filter(contract => 
    contract.numero_contrato.toString().includes(searchTerm) ||
    contract.cliente_nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex gap-2 mb-4">
        <Button onClick={handleAddLease}>  
          Adicionar Locação
        </Button>
        <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Importar Contrato
        </Button>
      </div>
      
      {/* KM Rodado Input Modal */}
      <Dialog open={isKmModalOpen} onOpenChange={(open) => {
        setIsKmModalOpen(open);
        if (!open) {
          // Reset states when modal closes
          setIsValueManuallyChanged(false);
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar KM Rodado</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Para concluir a locação, é necessário informar o KM rodado.</p>
            <div className="space-y-2">
              <Label htmlFor="kmrodado">KM Rodado</Label>
              <Input 
                id="kmrodado"
                type="number"
                value={kmrodadoValue}
                onChange={handleKmrodadoChange}
                placeholder="Digite o KM rodado"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="calculatedValue">Valor (R$)</Label>
              <Input 
                id="calculatedValue"
                type="number"
                step="0.01"
                value={calculatedValue}
                onChange={handleValueChange}
                placeholder="Digite o valor"
              />
              <p className="text-sm text-gray-500">
                Franquia: {currentLeaseFranquia} KM <br/> 
                Valor base: R$ {currentLeaseValor.toFixed(2)} <br/> 
                Adicional: R$ 1,20 por KM excedente
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsKmModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={saveKmrodado}>
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Import Contract Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Importar Contrato</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Pesquisar Contrato</Label>
              <Input 
                id="search"
                placeholder="Digite o número do contrato ou nome do cliente"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Contrato</TableHead>
                  <TableHead>Contratante</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContracts.length > 0 ? (
                  filteredContracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell className="font-medium">{contract.numero_contrato}</TableCell>
                      <TableCell>{contract.cliente_nome}</TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          onClick={() => handleImportContract(contract)}
                        >
                          <Upload className="h-4 w-4" />
                          
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      Nenhum contrato encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Locação' : 'Cadastro de Locação'}</DialogTitle>
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
            <div className="space-y-2 ">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kmatual">KM Atual</Label>
                <Input 
                  id="kmatual" 
                  name="kmatual" 
                  type="number"
                  value={formData.kmatual} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="kmrodado">KM Rodado</Label>
                <Input 
                  id="kmrodado" 
                  name="kmrodado" 
                  type="number"
                  value={formData.kmrodado} 
                  onChange={handleInputChange} 
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
                <Label htmlFor="valor">Valor (R$)</Label>
                <Input 
                  id="valor" 
                  name="valor" 
                  type="number"
                  step="0.01"
                  value={formData.valor} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>              
              <div className="space-y-2">
                <Label htmlFor="datainicial">Data Inicial</Label>
                <Input 
                  id="datainicial" 
                  name="datainicial" 
                  type="date"
                  value={formData.datainicial} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="datafinal">Data Final</Label>
                <Input 
                  id="datafinal" 
                  name="datafinal" 
                  type="date"
                  value={formData.datafinal} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

            </div>

  
            
            <div className="flex justify-end space-x-2 pt-4">
              {isEditing && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={() => {
                    if (currentLeaseId) {
                      handleDeleteLease(currentLeaseId)
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
                {isEditing ? 'Salvar' : 'Cadastrar Locação'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      <Table>
        <TableCaption>Lista de Locações</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Contratante</TableHead>
            <TableHead>Veículo</TableHead>
            <TableHead>KM Atual</TableHead>
            <TableHead>KM Rodado</TableHead>
            <TableHead>Franquia</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Data Inicial</TableHead>
            <TableHead>Data Final</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Edição</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leases.map((lease) => {
            return(
              <TableRow key={lease.id}>
                <TableCell className="font-medium">{lease.cliente_nome}</TableCell>
                <TableCell>{lease.veiculo_info}</TableCell>
                <TableCell>{lease.kmatual} KM</TableCell>
                <TableCell>{lease.kmrodado || 0} KM</TableCell>
                <TableCell>{lease.franquia} KM</TableCell>
                <TableCell>{formatCurrency(lease.valor)}</TableCell>
                <TableCell>{new Date(lease.datainicial).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(lease.datafinal).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Select
                    value={lease.status}
                    onValueChange={(value) => updateLeaseStatus(lease.id, value)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Concluído">Concluído</SelectItem>
                      <SelectItem value="Cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditLease(lease)}
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
