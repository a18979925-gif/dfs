import { Role } from './supabase';

export type Permission =
  | 'project.create'
  | 'project.edit'
  | 'project.delete'
  | 'app.upload'
  | 'app.publish'
  | 'app.edit'
  | 'marketplace.buy'
  | 'marketplace.browse'
  | 'chat.send'
  | 'chat.receive'
  | 'download.apps'
  | 'preview.apps'
  | 'license.create'
  | 'license.manage'
  | 'analytics.view'
  | 'notifications.receive';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  DEVELOPER: [
    'project.create',
    'project.edit',
    'project.delete',
    'app.upload',
    'app.publish',
    'app.edit',
    'marketplace.browse',
    'chat.send',
    'chat.receive',
    'download.apps',
    'preview.apps',
    'analytics.view',
    'notifications.receive',
  ],
  BUYER: [
    'marketplace.buy',
    'marketplace.browse',
    'chat.send',
    'chat.receive',
    'download.apps',
    'preview.apps',
    'license.manage',
    'notifications.receive',
  ],
  VIEWER: [
    'marketplace.browse',
    'preview.apps',
  ],
};

export function can(role: Role | undefined, permission: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function getPermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((p) => can(role, p));
}

export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every((p) => can(role, p));
}
