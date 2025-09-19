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
  isShowPrice: false,
}

export function useClientForm() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialog, setIsEditDialog] = useState(false)
  const [clientData, setClientData] = useState<Prisma.ClientUpdateInput>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createClient } = useCreateClient()
  const { updateClient } = useUpdateClient()

  const handleCheckboxChange = (checked: boolean) => {
    setClientData(prev => prev ? { ...prev, isShowPrice: checked } : prev);
  };

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
    setClientData({
      ...client,
      password: undefined
    })
    setIsDialogOpen(true);
  };
  
  const closeDialog = () => setIsDialogOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (clientData) {
        if (isEditDialog) {
          // For update, use ClientUpdateInput, remove properties not allowed in update
          const updateData = { ...clientData };
          delete (updateData as any).password; // password can't be updated this way
          await updateClient(updateData);
          toast.success('Client updated successfully.');
        } else {
          // For create, use ClientCreateInput, ensure required fields are present
          const createData = { ...clientData } as Prisma.ClientCreateInput;
          if (!createData.password) {
            throw new Error('Password is required for new clients');
          }
          await createClient(createData);
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
    handleCheckboxChange,
  };
}