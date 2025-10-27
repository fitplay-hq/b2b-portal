import useSWR from 'swr';
import { mutate } from 'swr';

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then((res) => {
  if (!res.ok) {
    throw new Error('Failed to fetch');
  }
  return res.json();
});

// Roles hooks
export function useRoles() {
  const { data, error, isLoading } = useSWR('/api/admin/roles', fetcher);
  
  return {
    roles: data?.roles || [],
    isLoading,
    error
  };
}

export function useRole(id: string) {
  const { data, error, isLoading } = useSWR(
    id ? `/api/admin/roles/${id}` : null,
    fetcher
  );
  
  return {
    role: data?.role,
    isLoading,
    error
  };
}

export function useCreateRole() {
  const createRole = async (roleData: {
    name: string;
    description?: string;
    permissionIds: string[];
  }) => {
    const response = await fetch('/api/admin/roles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(roleData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create role');
    }

    const result = await response.json();
    
    // Revalidate the roles list
    mutate('/api/admin/roles');
    
    return result;
  };

  return { createRole };
}

export function useUpdateRole() {
  const updateRole = async (id: string, roleData: {
    name?: string;
    description?: string;
    permissionIds?: string[];
    isActive?: boolean;
  }) => {
    const response = await fetch(`/api/admin/roles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(roleData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update role');
    }

    const result = await response.json();
    
    // Revalidate the roles list and individual role
    mutate('/api/admin/roles');
    mutate(`/api/admin/roles/${id}`);
    
    return result;
  };

  return { updateRole };
}

export function useDeleteRole() {
  const deleteRole = async (id: string) => {
    const response = await fetch(`/api/admin/roles/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete role');
    }

    const result = await response.json();
    
    // Revalidate the roles list
    mutate('/api/admin/roles');
    
    return result;
  };

  return { deleteRole };
}

// Permissions hooks
export function usePermissions() {
  const { data, error, isLoading } = useSWR('/api/admin/permissions', fetcher);
  
  return {
    permissions: data?.permissions || [],
    groupedPermissions: data?.groupedPermissions || {},
    isLoading,
    error
  };
}

// System Users hooks
export function useSystemUsers() {
  const { data, error, isLoading } = useSWR('/api/admin/system-users', fetcher);
  
  return {
    users: data?.users || [],
    isLoading,
    error
  };
}

export function useSystemUser(id: string) {
  const { data, error, isLoading } = useSWR(
    id ? `/api/admin/system-users/${id}` : null,
    fetcher
  );
  
  return {
    user: data?.user,
    isLoading,
    error
  };
}

export function useCreateSystemUser() {
  const createUser = async (userData: {
    name: string;
    email: string;
    password: string;
    roleId: string;
  }) => {
    const response = await fetch('/api/admin/system-users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create user');
    }

    const result = await response.json();
    
    // Revalidate the users list
    mutate('/api/admin/system-users');
    
    return result;
  };

  return { createUser };
}

export function useUpdateSystemUser() {
  const updateUser = async (id: string, userData: {
    name?: string;
    email?: string;
    password?: string;
    roleId?: string;
    isActive?: boolean;
  }) => {
    const response = await fetch(`/api/admin/system-users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update user');
    }

    const result = await response.json();
    
    // Revalidate the users list and individual user
    mutate('/api/admin/system-users');
    mutate(`/api/admin/system-users/${id}`);
    
    return result;
  };

  return { updateUser };
}

export function useDeleteSystemUser() {
  const deleteUser = async (id: string) => {
    const response = await fetch(`/api/admin/system-users/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete user');
    }

    const result = await response.json();
    
    // Revalidate the users list
    mutate('/api/admin/system-users');
    
    return result;
  };

  return { deleteUser };
}