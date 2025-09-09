import { useState } from 'react';
import { toast } from 'sonner';
import { Client, Prisma } from '@/lib/generated/prisma';
import { useCreateClient, useUpdateClient } from '@/data/client/admin.hooks';

const initialData: Prisma.ClientUpdateInput = {
  address: "",
  companyName: "",
  email: "",
  name: "",
  phone: "",
}

export function useClientForm() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialog, setIsEditDialog] = useState(false)
  const [clientData, setClientData] = useState<Prisma.ClientUpdateInput>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createClient } = useCreateClient()
  const { updateClient } = useUpdateClient()

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setClientData(prev => prev ? { ...prev, [id]: value } : prev);
  };

  const openNewDialog = () => {
    setIsEditDialog(false)
    setClientData(initialData)
    setIsDialogOpen(true);
  };

  const openEditDialog = (client: Client) => {
    setIsEditDialog(true)
    setClientData(client)
    setIsDialogOpen(true);
  };
  
  const closeDialog = () => setIsDialogOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (clientData) {
        if (isEditDialog) {
          console.log(clientData)
          await updateClient(clientData);
          toast.success('Client updated successfully.');
        } else {
          await createClient(clientData);
          toast.success('Client added successfully.');
        }
      }
      closeDialog();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isDialogOpen,
    isEditDialog,
    isSubmitting,
    clientData,
    openNewDialog,
    openEditDialog,
    closeDialog,
    handleSubmit,
    handleFieldChange,
  };
}