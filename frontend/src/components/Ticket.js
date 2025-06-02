import React from 'react';
import './TicketCard.css';

const TicketCard = ({ ticket }) => {
  return (
    <table className="table m-0">
      <tbody>
        <tr>
          <td><strong>Ticket ID:</strong></td>
          <td>{ticket.ticketId}</td>
          <td><strong>Title:</strong></td>
          <td>{ticket.title}</td>
        </tr>
        <tr>
          <td><strong>Branch:</strong></td>
          <td>{ticket.branch}</td>
          <td><strong>Created At:</strong></td>
          <td>{new Date(ticket.createdAt).toLocaleString()}</td>
        </tr>
        <tr>
          <td><strong>Assigned To:</strong></td>
          <td>{ticket.assignedTo}</td>
          <td><strong>Status:</strong></td>
          <td>{ticket.status}</td>
        </tr>
        <tr>
          <td><strong>Priority:</strong></td>
          <td>{ticket.priority}</td>
          <td><strong>TAT:</strong></td>
          <td>{ticket.tat}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default TicketCard;
