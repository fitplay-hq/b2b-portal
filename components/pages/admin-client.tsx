import { useState, useEffect } from "react";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  Building2,
  Mail,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import {
  MOCK_CLIENTS,
  MOCK_ORDERS,
  Client,
  PurchaseOrder,
  getStoredData,
  setStoredData,
} from "@/lib/mockData";

export default function AdminClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    status: "active" as "active" | "inactive",
  });

  useEffect(() => {
    const storedClients = getStoredData<Client[]>(
      "fitplay_clients",
      MOCK_CLIENTS
    );
    const storedOrders = getStoredData<PurchaseOrder[]>(
      "fitplay_orders",
      MOCK_ORDERS
    );
    setClients(storedClients);
    setOrders(storedOrders);
  }, []);

  useEffect(() => {
    // Filter clients
    let filtered = clients;

    if (searchTerm) {
      filtered = filtered.filter(
        (client) =>
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((client) => client.status === statusFilter);
    }

    setFilteredClients(filtered);
  }, [clients, searchTerm, statusFilter]);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      company: "",
      status: "active",
    });
    setEditingClient(null);
  };

  const openEditDialog = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      company: client.company,
      status: client.status,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingClient) {
      // Update existing client
      const updatedClients = clients.map((c) =>
        c.id === editingClient.id
          ? {
              ...c,
              name: formData.name,
              email: formData.email,
              company: formData.company,
              status: formData.status,
            }
          : c
      );
      setClients(updatedClients);
      setStoredData("fitplay_clients", updatedClients);
      toast.success("Client updated successfully");
    } else {
      // Add new client
      const newClient: Client = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        company: formData.company,
        status: formData.status,
        createdAt: new Date().toISOString().split("T")[0],
      };

      const updatedClients = [...clients, newClient];
      setClients(updatedClients);
      setStoredData("fitplay_clients", updatedClients);
      toast.success("Client added successfully");
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (clientId: string) => {
    const clientOrders = orders.filter((o) => o.clientId === clientId);

    if (clientOrders.length > 0) {
      toast.error("Cannot delete client with existing orders");
      return;
    }

    if (confirm("Are you sure you want to delete this client?")) {
      const updatedClients = clients.filter((c) => c.id !== clientId);
      setClients(updatedClients);
      setStoredData("fitplay_clients", updatedClients);
      toast.success("Client deleted successfully");
    }
  };

  const getClientStats = (clientId: string) => {
    const clientOrders = orders.filter((o) => o.clientId === clientId);
    const totalOrders = clientOrders.length;
    const totalSpent = clientOrders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = clientOrders.filter(
      (o) => o.status === "pending"
    ).length;

    return { totalOrders, totalSpent, pendingOrders };
  };

  const activeClients = clients.filter((c) => c.status === "active").length;
  const inactiveClients = clients.filter((c) => c.status === "inactive").length;
  const totalClients = clients.length;

  return (
    <Layout title="Client Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Client Management</h1>
            <p className="text-muted-foreground">
              Manage client accounts and access permissions
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingClient ? "Edit Client" : "Add New Client"}
                </DialogTitle>
                <DialogDescription>
                  {editingClient
                    ? "Update the client information below."
                    : "Fill in the details to add a new client account."}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "active" | "inactive") =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingClient ? "Update Client" : "Add Client"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Clients
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClients}</div>
              <p className="text-xs text-muted-foreground">
                Registered accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Clients
              </CardTitle>
              <Building2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeClients}</div>
              <p className="text-xs text-muted-foreground">Can place orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Inactive Clients
              </CardTitle>
              <Building2 className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inactiveClients}</div>
              <p className="text-xs text-muted-foreground">Access suspended</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search clients, companies, or emails..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Clients List */}
        <Card>
          <CardHeader>
            <CardTitle>Clients ({filteredClients.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredClients.map((client) => {
                const stats = getClientStats(client.id);

                return (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {client.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{client.name}</h3>
                          <Badge
                            className={
                              client.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {client.status.charAt(0).toUpperCase() +
                              client.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {client.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {client.company}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Joined{" "}
                            {new Date(client.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">
                            {stats.totalOrders} orders • $
                            {stats.totalSpent.toFixed(2)} spent
                          </span>
                          {stats.pendingOrders > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {stats.pendingOrders} pending
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(client)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(client.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })}

              {filteredClients.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No clients found</h3>
                  <p className="text-muted-foreground">
                    {clients.length === 0
                      ? "Add your first client to get started"
                      : "Try adjusting your search or filter criteria"}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
