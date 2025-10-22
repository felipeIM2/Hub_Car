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

export default function PartContent() {
  let listParts = JSON.parse(localStorage.getItem('parts') || '[]')
  console.log(listParts)

  const [parts, setParts] = useState(listParts)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentPartId, setCurrentPartId] = useState<number | null>(null)
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

  const handleDeletePart = (partId: number) => {
    setParts((prev: any) => prev.filter((part: any) => part.id !== partId))
    
    // Also remove from localStorage
    const storedParts = JSON.parse(localStorage.getItem('parts') || '[]')
    const updatedParts = storedParts.filter((part: any) => part.id !== partId)
    localStorage.setItem('parts', JSON.stringify(updatedParts))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isEditing && currentPartId) {
      // Update existing part
      setParts((prev: any[]) => prev.map((part: any) => 
        part.id === currentPartId 
          ? {
              ...part,
              descricao: formData.descricao.toLocaleUpperCase(),
              valor: formData.valor,
              quantidade: formData.quantidade,
              utilizados: formData.utilizados
            }
          : part
      ))
      
      // Update in localStorage
      const storedParts = JSON.parse(localStorage.getItem('parts') || '[]')
      const updatedParts = storedParts.map((part: any) => 
        part.id === currentPartId 
          ? {
              ...part,
              descricao: formData.descricao.toLocaleUpperCase(),
              valor: formData.valor,
              quantidade: formData.quantidade,
              utilizados: formData.utilizados
            }
          : part
      )
      localStorage.setItem('parts', JSON.stringify(updatedParts))
    } else {
      // Add new part
      const newPart = {
        id: Date.now(),
        descricao: formData.descricao.toLocaleUpperCase(),
        valor: formData.valor,
        quantidade: formData.quantidade,
        utilizados: formData.utilizados
      }
      
      setParts((prev: any[]) => [...prev, newPart])
      
      // Save to localStorage
      const storedParts = JSON.parse(localStorage.getItem('parts') || '[]')
      storedParts.push(newPart)
      localStorage.setItem('parts', JSON.stringify(storedParts))
    }
    
    // Reset form and close dialog
    setFormData({
      descricao: '',
      valor: '',
      quantidade: '',
      utilizados: ''
    })
    setIsDialogOpen(false)
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