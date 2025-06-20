import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@/components/sidebar/app-sidebar';

export const AdminLayout = () => {
  return (
    <AppSidebar>
      <Outlet />
    </AppSidebar>
  );
}; 