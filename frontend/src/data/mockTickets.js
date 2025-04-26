const mockTickets = [
  {
    id: 1,
    title: 'Network connectivity issue',
    description: 'Unable to connect to the company VPN from my home office.',
    status: 'open',
    priority: 'high',
    department: 'IT',
    createdBy: 1, // Executive
    assignedTo: 3, // Team Leader
    createdAt: '2023-06-15T09:30:00Z',
    updatedAt: '2023-06-15T09:30:00Z',
    comments: [
      {
        id: 1,
        ticketId: 1,
        userId: 3,
        content: 'I\'ll look into this issue. Have you tried restarting your router?',
        createdAt: '2023-06-15T10:15:00Z'
      }
    ]
  },
  {
    id: 2,
    title: 'Email access problem',
    description: 'Cannot access my company email since this morning. Getting an error message.',
    status: 'in-progress',
    priority: 'medium',
    department: 'IT',
    createdBy: 1, // Executive
    assignedTo: 3, // Team Leader
    createdAt: '2023-06-14T14:20:00Z',
    updatedAt: '2023-06-14T15:45:00Z',
    comments: [
      {
        id: 2,
        ticketId: 2,
        userId: 3,
        content: 'We\'re experiencing some issues with the email server. Our team is working on it.',
        createdAt: '2023-06-14T15:00:00Z'
      },
      {
        id: 3,
        ticketId: 2,
        userId: 2,
        content: 'What error message are you seeing exactly?',
        createdAt: '2023-06-14T15:30:00Z'
      }
    ]
  },
  {
    id: 3,
    title: 'Software installation request',
    description: 'Need Adobe Photoshop installed on my workstation for the new marketing project.',
    status: 'resolved',
    priority: 'low',
    department: 'IT',
    createdBy: 6, // Executive HR
    assignedTo: 3, // Team Leader
    createdAt: '2023-06-10T11:45:00Z',
    updatedAt: '2023-06-12T16:30:00Z',
    resolvedAt: '2023-06-12T16:30:00Z',
    comments: [
      {
        id: 4,
        ticketId: 3,
        userId: 3,
        content: 'Software has been installed. Please let us know if you need any assistance using it.',
        createdAt: '2023-06-12T16:25:00Z'
      }
    ]
  },
  {
    id: 4,
    title: 'Password reset request',
    description: 'Forgot my password for the CRM system. Need it reset asap.',
    status: 'resolved',
    priority: 'high',
    department: 'IT',
    createdBy: 6, // Executive HR
    assignedTo: 8, // Team Leader HR
    createdAt: '2023-06-13T08:15:00Z',
    updatedAt: '2023-06-13T09:20:00Z',
    resolvedAt: '2023-06-13T09:20:00Z',
    comments: [
      {
        id: 5,
        ticketId: 4,
        userId: 8,
        content: 'Password has been reset. Check your email for the temporary password.',
        createdAt: '2023-06-13T09:10:00Z'
      }
    ]
  },
  {
    id: 5,
    title: 'Monitor replacement needed',
    description: 'My monitor is flickering and causing eye strain. Need a replacement.',
    status: 'in-progress',
    priority: 'medium',
    department: 'IT',
    createdBy: 1, // Executive
    assignedTo: 3, // Team Leader
    createdAt: '2023-06-12T13:40:00Z',
    updatedAt: '2023-06-13T10:30:00Z',
    comments: [
      {
        id: 6,
        ticketId: 5,
        userId: 3,
        content: 'We have ordered a new monitor for you. It should arrive by tomorrow.',
        createdAt: '2023-06-13T10:25:00Z'
      }
    ]
  },
  {
    id: 6,
    title: 'New employee onboarding',
    description: 'Need to set up accounts and equipment for new hire starting next Monday.',
    status: 'open',
    priority: 'medium',
    department: 'HR',
    createdBy: 6, // Executive HR
    assignedTo: 8, // Team Leader HR
    createdAt: '2023-06-14T11:00:00Z',
    updatedAt: '2023-06-14T11:00:00Z',
    comments: []
  },
  {
    id: 7,
    title: 'Benefits enrollment issue',
    description: 'Having trouble accessing the benefits enrollment portal. Page keeps crashing.',
    status: 'open',
    priority: 'low',
    department: 'HR',
    createdBy: 1, // Executive
    assignedTo: 8, // Team Leader HR
    createdAt: '2023-06-15T13:25:00Z',
    updatedAt: '2023-06-15T13:25:00Z',
    comments: []
  },
  {
    id: 8,
    title: 'Printer not working',
    description: 'The printer on the 2nd floor is not responding to any print jobs.',
    status: 'in-progress',
    priority: 'medium',
    department: 'IT',
    createdBy: 6, // Executive HR
    assignedTo: 3, // Team Leader IT
    createdAt: '2023-06-13T15:50:00Z',
    updatedAt: '2023-06-14T09:10:00Z',
    comments: [
      {
        id: 7,
        ticketId: 8,
        userId: 3,
        content: 'We\'ll send someone to check the printer today.',
        createdAt: '2023-06-14T09:05:00Z'
      }
    ]
  }
];

export default mockTickets;