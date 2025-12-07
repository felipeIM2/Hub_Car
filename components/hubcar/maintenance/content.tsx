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
import { Textarea } from "@/components/ui/textarea"
import { Pencil, Trash2, Plus, Eye } from "lucide-react"
import { useState, useEffect } from "react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

// Define types
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

type Part = {
  id: string
  descricao: string
  valor: string
  quantidade: string
  utilizados: string
}

type MaintenancePart = {
  partId: string
  descricao: string
  valor: number
  quantidade: number
  subtotal: number
}

type Maintenance = {
  id: string
  idveiculo: string
  veiculo: string
  placa: string
  datainicio: string
  datafinal: string
  valorManutencao: number
  valorServico: number
  total: number
  status: string
  descricao: string
  pecas: MaintenancePart[]
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

export default function MaintenanceContent() {
  const { toast } = useToast()
  
  const [maintenances, setMaintenances] = useState<Maintenance[]>([])

  // Fetch maintenances from API
  const fetchMaintenances = async () => {
    try {
      const response = await fetch('/api/maintenances')
      const data = await response.json()
      setMaintenances(data)
    } catch (error) {
      console.error('Error fetching maintenances:', error)
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

  // Fetch parts from API
  const fetchParts = async () => {
    try {
      const response = await fetch('/api/parts')
      const data = await response.json()
      setParts(data)
    } catch (error) {
      console.error('Error fetching parts:', error)
    }
  }

  // Load vehicles and parts for select options
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [parts, setParts] = useState<Part[]>([])
  
  // Load data on component mount
  useEffect(() => {
    fetchMaintenances()
    fetchVehicles()
    fetchParts()
  }, [])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentMaintenanceId, setCurrentMaintenanceId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    idveiculo: '',
    veiculo: '',
    placa: '',
    datainicio: '',
    datafinal: '',
    valorManutencao: '',
    valorServico: '',
    total: '',
    status: 'Ativo',
    descricao: ''
  })
  
  const [maintenanceParts, setMaintenanceParts] = useState<MaintenancePart[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  
  // State for parts selection modal
  const [isPartsDialogOpen, setIsPartsDialogOpen] = useState(false)
  const [selectedPart, setSelectedPart] = useState({
    partId: '',  // Keep as string
    quantidade: 1
  })
  
  // State for maintenance parts list modal
  const [isMaintenancePartsDialogOpen, setIsMaintenancePartsDialogOpen] = useState(false)
  const [selectedMaintenanceParts, setSelectedMaintenanceParts] = useState<MaintenancePart[]>([])

  // State for description modal
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false)
  const [selectedMaintenanceDescription, setSelectedMaintenanceDescription] = useState('')

  const handleSelectVehicle = (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId)
    setFormData(prev => ({
      ...prev,
      idveiculo: vehicleId,
      veiculo: vehicle ? `${vehicle.marca}` : '',
      placa: vehicle ? vehicle.placa : ''
    }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleAddMaintenance = () => {
    setIsEditing(false)
    setCurrentMaintenanceId(null)
    setFormData({
      idveiculo: '',
      veiculo: '',
      placa: '',
      datainicio: '',
      datafinal: '',
      valorManutencao: '',
      valorServico: '',
      total: '',
      status: 'Ativo',
      descricao: ''
    })
    setMaintenanceParts([])
    setErrorMessage('')
    setIsDialogOpen(true)
  }

  const handleEditMaintenance = (maintenance: Maintenance) => {
    setIsEditing(true)
    setCurrentMaintenanceId(maintenance.id)
    setFormData({
      idveiculo: maintenance.idveiculo,
      veiculo: maintenance.veiculo,
      placa: maintenance.placa,
      datainicio: maintenance.datainicio || '', // ISO format
      datafinal: maintenance.datafinal || '',   // ISO format
      valorManutencao: maintenance.valorManutencao.toString(),
      valorServico: maintenance.valorServico.toString(),
      total: maintenance.total.toString(),
      status: maintenance.status,
      descricao: maintenance.descricao
    })
    setMaintenanceParts(maintenance.pecas || [])
    setErrorMessage('')
    setIsDialogOpen(true)
  }

  const handleDeleteMaintenance = async (maintenanceId: string) => {
    try {
      const response = await fetch(`/api/maintenances/${maintenanceId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        // Refresh maintenance list
        fetchMaintenances()
      } else {
        console.error('Failed to delete maintenance')
      }
    } catch (error) {
      console.error('Error deleting maintenance:', error)
    }
  }

  // Function to update maintenance status directly from table
  const updateMaintenanceStatus = async (maintenanceId: string, newStatus: string) => {
    // Validate that parts value is required when status is "Concluído"
    if (newStatus === 'Concluído') {
      const maintenanceToUpdate = maintenances.find(m => m.id === maintenanceId);
      if (maintenanceToUpdate) {
        const partsValue = maintenanceToUpdate.valorManutencao || 0;
        if (partsValue <= 0 && maintenanceToUpdate.pecas.length > 0) {
          toast({
            title: "Erro",
            description: "É necessário ter peças com valor para concluir a manutenção!",
            variant: "destructive",
          });
          return;
        }
      }
    }
    
    // Update the maintenance status
    try {
      const maintenance = maintenances.find(m => m.id === maintenanceId);
      if (maintenance) {
        const response = await fetch(`/api/maintenances/${maintenanceId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...maintenance,
            status: newStatus
          }),
        })
        
        if (response.ok) {
          // Refresh maintenance list
          fetchMaintenances()
          
          // Show success toast
          toast({
            title: "Status atualizado",
            description: `O status da manutenção foi atualizado para ${newStatus}.`,
          });
        } else {
          console.error('Failed to update maintenance status')
        }
      }
    } catch (error) {
      console.error('Error updating maintenance status:', error)
    }
  };

  // Function to update parts inventory when parts are used or returned (placeholder for MongoDB)
  const updatePartsInventory = (partsToUpdate: MaintenancePart[], isAdding: boolean) => {
    // In a real implementation with MongoDB, this would update the parts collection
    console.log(`Would update parts inventory in MongoDB: ${isAdding ? 'adding' : 'removing'} parts`, partsToUpdate);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.idveiculo || !formData.datainicio || !formData.datafinal || 
        !formData.descricao) {
      setErrorMessage('Os campos Veículo, Data Início, Data Final e Descrição são obrigatórios!')
      return
    }
    
  
    // Validate that the vehicle doesn't have an active maintenance
    const vehicleId = formData.idveiculo;
    const hasActiveMaintenance = maintenances.some(maintenance => 
      maintenance.idveiculo === vehicleId && 
      maintenance.status === 'Ativo' && 
      maintenance.id !== currentMaintenanceId // Allow editing the current maintenance
    );
    
    if (hasActiveMaintenance && (!isEditing || (isEditing && formData.status === 'Ativo'))) {
      setErrorMessage('Este veículo já possui uma manutenção ativa!')
      return
    }
    
    // Validate values
    const valorManutencao = parseFloat(formData.valorManutencao) || 0
    const valorServico = parseFloat(formData.valorServico) || 0
    
    if (valorManutencao < 0 || valorServico < 0) {
      setErrorMessage('Os valores devem ser números positivos!')
      return
    }
    
    // Format dates to ensure proper ISO format without timezone issues
    const formattedStartDate = formatToISODate(formData.datainicio);
    const formattedEndDate = formatToISODate(formData.datafinal);
    
    // Calculate total
    const partsTotal = maintenanceParts.reduce((sum, part) => sum + part.subtotal, 0)
    const total = partsTotal + valorServico
    
    try {
      if (isEditing && currentMaintenanceId) {
        // For editing, we need to handle inventory differently
        // First, get the original maintenance record
        const originalMaintenance = maintenances.find(m => m.id === currentMaintenanceId);
        
        if (originalMaintenance) {
          // Return the original parts to inventory
          updatePartsInventory(originalMaintenance.pecas, false);
          // Deduct the new parts from inventory
          updatePartsInventory(maintenanceParts, true);
        }
        
        // Update existing maintenance
        const response = await fetch(`/api/maintenances/${currentMaintenanceId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idveiculo: formData.idveiculo,
            veiculo: formData.veiculo,
            placa: formData.placa,
            datainicio: formattedStartDate, // ISO format
            datafinal: formattedEndDate,   // ISO format
            valorManutencao: partsTotal,
            valorServico: valorServico,
            total: total,
            status: formData.status,
            descricao: formData.descricao,
            pecas: maintenanceParts
          }),
        })
        
        if (response.ok) {
          // Refresh maintenance list
          fetchMaintenances()
        } else {
          console.error('Failed to update maintenance')
        }
      } else {
        // Add new maintenance
        const response = await fetch('/api/maintenances', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idveiculo: formData.idveiculo,
            veiculo: formData.veiculo,
            placa: formData.placa,
            datainicio: formattedStartDate, // ISO format
            datafinal: formattedEndDate,   // ISO format
            valorManutencao: partsTotal,
            valorServico: valorServico,
            total: total,
            status: formData.status,
            descricao: formData.descricao,
            pecas: maintenanceParts
          }),
        })
        
        if (response.ok) {
          // Refresh maintenance list
          fetchMaintenances()
          
          // Update parts inventory - deduct used parts from stock
          updatePartsInventory(maintenanceParts, true);
        } else {
          console.error('Failed to create maintenance')
        }
      }
      
      // Reset form and close dialog
      setFormData({
        idveiculo: '',
        veiculo: '',
        placa: '',
        datainicio: '',
        datafinal: '',
        valorManutencao: '',
        valorServico: '',
        total: '',
        status: 'Ativo',
        descricao: ''
      })
      setMaintenanceParts([])
      setErrorMessage('')
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  // Parts selection functions
  const openPartsDialog = () => {
    setSelectedPart({
      partId: '',  // Initialize as empty string
      quantidade: 1
    })
    setIsPartsDialogOpen(true)
  }

  const handlePartSelection = (partId: string) => {
    setSelectedPart(prev => ({
      ...prev,
      partId: partId  // Keep as string, don't convert to number
    }))
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = parseInt(e.target.value) || 1
    setSelectedPart(prev => ({
      ...prev,
      quantidade: quantity
    }))
  }

  const addPartToMaintenance = () => {
    if (!selectedPart.partId) {
      return
    }
    
    const part = parts.find(p => p.id === selectedPart.partId)
    if (!part) return
    
    const quantidade = selectedPart.quantidade
    const availableQuantity = parseInt(part.quantidade) || 0
    const usedQuantity = parseInt(part.utilizados) || 0
    
    // Check if trying to add more parts than available
    if (quantidade > availableQuantity) {
      toast({
        title: "Erro",
        description: `Quantidade indisponível. Disponível: ${availableQuantity}, Solicitado: ${quantidade}`,
        variant: "destructive",
      })
      return
    }
    
    const valor = parseFloat(part.valor) || 0
    const subtotal = valor * quantidade
    
    const maintenancePart: MaintenancePart = {
      partId: selectedPart.partId,
      descricao: part.descricao,
      valor: valor,
      quantidade: quantidade,
      subtotal: subtotal
    }
    
    // Check if part already exists in maintenance
    const existingIndex = maintenanceParts.findIndex(p => p.partId === selectedPart.partId)
    
    if (existingIndex >= 0) {
      // Update existing part
      const updatedParts = [...maintenanceParts]
      updatedParts[existingIndex] = maintenancePart
      setMaintenanceParts(updatedParts)
    } else {
      // Add new part
      setMaintenanceParts(prev => [...prev, maintenancePart])
    }
    
    // Update the total value in the form
    const partsTotal = [...maintenanceParts.filter(p => p.partId !== selectedPart.partId), maintenancePart]
      .reduce((sum, part) => sum + part.subtotal, 0)
    const valorServico = parseFloat(formData.valorServico) || 0
    const total = partsTotal + valorServico
    
    setFormData(prev => ({
      ...prev,
      valorManutencao: partsTotal.toString(),
      total: total.toString()
    }))
    
    // Reset the selected part
    setSelectedPart({
      partId: '',  // Keep as empty string, not 0
      quantidade: 1
    })
    
    setIsPartsDialogOpen(false)
  }

  const removePartFromMaintenance = (partId: string) => {
    const updatedParts = maintenanceParts.filter(p => p.partId !== partId)
    setMaintenanceParts(updatedParts)
    
    // Update the total value in the form
    const partsTotal = updatedParts.reduce((sum, part) => sum + part.subtotal, 0)
    const valorServico = parseFloat(formData.valorServico) || 0
    const total = partsTotal + valorServico
    
    setFormData(prev => ({
      ...prev,
      valorManutencao: partsTotal.toString(),
      total: total.toString()
    }))
  }

  // Function to show parts for a maintenance record
  const showMaintenanceParts = (parts: MaintenancePart[]) => {
    setSelectedMaintenanceParts(parts)
    setIsMaintenancePartsDialogOpen(true)
  }

  // Function to show description in a modal
  const showMaintenanceDescription = (description: string) => {
    setSelectedMaintenanceDescription(description)
    setIsDescriptionDialogOpen(true)
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <>
      <Button className="mb-4" onClick={handleAddMaintenance}>  
        Adicionar Manutenção
      </Button>
      
      {/* Parts Selection Dialog */}
      <Dialog open={isPartsDialogOpen} onOpenChange={setIsPartsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Selecionar Peça</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="part">Peça</Label>
              <Select 
                value={String(selectedPart.partId)}  // Use String() to handle both string and number
                onValueChange={handlePartSelection}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma peça" />
                </SelectTrigger>
                <SelectContent>
                  {parts.map((part) => (
                    <SelectItem key={part.id} value={part.id}>
                      {part.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input 
                id="quantidade"
                type="number"
                min="1"
                value={selectedPart.quantidade}
                onChange={handleQuantityChange}
              />
            </div>
            
            {selectedPart.partId && selectedPart.partId !== '' && (
              <div className="text-sm">
                <p>
                  Valor unitário: {
                    formatCurrency(parseFloat(parts.find(p => p.id === selectedPart.partId)?.valor || '0'))
                  }
                </p>
                <p className="font-medium">
                  Subtotal: {
                    formatCurrency(
                      parseFloat(parts.find(p => p.id === selectedPart.partId)?.valor || '0') * selectedPart.quantidade
                    )
                  }
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsPartsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="button" 
                onClick={addPartToMaintenance}
                disabled={!selectedPart.partId || selectedPart.partId === ''}  // More explicit check
              >
                Adicionar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Maintenance Parts List Dialog */}
      <Dialog open={isMaintenancePartsDialogOpen} onOpenChange={setIsMaintenancePartsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Peças da Manutenção</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedMaintenanceParts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Qtd</TableHead>
                    <TableHead>Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedMaintenanceParts.map((part) => (
                    <TableRow key={part.partId}>
                      <TableCell>{part.descricao}</TableCell>
                      <TableCell>{formatCurrency(part.valor)}</TableCell>
                      <TableCell>{part.quantidade}</TableCell>
                      <TableCell>{formatCurrency(part.subtotal)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhuma peça adicionada</p>
            )}
            <div className="flex justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsMaintenancePartsDialogOpen(false)}
              >
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Maintenance Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Manutenção' : 'Cadastro de Manutenção'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="text-red-500 text-sm">{errorMessage}</div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="idveiculo">Veículo</Label>
              <Select 
                value={formData.idveiculo} 
                onValueChange={handleSelectVehicle}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um veículo" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.marca}: {vehicle.placa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="datainicio">Data Início</Label>
                <Input 
                  id="datainicio" 
                  name="datainicio" 
                  type="date"
                  value={formatDateForInput(formData.datainicio)} 
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
                  value={formatDateForInput(formData.datafinal)} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valorServico">Valor do Serviço (R$)</Label>
                <Input 
                  id="valorServico" 
                  name="valorServico" 
                  type="number"
                  step="0.01"
                  value={formData.valorServico} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="space-y-2">
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
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valorManutencao">Valor das Peças (R$)</Label>
                <Input 
                  id="valorManutencao" 
                  name="valorManutencao" 
                  type="number"
                  step="0.01"
                  value={formData.valorManutencao} 
                  onChange={handleInputChange} 
                  disabled
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="total">Valor Total (R$)</Label>
                <Input 
                  id="total" 
                  name="total" 
                  type="number"
                  step="0.01"
                  value={formData.total} 
                  onChange={handleInputChange} 
                  disabled
                />
              </div>
              
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea 
                id="descricao" 
                name="descricao" 
                value={formData.descricao} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Peças</h3>
                <Button 
                  type="button" 
                  size="sm" 
                  onClick={openPartsDialog}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Peça
                </Button>
              </div>
              
              {maintenanceParts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Qtd</TableHead>
                      <TableHead>Subtotal</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {maintenanceParts.map((part) => (
                      <TableRow key={part.partId}>
                        <TableCell>{part.descricao}</TableCell>
                        <TableCell>{formatCurrency(part.valor)}</TableCell>
                        <TableCell>{part.quantidade}</TableCell>
                        <TableCell>{formatCurrency(part.subtotal)}</TableCell>
                        <TableCell>
                          <Button 
                            type="button"
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removePartFromMaintenance(part.partId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500 text-sm">Nenhuma peça adicionada</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              {isEditing && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={() => {
                    if (currentMaintenanceId) {
                      handleDeleteMaintenance(currentMaintenanceId)
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
                {isEditing ? 'Salvar' : 'Cadastrar Manutenção'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      <Table>
        <TableCaption>Lista de Manutenções</TableCaption>
        <TableHeader>
          <TableRow >
            <TableHead className="text-center">Veículo</TableHead>
            <TableHead className="text-center">Placa</TableHead>
            <TableHead className="text-center">Data Início</TableHead>
            <TableHead className="text-center">Data Final</TableHead>
            <TableHead className="text-center">Valor Manutenção</TableHead>
            <TableHead className="text-center">Valor Total</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Descrição</TableHead>
            <TableHead className="text-center">Peças</TableHead>
            <TableHead className="text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {maintenances.map((maintenance) => {
            return(
              <TableRow key={maintenance.id}>
                <TableCell className="text-center font-medium">{maintenance.veiculo}</TableCell>
                <TableCell className="text-center">{maintenance.placa}</TableCell>
                <TableCell className="text-center">{formatDate(maintenance.datainicio)}</TableCell>
                <TableCell className="text-center">{formatDate(maintenance.datafinal)}</TableCell>
                <TableCell className="text-center">{formatCurrency(maintenance.valorServico)}</TableCell>
                <TableCell className="text-center">{formatCurrency(maintenance.total)}</TableCell>
                <TableCell className="text-center">
                  <Select
                    value={maintenance.status}
                    onValueChange={(value) => updateMaintenanceStatus(maintenance.id, value)}
                  >
                    <SelectTrigger className="w-[120px] mx-auto">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Concluído">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-center">
                  {maintenance.descricao ? (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => showMaintenanceDescription(maintenance.descricao)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {maintenance.pecas && maintenance.pecas.length > 0 ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => showMaintenanceParts(maintenance.pecas)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-gray-500">Nenhuma</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditMaintenance(maintenance)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      
      {/* Description Dialog */}
      <Dialog open={isDescriptionDialogOpen} onOpenChange={setIsDescriptionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Descrição da Manutenção</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
              {/* <Textarea
                value={selectedMaintenanceDescription || 'Nenhuma descrição fornecida'} 
                disabled
                className="text-center py-3"
              /> */}
              <div className="bg-black p-4 rounded-lg text-center">
                {selectedMaintenanceDescription || 'Nenhuma descrição fornecida'}
              </div>
            <div className="flex justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDescriptionDialogOpen(false)}
              >
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}