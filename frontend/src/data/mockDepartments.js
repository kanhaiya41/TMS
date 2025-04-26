const mockDepartments = [
  {
    id: 1,
    name: 'IT',
    description: 'Information Technology department',
    branchId: 1,
    managerId: 2, // Sarah Manager
    createdAt: '2022-01-10T09:00:00Z'
  },
  {
    id: 2, 
    name: 'HR',
    description: 'Human Resources department',
    branchId: 1,
    managerId: 7, // Robert Manager
    createdAt: '2022-01-10T09:05:00Z'
  },
  {
    id: 3,
    name: 'Finance',
    description: 'Finance and Accounting department',
    branchId: 2,
    managerId: null,
    createdAt: '2022-01-12T10:30:00Z'
  },
  {
    id: 4,
    name: 'Marketing',
    description: 'Marketing and Communications department',
    branchId: 2,
    managerId: null,
    createdAt: '2022-01-12T10:35:00Z'
  },
  {
    id: 5,
    name: 'Sales',
    description: 'Sales and Business Development department',
    branchId: 3,
    managerId: null,
    createdAt: '2022-01-15T11:20:00Z'
  },
  {
    id: 6,
    name: 'Operations',
    description: 'Operations and Logistics department',
    branchId: 3,
    managerId: null,
    createdAt: '2022-01-15T11:25:00Z'
  }
];

export default mockDepartments;