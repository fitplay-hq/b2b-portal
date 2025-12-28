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
import { Loader2 } from "lucide-react";

// Use the return type of the hook for clean and strongly-typed props
type ClientFormDialogProps = ReturnType<typeof useClientForm>;

export function ClientFormDialog({
  isDialogOpen,
  clientData,
  isSubmitting,
  isEditDialog,
  closeDialog,
  handleSubmit,
  handleFieldChange,
}: ClientFormDialogProps) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditDialog ? "Edit Client" : "Add New Client"}
          </DialogTitle>
          <DialogDescription>
            {isEditDialog
              ? "Update the client information below."
              : "Fill in the details for the new client account."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={clientData?.name}
              onChange={handleFieldChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={clientData?.email}
              onChange={handleFieldChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <Input
              id="companyName"
              value={clientData?.companyName}
              onChange={handleFieldChange}
              required
            />
          </div>

          {!isEditDialog && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={clientData?.password}
                onChange={handleFieldChange}
                required
                placeholder=""
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={clientData?.phone}
              onChange={handleFieldChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={clientData?.address}
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
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </div>
              ) : (
                isEditDialog ? "Update Client" : "Add Client"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
