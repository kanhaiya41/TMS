const mockPasswordRequests = [
  {
    id: 1,
    userId: 1, // Executive
    reason: 'Forgot current password',
    status: 'pending',
    createdAt: '2023-06-14T10:30:00Z',
    updatedAt: '2023-06-14T10:30:00Z',
    resolvedBy: null,
    resolvedAt: null
  },
  {
    id: 2,
    userId: 6, // Executive HR
    reason: 'Security concerns, need to update password',
    status: 'approved',
    createdAt: '2023-06-12T14:45:00Z',
    updatedAt: '2023-06-13T09:20:00Z',
    resolvedBy: 8, // Team Leader HR
    resolvedAt: '2023-06-13T09:20:00Z'
  },
  {
    id: 3,
    userId: 3, // Team Leader
    reason: 'Regular security update',
    status: 'pending',
    createdAt: '2023-06-15T11:15:00Z',
    updatedAt: '2023-06-15T11:15:00Z',
    resolvedBy: null,
    resolvedAt: null
  },
  {
    id: 4,
    userId: 2, // Manager
    reason: 'Account may be compromised',
    status: 'pending',
    createdAt: '2023-06-15T13:40:00Z',
    updatedAt: '2023-06-15T13:40:00Z',
    resolvedBy: null,
    resolvedAt: null
  },
  {
    id: 5,
    userId: 8, // Team Leader HR
    reason: 'Scheduled password rotation',
    status: 'approved',
    createdAt: '2023-06-10T15:20:00Z',
    updatedAt: '2023-06-11T10:05:00Z',
    resolvedBy: 4, // Admin
    resolvedAt: '2023-06-11T10:05:00Z'
  },
  {
    id: 6,
    userId: 4, // Admin
    reason: 'Password expired',
    status: 'pending',
    createdAt: '2023-06-14T16:35:00Z',
    updatedAt: '2023-06-14T16:35:00Z',
    resolvedBy: null,
    resolvedAt: null
  }
];

export default mockPasswordRequests;