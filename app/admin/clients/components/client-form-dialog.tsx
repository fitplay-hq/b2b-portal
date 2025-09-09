import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClientForm } from "@/hooks/use-client-form";

// Use the return type of the hook for clean and strongly-typed props
type ClientFormDialogProps = ReturnType<typeof useClientForm>;

export function ClientFormDialog({
  isDialogOpen,
  editingClient,
  isSubmitting,
  formData,
  closeDialog,
  handleSubmit,
  handleFieldChange,
}: ClientFormDialogProps) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingClient ? "Edit Client" : "Add New Client"}
          </DialogTitle>
          <DialogDescription>
            {editingClient
              ? "Update the client information below."
              : "Fill in the details for the new client account."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleFieldChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleFieldChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={handleFieldChange}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : editingClient
                ? "Update Client"
                : "Add Client"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
