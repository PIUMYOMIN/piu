// src/hooks/usePermissions.js
import { useState, useEffect } from "react";
import roleApi from "../api/roleApi";
import permissionApi from "../api/permissionApi";
import { toast } from "react-toastify";

export const usePermissions = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [rolesRes, permissionsRes] = await Promise.all([
        roleApi.getAll(),
        permissionApi.getAll()
      ]);
      
      setRoles(rolesRes.data.data || rolesRes.data);
      setPermissions(permissionsRes.data);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to fetch data";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createRole = async (roleData) => {
    try {
      const response = await roleApi.create(roleData);
      toast.success("Role created successfully!");
      await fetchData(); // Refresh data
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to create role";
      toast.error(errorMsg);
      throw err;
    }
  };

  const updateRole = async (id, roleData) => {
    try {
      const response = await roleApi.update(id, roleData);
      toast.success("Role updated successfully!");
      await fetchData(); // Refresh data
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update role";
      toast.error(errorMsg);
      throw err;
    }
  };

  const deleteRole = async (id) => {
    try {
      await roleApi.delete(id);
      toast.success("Role deleted successfully!");
      await fetchData(); // Refresh data
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to delete role";
      toast.error(errorMsg);
      throw err;
    }
  };

  const createPermission = async (permissionData) => {
    try {
      const response = await permissionApi.create(permissionData);
      toast.success("Permission created successfully!");
      await fetchData(); // Refresh data
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to create permission";
      toast.error(errorMsg);
      throw err;
    }
  };

  const updatePermission = async (id, permissionData) => {
    try {
      const response = await permissionApi.update(id, permissionData);
      toast.success("Permission updated successfully!");
      await fetchData(); // Refresh data
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update permission";
      toast.error(errorMsg);
      throw err;
    }
  };

  const deletePermission = async (id) => {
    try {
      await permissionApi.delete(id);
      toast.success("Permission deleted successfully!");
      await fetchData(); // Refresh data
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to delete permission";
      toast.error(errorMsg);
      throw err;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    roles,
    permissions,
    loading,
    error,
    fetchData,
    createRole,
    updateRole,
    deleteRole,
    createPermission,
    updatePermission,
    deletePermission
  };
};