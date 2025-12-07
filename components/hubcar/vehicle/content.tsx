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
import { Pencil, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"

export default function VehicleContent() {

  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch vehicles from API
  const fetchVehicles = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Use absolute URL for production environments
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const url = `${baseUrl}/api/vehicles`;
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch vehicles')
      }
      
      setVehicles(data)
    } catch (error: any) {
      console.error('Error fetching vehicles:', error)
      setError(error.message || 'Failed to fetch vehicles. Please try again later.')
      toast({
        title: "Error",
        description: error.message || "Failed to fetch vehicles. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Load vehicles on component mount
  useEffect(() => {
    fetchVehicles()
  }, [])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentVehicleId, setCurrentVehicleId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    placa: '',
    modelo: '',
    ano: '',
    kmInicial: '',
    kmAtual: '',
    marca: '',
    cor: '',
    renavam: ''
  })
  const [errorMessage, setErrorMessage] = useState('')

  // Format license plate: ABC-1234
  const formatPlate = (value: string) => {
    // Remove all non-alphanumeric characters
    const cleanValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    
    // Limit to 7 characters (3 letters + 4 numbers)
    const limitedValue = cleanValue.slice(0, 7)
    
    // Format as ABC-1234
    if (limitedValue.length > 3) {
      return limitedValue.slice(0, 3) + '-' + limitedValue.slice(3)
    }
    
    return limitedValue
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    if (name === 'placa') {
      // Apply formatting for plate field
      const formattedPlate = formatPlate(value)
      setFormData(prev => ({
        ...prev,
        [name]: formattedPlate
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
    
    // Clear error message when user starts typing
    if (errorMessage) {
      setErrorMessage('')
    }
  }

  const handleAddVehicle = () => {
    setIsEditing(false)
    setCurrentVehicleId(null)
    setFormData({
      placa: '',
      modelo: '',
      ano: '',
      kmInicial: '',
      kmAtual: '',
      marca: '',
      cor: '',
      renavam: ''
    })
    setErrorMessage('')
    setIsDialogOpen(true)
  }

  const handleEditVehicle = (vehicle: any) => {
    setIsEditing(true)
    setCurrentVehicleId(vehicle.id)
    setFormData({
      placa: vehicle.placa || '',
      modelo: vehicle.modelo || '',
      ano: vehicle.ano || '',
      kmInicial: vehicle.kmInicial || '',
      kmAtual: vehicle.kmAtual || '',
      marca: vehicle.marca || '',
      cor: vehicle.cor || '',
      renavam: vehicle.renavam || ''
    })
    setErrorMessage('')
    setIsDialogOpen(true)
  }

  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      // Use absolute URL for production environments
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const url = `${baseUrl}/api/vehicles/${vehicleId}`;
      
      const response = await fetch(url, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        // Refresh vehicle list
        fetchVehicles()
        toast({
          title: "Success",
          description: "Vehicle deleted successfully",
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete vehicle')
      }
    } catch (error: any) {
      console.error('Error deleting vehicle:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete vehicle",
        variant: "destructive",
      })
    }
  }

  const validatePlate = (plate: string, editingId: string | null = null) => {
    // Check if plate already exists (excluding the vehicle being edited)
    return !vehicles.some((vehicle: any) => 
      vehicle.placa === plate && vehicle.id !== editingId
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Format plate to uppercase and remove spaces
    const formattedPlate = formData.placa.replace(/\s/g, '').toUpperCase()
    
    // Validate plate
    if (!isEditing || (isEditing && formData.placa !== vehicles.find((v: any) => v.id === currentVehicleId)?.placa)) {
      if (!validatePlate(formattedPlate, currentVehicleId)) {
        setErrorMessage('Já existe um veículo cadastrado com esta placa!')
        return
      }
    }
    
    try {
      let response
      if (isEditing && currentVehicleId) {
        // Update existing vehicle
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        const url = `${baseUrl}/api/vehicles/${currentVehicleId}`;
        
        response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            placa: formattedPlate,
            modelo: formData.modelo,
            ano: formData.ano,
            kmInicial: formData.kmInicial,
            kmAtual: formData.kmAtual,
            marca: formData.marca,
            cor: formData.cor,
            renavam: formData.renavam
          }),
        })
      } else {
        // Add new vehicle
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        const url = `${baseUrl}/api/vehicles`;
        
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            placa: formattedPlate,
            modelo: formData.modelo,
            ano: formData.ano,
            kmInicial: formData.kmInicial,
            kmAtual: formData.kmAtual,
            marca: formData.marca,
            cor: formData.cor,
            renavam: formData.renavam
          }),
        })
      }
      
      const responseData = await response.json()
      
      if (response.ok) {
        // Refresh vehicle list
        fetchVehicles()
        
        // Reset form and close dialog
        setFormData({
          placa: '',
          modelo: '',
          ano: '',
          kmInicial: '',
          kmAtual: '',
          marca: '',
          cor: '',
          renavam: ''
        })
        setErrorMessage('')
        setIsDialogOpen(false)
        
        toast({
          title: "Success",
          description: isEditing ? "Vehicle updated successfully" : "Vehicle created successfully",
        })
      } else {
        throw new Error(responseData.message || (isEditing ? 'Failed to update vehicle' : 'Failed to create vehicle'))
      }
    } catch (error: any) {
      console.error('Error submitting form:', error)
      toast({
        title: "Error",
        description: error.message || (isEditing ? "Failed to update vehicle" : "Failed to create vehicle"),
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Button className="mb-4" onClick={handleAddVehicle}>  
        Adicionar
      </Button>
      
      {/* {loading && <div>Loading vehicles...</div>} */}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Veículo' : 'Cadastro de Veículo'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="text-red-500 text-sm">{errorMessage}</div>
            )}
            
  
            <div className="space-y-2">
              <Label htmlFor="marca">Marca</Label>
              <Input 
                id="marca" 
                name="marca" 
                value={formData.marca} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="modelo">Modelo</Label>
              <Input 
                id="modelo" 
                name="modelo" 
                value={formData.modelo} 
                onChange={handleInputChange} 
                required 
              />
            </div>

              <div className="space-y-2">
              <Label htmlFor="placa">Placa</Label>
                <Input 
                  id="placa" 
                  name="placa" 
                  value={formData.placa} 
                  onChange={handleInputChange} 
                  placeholder="ABC-1234"
                  maxLength={8}
                  required 
                  className={errorMessage ? "border-red-500" : ""}
                  autoComplete="off"
              />
              
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cor">Cor</Label>
              <Input 
                id="cor" 
                name="cor" 
                value={formData.cor} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ano">Ano</Label>
              <Input 
                id="ano" 
                name="ano" 
                value={formData.ano} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="renavam">Renavam</Label>
              <Input 
                id="renavam" 
                name="renavam" 
                value={formData.renavam} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="kmInicial">KM Inicial</Label>
              <Input 
                id="kmInicial" 
                name="kmInicial" 
                type="number"
                value={formData.kmInicial} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="kmAtual">KM Atual</Label>
              <Input 
                id="kmAtual" 
                name="kmAtual" 
                type="number"
                value={formData.kmAtual} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              {isEditing && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={() => {
                    if (currentVehicleId) {
                      handleDeleteVehicle(currentVehicleId)
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
                {isEditing ? 'Salvar' : 'Cadastrar Veículo'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      <Table>
        <TableCaption>Lista de Veículos</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Modelo</TableHead>
            <TableHead>Placa</TableHead>
            <TableHead>Ano</TableHead>
            <TableHead>KM inicial</TableHead>
            <TableHead>KM atual</TableHead>
            <TableHead>Editar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle:any) => {
            return(
              <TableRow key={vehicle.id}>
                <TableCell>{vehicle.marca}</TableCell>
                <TableCell className="font-medium">{vehicle.placa}</TableCell>
                <TableCell>{vehicle.ano}</TableCell>
                <TableCell>{vehicle.kmInicial}</TableCell>
                <TableCell>{vehicle.kmAtual}</TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditVehicle(vehicle)}
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