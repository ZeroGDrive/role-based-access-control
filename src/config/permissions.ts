export const ALL_PERMISSIONS = [
  // post
  'post:write',
  'post:read',

  // users
  'users:roles:write',
  'users:roles:delete',
  'post:delete',
  'post:update',

  // roles
  'roles:write',
] as const;

export const PERMISSIONS = ALL_PERMISSIONS.reduce((acc, permission) => {
  acc[permission] = permission;

  return acc;
}, {} as Record<(typeof ALL_PERMISSIONS)[number], (typeof ALL_PERMISSIONS)[number]>);

export const USER_ROLE_PERMISSIONS = [
  PERMISSIONS['post:read'],
  PERMISSIONS['post:write'],
];

export const SYSTEM_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  APPLICATION_USER: 'APPLICATION_USER',
};
