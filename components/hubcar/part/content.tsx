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



export default function ClientContent() {


 let parts = [
    {
      descricao:"óleo",
      valor:"100",
      quantidade:"20",
      utilizados:"10",
    },
        {
      descricao:"teste",
      valor:"100",
      quantidade:"20",
      utilizados:"10",
    },
        {
      descricao:"teste2",
      valor:"100",
      quantidade:"20",
      utilizados:"10",
    },

  ]
 

  return (
    <>
    <Button className="mb-4">  
      Adicionar
    </Button>
      <Table>
        <TableCaption>Lista de Peças</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Descriçãp</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Utilizados</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        {parts.map(p =>{
            return(
              <TableRow key={p.descricao}>
                <TableCell className="font-medium">{p.descricao}</TableCell>
                <TableCell>{p.valor}</TableCell>
                <TableCell>{p.quantidade}</TableCell>
                <TableCell>{p.utilizados}</TableCell>
                <TableCell>Edit</TableCell>
            </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}