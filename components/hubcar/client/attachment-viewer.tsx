'use client'

import { useState, useEffect } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, File, Image, X } from "lucide-react"

interface Attachment {
  id: string
  filename: string
  mimeType: string
  createdAt: string
}

interface AttachmentViewerProps {
  clientId: string
  isOpen: boolean
  onClose: () => void
}

export default function AttachmentViewer({ clientId, isOpen, onClose }: AttachmentViewerProps) {
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null)

  useEffect(() => {
    if (isOpen && clientId) {
      fetchAttachments()
    }
  }, [isOpen, clientId])

  const fetchAttachments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/attachments/by-client/${clientId}`)
      const data = await response.json()
      
      if (response.ok) {
        setAttachments(data)
      } else {
        console.error('Failed to fetch attachments:', data.error)
      }
    } catch (error) {
      console.error('Error fetching attachments:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadAttachment = async (attachmentId: string, filename: string) => {
    try {
      const response = await fetch(`/api/attachments/${attachmentId}/download`)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      } else {
        console.error('Failed to download attachment')
      }
    } catch (error) {
      console.error('Error downloading attachment:', error)
    }
  }

  const viewAttachment = async (attachmentId: string) => {
    try {
      const response = await fetch(`/api/attachments/${attachmentId}/view`)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        window.open(url, '_blank')
        window.URL.revokeObjectURL(url)
      } else {
        console.error('Failed to view attachment')
      }
    } catch (error) {
      console.error('Error viewing attachment:', error)
    }
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <Image className="h-8 w-8 text-blue-500" />
    }
    return <File className="h-8 w-8 text-gray-500" />
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Anexos do Cliente</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="py-4">
            {attachments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum anexo encontrado para este cliente.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {attachments.map((attachment) => (
                  <div 
                    key={attachment.id} 
                    className="border rounded-lg p-4 flex flex-col items-center transition-colors"
                  >
                    <div className="mb-2">
                      {getFileIcon(attachment.mimeType)}
                    </div>
                    <h3 className="font-medium text-center truncate w-full px-2">
                      {attachment.filename}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(attachment.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex space-x-2 mt-3">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => viewAttachment(attachment.id)}
                      >
                        Visualizar
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => downloadAttachment(attachment.id, attachment.filename)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Baixar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}