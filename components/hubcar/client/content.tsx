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
import { Checkbox } from "@/components/ui/checkbox"
import { Pencil, Trash2 } from "lucide-react"
import { useState } from "react"

export default function ClientContent() {

  let listClients = JSON.parse(localStorage.getItem('clients') || '[]') 
  console.log(listClients)

  const [clients, setClients] = useState(listClients)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentClientId, setCurrentClientId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    rg: '',
    email: '',
    telefone: '',
    endereco: '',
    numero: '',
    semNumero: false,
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  })

  // Format CPF: 000.000.000-00
  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    let formatted = ''
    
    for (let i = 0; i < digits.length; i++) {
      if (i === 3 || i === 6) formatted += '.'
      if (i === 9) formatted += '-'
      formatted += digits[i]
    }
    
    return formatted
  }

  // Format phone: (00) 00000-0000
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    let formatted = ''
    
    for (let i = 0; i < digits.length; i++) {
      if (i === 0) formatted += '('
      if (i === 2) formatted += ') '
      if (i === 7) formatted += '-'
      formatted += digits[i]
    }
    
    return formatted
  }


  const formatRG = (value: string) => {
    // Mantém apenas números e limita a 7 dígitos
    const digits = value.replace(/\D/g, '').slice(0, 7)
    let formatted = ''
    
    for (let i = 0; i < digits.length; i++) {
      if (i === 1 || i === 4) formatted += '.'
      formatted += digits[i]
    }
    
    return formatted
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Handle formatting for specific fields
    if (name === 'cpf') {
      setFormData(prev => ({
        ...prev,
        [name]: formatCPF(value)
      }))
    } else if (name === 'telefone') {
      setFormData(prev => ({
        ...prev,
        [name]: formatPhone(value)
      }))
    } else if (name === 'rg') {
      setFormData(prev => ({
        ...prev,
        [name]: formatRG(value)
      }))
    } else if (name === 'numero') {
      // Only allow numbers for numero field
      const numericValue = value.replace(/\D/g, '')
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

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      semNumero: checked,
      // When "Sem número" is checked, set numero to "S/N"
      numero: checked ? 'S/N' : prev.numero === 'S/N' ? '' : prev.numero
    }))
  }

  const handleAddClient = () => {
    setIsEditing(false)
    setCurrentClientId(null)
    setFormData({
      nome: '',
      cpf: '',
      rg: '',
      email: '',
      telefone: '',
      endereco: '',
      numero: '',
      semNumero: false,
      complemento: '',
      bairro: '',
      cidade: '',
      estado: ''
    })
    setIsDialogOpen(true)
  }

  const handleEditClient = (client: any) => {
    setIsEditing(true)
    setCurrentClientId(client.id)
    setFormData({
      nome: client.nome || '',
      cpf: client.cpf || '',
      rg: client.rg || '',
      email: client.email || '',
      telefone: client.telefone || '',
      endereco: client.endereco || '',
      numero: client.numero || '',
      semNumero: client.semNumero || false,
      complemento: client.complemento || '',
      bairro: client.bairro || '',
      cidade: client.cidade || '',
      estado: client.estado || ''
    })
    setIsDialogOpen(true)
  }

  const handleDeleteClient = (clientId: number) => {
    setClients((prev:any) => prev.filter((client:any) => client.id !== clientId))
    
    // Also remove from localStorage
    const storedClients = JSON.parse(localStorage.getItem('clients') || '[]')
    const updatedClients = storedClients.filter((client: any) => client.id !== clientId)
    localStorage.setItem('clients', JSON.stringify(updatedClients))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isEditing && currentClientId) {
      // Update existing client
      setClients((prev:any) => prev.map((client:any) => 
        client.id === currentClientId 
          ? {
              ...client,
              nome: formData.nome.toLocaleUpperCase(),
              email: formData.email,
              cpf: formData.cpf,
              rg: formData.rg,
              telefone: formData.telefone,
              endereco: formData.endereco,
              numero: formData.numero,
              semNumero: formData.semNumero,
              complemento: formData.complemento,
              bairro: formData.bairro,
              cidade: formData.cidade,
              estado: formData.estado
            }
          : client
      ))
      
      // Update in localStorage
      const storedClients = JSON.parse(localStorage.getItem('clients') || '[]')
      const updatedClients = storedClients.map((client: any) => 
        client.id === currentClientId 
          ? {
              ...client,
              nome: formData.nome.toLocaleUpperCase(),
              email: formData.email,
              cpf: formData.cpf,
              rg: formData.rg,
              telefone: formData.telefone,
              endereco: formData.endereco,
              numero: formData.numero,
              semNumero: formData.semNumero,
              complemento: formData.complemento,
              bairro: formData.bairro,
              cidade: formData.cidade,
              estado: formData.estado
            }
          : client
      )
      localStorage.setItem('clients', JSON.stringify(updatedClients))
    } else {
      // Add new client
      const newClient = {
        id: Date.now(),
        nome: formData.nome.toLocaleUpperCase(),
        email: formData.email,
        cpf: formData.cpf,
        rg: formData.rg,
        telefone: formData.telefone,
        endereco: formData.endereco,
        numero: formData.numero,
        semNumero: formData.semNumero,
        complemento: formData.complemento,
        bairro: formData.bairro,
        cidade: formData.cidade,
        estado: formData.estado
      }
      
      setClients((prev:any) => [...prev, newClient])
      
      // Save to localStorage
      const storedClients = JSON.parse(localStorage.getItem('clients') || '[]')
      storedClients.push({
        id: newClient.id,
        nome: formData.nome.toLocaleUpperCase(),
        email: formData.email,
        cpf: formData.cpf,
        rg: formData.rg,
        telefone: formData.telefone,
        endereco: formData.endereco,
        numero: formData.numero,
        semNumero: formData.semNumero,
        complemento: formData.complemento,
        bairro: formData.bairro,
        cidade: formData.cidade,
        estado: formData.estado
      })
      localStorage.setItem('clients', JSON.stringify(storedClients))
    }
    
    // Reset form and close dialog
    setFormData({
      nome: '',
      cpf: '',
      rg: '',
      email: '',
      telefone: '',
      endereco: '',
      numero: '',
      semNumero: false,
      complemento: '',
      bairro: '',
      cidade: '',
      estado: ''
    })
    setIsDialogOpen(false)
  }

  return (
    <>
      <Button className="mb-4" onClick={handleAddClient}>  
        Adicionar
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Cliente' : 'Cadastro de Cliente'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input 
                  id="nome" 
                  name="nome" 
                  value={formData.nome} 
                  onChange={handleInputChange} 
                  required 
                  autoComplete="off"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input 
                  id="cpf" 
                  name="cpf" 
                  value={formData.cpf} 
                  onChange={handleInputChange} 
                  placeholder="000.000.000-00"
                  maxLength={14}
                  required 
                  autoComplete="off"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rg">RG</Label>
                <Input 
                  id="rg" 
                  name="rg" 
                  value={formData.rg} 
                  onChange={handleInputChange} 
                  placeholder="0.000.000"
                  maxLength={9}
                  required 
                  autoComplete="off"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  required 
                   autoComplete="off"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input 
                  id="telefone" 
                  name="telefone" 
                  value={formData.telefone} 
                  onChange={handleInputChange} 
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                  required 
                  autoComplete="off"
                />
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-medium mb-4">Dados de Endereço</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input 
                    id="endereco" 
                    name="endereco" 
                    value={formData.endereco} 
                    onChange={handleInputChange} 
                    required 
                    autoComplete="off"
                  />
                </div>
                
                <div className="flex items-end space-x-2">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="numero">Número</Label>
                    <Input 
                      id="numero" 
                      name="numero" 
                      value={formData.numero} 
                      onChange={handleInputChange} 
                      disabled={formData.semNumero}
                      required={!formData.semNumero}
                      placeholder={formData.semNumero ? "S/N" : ""}
                      autoComplete="off"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 pb-2">
                    <Checkbox 
                      id="semNumero" 
                      checked={formData.semNumero} 
                      onCheckedChange={handleCheckboxChange} 
                    />
                    <Label htmlFor="semNumero">Sem número</Label>
                  </div>
                </div>
                
                
                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input 
                    id="bairro" 
                    name="bairro" 
                    value={formData.bairro} 
                    onChange={handleInputChange} 
                    required 
                    autoComplete="off"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input 
                    id="cidade" 
                    name="cidade" 
                    value={formData.cidade} 
                    onChange={handleInputChange} 
                    required 
                    autoComplete="off"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Input 
                    id="estado" 
                    name="estado" 
                    value={formData.estado} 
                    onChange={handleInputChange} 
                    required
                    autoComplete="off" 
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              {isEditing && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={() => {
                    if (currentClientId) {
                      handleDeleteClient(currentClientId)
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
                {isEditing ? 'Salvar' : 'Cadastrar Cliente'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      <Table>
        <TableCaption>Lista de Clientes</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((c:any) => {
            return(
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.nome}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.cpf}</TableCell>
                <TableCell>{c.telefone}</TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditClient(c)}
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