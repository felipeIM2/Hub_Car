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
import { useState } from "react"

export default function VehicleContent() {

  let vehicleList = JSON.parse(localStorage.getItem('vehicles') || '[]')

  const [vehicles, setVehicles] = useState(vehicleList)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentVehicleId, setCurrentVehicleId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    placa: '',
    modelo: '',
    ano: '',
    kmInicial: '',
    kmAtual: '',
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
    })
    setErrorMessage('')
    setIsDialogOpen(true)
  }

  const handleDeleteVehicle = (vehicleId: number) => {
    setVehicles((prev:any) => prev.filter((vehicle: any) => vehicle.id !== vehicleId))
    
    // Also remove from localStorage
    const storedVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]')
    const updatedVehicles = storedVehicles.filter((vehicle: any) => vehicle.id !== vehicleId)
    localStorage.setItem('vehicles', JSON.stringify(updatedVehicles))
  }

  const validatePlate = (plate: string, editingId: number | null = null) => {
    // Check if plate already exists (excluding the vehicle being edited)
    return !vehicles.some((vehicle: any) => 
      vehicle.placa === plate && vehicle.id !== editingId
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate plate format (should be in format ABC-1234)
    const plateRegex = /^[A-Z]{3}-\d{4}$/
    if (!plateRegex.test(formData.placa)) {
      setErrorMessage('Formato de placa inválido! Use o formato ABC-1234')
      return
    }
    
    // Validate plate uniqueness
    if (!isEditing || (isEditing && formData.placa !== vehicles.find((v:any) => v.id === currentVehicleId)?.placa)) {
      if (!validatePlate(formData.placa, currentVehicleId)) {
        setErrorMessage('Já existe um veículo cadastrado com esta placa!')
        return
      }
    }
    
    if (isEditing && currentVehicleId) {
      // Update existing vehicle
      setVehicles((prev:any) => prev.map((vehicle:any) => 
        vehicle.id === currentVehicleId 
          ? {
              ...vehicle,
              placa: formData.placa,
              modelo: formData.modelo.toLocaleUpperCase(),
              ano: formData.ano,
              kmInicial: formData.kmInicial,
              kmAtual: formData.kmAtual,
            }
          : vehicle
      ))
      
      // Update in localStorage
      const storedVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]')
      const updatedVehicles = storedVehicles.map((vehicle: any) => 
        vehicle.id === currentVehicleId 
          ? {
              ...vehicle,
              placa: formData.placa,
              modelo: formData.modelo.toLocaleUpperCase(),
              ano: formData.ano,
              kmInicial: formData.kmInicial,
              kmAtual: formData.kmAtual,
            }
          : vehicle
      )
      localStorage.setItem('vehicles', JSON.stringify(updatedVehicles))
    } else {
      // Add new vehicle
      const newVehicle = {
        id: Date.now(),
        placa: formData.placa,
        modelo: formData.modelo.toLocaleUpperCase(),
        ano: formData.ano,
        kmInicial: formData.kmInicial,
        kmAtual: formData.kmAtual,
      }
      
      setVehicles((prev:any) => [...prev, newVehicle])
      
      // Save to localStorage
      const storedVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]')
      storedVehicles.push(newVehicle)
      localStorage.setItem('vehicles', JSON.stringify(storedVehicles))
    }
    
    // Reset form and close dialog
    setFormData({
      placa: '',
      modelo: '',
      ano: '',
      kmInicial: '',
      kmAtual: '',
    })
    setErrorMessage('')
    setIsDialogOpen(false)
  }

  return (
    <>
      <Button className="mb-4" onClick={handleAddVehicle}>  
        Adicionar
      </Button>
      
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
              <Label htmlFor="modelo">Modelo</Label>
              <Input 
                id="modelo" 
                name="modelo" 
                value={formData.modelo} 
                onChange={handleInputChange} 
                required
                autoComplete="off" 
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
                type="number"
                autoComplete="off"
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
                autoComplete="off"
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
                autoComplete="off"
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
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle:any) => {
            return(
              <TableRow key={vehicle.id}>
                <TableCell>{vehicle.modelo}</TableCell>
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