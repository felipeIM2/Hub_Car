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

export default function PartContent() {
  const [parts, setParts] = useState<any[]>([])

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

  // Load parts on component mount
  useEffect(() => {
    fetchParts()
  }, [])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentPartId, setCurrentPartId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    quantidade: '',
    utilizados: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Only allow numbers for valor, quantidade, and utilizados fields
    if (name === 'valor' || name === 'quantidade' || name === 'utilizados') {
      const numericValue = value.replace(/[^0-9.]/g, '')
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleAddPart = () => {
    setIsEditing(false)
    setCurrentPartId(null)
    setFormData({
      descricao: '',
      valor: '',
      quantidade: '',
      utilizados: ''
    })
    setIsDialogOpen(true)
  }

  const handleEditPart = (part: any) => {
    setIsEditing(true)
    setCurrentPartId(part.id)
    setFormData({
      descricao: part.descricao || '',
      valor: part.valor || '',
      quantidade: part.quantidade || '',
      utilizados: part.utilizados || ''
    })
    setIsDialogOpen(true)
  }

  const handleDeletePart = async (partId: string) => {
    try {
      const response = await fetch(`/api/parts/${partId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        // Refresh parts list
        fetchParts()
      } else {
        console.error('Failed to delete part')
      }
    } catch (error) {
      console.error('Error deleting part:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (isEditing && currentPartId) {
        // Update existing part
        const response = await fetch(`/api/parts/${currentPartId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            descricao: formData.descricao.toLocaleUpperCase(),
            valor: parseFloat(formData.valor),
            quantidade: parseInt(formData.quantidade),
            utilizados: parseInt(formData.utilizados)
          }),
        })
        
        if (response.ok) {
          // Refresh parts list
          fetchParts()
        } else {
          console.error('Failed to update part')
        }
      } else {
        // Add new part
        const response = await fetch('/api/parts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            descricao: formData.descricao.toLocaleUpperCase(),
            valor: parseFloat(formData.valor),
            quantidade: parseInt(formData.quantidade),
            utilizados: parseInt(formData.utilizados)
          }),
        })
        
        if (response.ok) {
          // Refresh parts list
          fetchParts()
        } else {
          console.error('Failed to create part')
        }
      }
      
      // Reset form and close dialog
      setFormData({
        descricao: '',
        valor: '',
        quantidade: '',
        utilizados: ''
      })
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <>
      <Button className="mb-4" onClick={handleAddPart}>  
        Adicionar
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Peça' : 'Cadastro de Peça'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input 
                  id="descricao" 
                  name="descricao" 
                  value={formData.descricao} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valor">Valor (R$)</Label>
                <Input 
                  id="valor" 
                  name="valor" 
                  value={formData.valor} 
                  onChange={handleInputChange} 
                  placeholder="0.00"
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade</Label>
                <Input 
                  id="quantidade" 
                  name="quantidade" 
                  value={formData.quantidade} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="utilizados">Utilizados</Label>
                <Input 
                  id="utilizados" 
                  name="utilizados" 
                  value={formData.utilizados} 
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
                    if (currentPartId) {
                      handleDeletePart(currentPartId)
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
                {isEditing ? 'Salvar' : 'Cadastrar Peça'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      <Table>
        <TableCaption>Lista de Peças</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Utilizados</TableHead>
            <TableHead>Editar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {parts.map((p: any) => {
            return(
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.descricao}</TableCell>
                <TableCell>R$ {parseFloat(p.valor).toFixed(2)}</TableCell>
                <TableCell>{p.quantidade}</TableCell>
                <TableCell>{p.utilizados}</TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditPart(p)}
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