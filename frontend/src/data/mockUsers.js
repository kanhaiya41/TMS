const mockUsers = [
  {
    id: 1,
    name: 'John Executive',
    email: 'executive@example.com',
    password: 'password',
    role: 'executive',
    department: 'IT',
    avatar: 'JE',
    createdAt: '2023-01-15T09:00:00Z',
    managerId: 2
  },
  {
    id: 2,
    name: 'Sarah Manager',
    email: 'manager@example.com',
    password: 'password',
    role: 'manager',
    department: 'IT',
    avatar: 'SM',
    createdAt: '2022-11-05T14:30:00Z',
    teamLeaderId: 3
  },
  {
    id: 3,
    name: 'Mike Team Leader',
    email: 'teamleader@example.com',
    password: 'password',
    role: 'teamleader',
    department: 'IT',
    avatar: 'MT',
    createdAt: '2022-08-12T10:15:00Z',
    adminId: 4
  },
  {
    id: 4,
    name: 'Lisa Admin',
    email: 'admin@example.com',
    password: 'password',
    role: 'admin',
    department: 'IT',
    branchId: 1,
    avatar: 'LA',
    createdAt: '2022-05-20T16:45:00Z',
    superAdminId: 5
  },
  {
    id: 5,
    name: 'David Super Admin',
    email: 'superadmin@example.com',
    password: 'password',
    role: 'superadmin',
    avatar: 'DS',
    createdAt: '2022-03-10T11:30:00Z'
  },
  {
    id: 6,
    name: 'Emily Executive',
    email: 'emily@example.com',
    password: 'password',
    role: 'executive',
    department: 'HR',
    avatar: 'EE',
    createdAt: '2023-02-18T13:20:00Z',
    managerId: 7
  },
  {
    id: 7,
    name: 'Robert Manager',
    email: 'robert@example.com',
    password: 'password',
    role: 'manager',
    department: 'HR',
    avatar: 'RM',
    createdAt: '2022-10-08T09:45:00Z',
    teamLeaderId: 8
  },
  {
    id: 8,
    name: 'Jennifer Team Leader',
    email: 'jennifer@example.com',
    password: 'password',
    role: 'teamleader',
    department: 'HR',
    avatar: 'JT',
    createdAt: '2022-07-14T15:10:00Z',
    adminId: 4
  }
];

export default mockUsers;