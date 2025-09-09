import { useState } from 'react';
import { toast } from 'sonner';
import { Client } from '@/lib/mockData';
import { useCreateClient, useUpdateClient } from '@/data/client/admin.hooks';

const initialFormData = {
    company: "",
    email: "",
    name: "",
}

export function useClientForm() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialFormData)

  const { createClient } = useCreateClient()
  const { updateClient } = useUpdateClient()

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const openNewDialog = () => {
    setEditingClient(null);
    setFormData(initialFormData);
    setIsDialogOpen(true);
  };

  const openEditDialog = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      company: client.company,
    });
    setIsDialogOpen(true);
  };
  
  const closeDialog = () => setIsDialogOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingClient) {
        await updateClient({
          id: editingClient.id,
          name: formData.name,
          email: formData.email,
          companyName: formData.company,
        });
        toast.success('Client updated successfully.');
      } else {
        await createClient({
          name: formData.name,
          email: formData.email,
          companyName: formData.company,
        });
        toast.success('Client added successfully.');
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
    editingClient,
    isSubmitting,
    formData,
    openNewDialog,
    openEditDialog,
    closeDialog,
    handleSubmit,
    handleFieldChange,
  };
}