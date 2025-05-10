import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import mockTickets from '../../data/mockTickets';
import mockPasswordRequests from '../../data/mockPasswordRequests';
import TicketForm from '../../components/TicketForm';
import axios from 'axios';
import URI from '../../utills';
import toast from 'react-hot-toast';

function ExecutivePanel({ user, view = 'tickets' }) {
  const [tickets, setTickets] = useState([]);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchAllTickets = async () => {
    try {
      const res = await axios.get(`${URI}/executive/getalltickets`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        setTickets(res?.data?.data?.filter((ticket) => ticket?.branch === user?.branch && (ticket?.issuedby === user?.username || ticket?.department.some((dept) => dept.name === user?.department))));
      }).catch(err => {
        // Handle error and show toast
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message); // For 400, 401, etc.
        } else {
          toast.error("Something went wrong");
        }
      });
    } catch (error) {
      console.log('while feting tickets', error);
    }
  }

  useEffect(() => {
    fetchAllTickets();
  }, []);


  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filterStatus === 'all' || ticket?.status === filterStatus;
    const matchesSearch = ticket?.subject?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      ticket?.name?.toLowerCase().includes(searchTerm?.toLowerCase())
    return matchesStatus && matchesSearch;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  //update ticket status
  const handleUpdateTicketStatus = async (ticketId, status) => {
    try {
      const res = await axios.post(`${URI}/executive/updateticketstatus`, { ticketId, status }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        fetchAllTickets();
        toast.success(res?.data?.message);
      }).catch(err => {
        // Handle error and show toast
        if (err?.response && err?.response?.data && err?.response?.data.message) {
          toast.error(err?.response?.data.message); // For 400, 401, etc.
        } else {
          toast.error("Something went wrong");
        }
      });

    } catch (error) {
      console.log('error while ticket updation', error);
    }
  }

  return (
    <div className="animate-fade">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">My Tickets</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowTicketForm(true)}
        >
          Create New Ticket
        </button>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="grid grid-2 gap-3">
            <div className="form-group">
              <label htmlFor="status-filter" className="form-label">Filter by Status</label>
              <select
                id="status-filter"
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="search" className="form-label">Search Tickets</label>
              <input
                type="text"
                id="search"
                className="form-control"
                placeholder="Search by title or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {showTicketForm ? (
        <div className="card mb-4 animate-slide-up">
          <div className="card-header">
            <h3>Create New Ticket</h3>
          </div>
          <div className="card-body">
            <TicketForm
              fetchAllTickets={fetchAllTickets}
              onCancel={() => setShowTicketForm(false)}
            />
          </div>
        </div>
      ) : (
        <>

          <div className="card">
            <div className="card-body p-0">
              {filteredTickets?.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>

                        <th>Name</th>
                        <th>Subject</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTickets?.map((ticket, index) => (
                        ticket?.issuedby === user?.username &&
                        <tr key={ticket?.id}>

                          <td>{ticket?.name}</td>

                          {/* <span className={`badge ${ticket?.status === 'open' ? 'badge-warning' :
                            ticket?.status === 'in-progress' ? 'badge-primary' :
                              'badge-success'
                            }`}>
                            {ticket?.status === 'in-progress' ? 'In Progress' :
                              ticket?.status?.charAt(0).toUpperCase() + ticket?.status?.slice(1)}
                          </span> */}

                          <td>
                            {ticket?.subject}
                            {/* <span className={`badge ${ticket?.priority === 'high' ? 'badge-error' :
                            ticket?.priority === 'medium' ? 'badge-warning' :
                              'badge-primary'
                            }`}>
                            {ticket?.priority?.charAt(0).toUpperCase() + ticket?.priority?.slice(1)}
                          </span> */}
                          </td>
                          {/* <td>{formatDate(ticket?.createdAt)}</td> */}
                          <td>
                            <button
                              className="btn btn-sm btn-outline"
                              onClick={() => handleViewTicket(ticket)}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-muted">No tickets found. Create a new ticket to get started!</p>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold">Tickets on Your Department</h2>
            <div className="card-body p-0">
              {filteredTickets?.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Subject</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTickets?.map((ticket, index) => (
                        <tr key={ticket?.id}>
                          <td>#{index + 1}</td>
                          <td>{ticket?.name}</td>

                          <td>
                            <span className={`badge ${ticket?.status === 'open' ? 'badge-warning' :
                              ticket?.status === 'in-progress' ? 'badge-primary' :
                                'badge-success'
                              }`}>
                              {ticket?.status === 'in-progress' ? 'In Progress' :
                                ticket?.status?.charAt(0).toUpperCase() + ticket?.status?.slice(1)}
                            </span>
                          </td>
                          <td>
                            {ticket?.subject}
                            {/* <span className={`badge ${ticket?.priority === 'high' ? 'badge-error' :
                            ticket?.priority === 'medium' ? 'badge-warning' :
                              'badge-primary'
                            }`}>
                            {ticket?.priority?.charAt(0).toUpperCase() + ticket?.priority?.slice(1)}
                          </span> */}
                          </td>
                          {/* <td>{formatDate(ticket?.createdAt)}</td> */}
                          <td ><div className='flex gap-2'>
                            {ticket.status !== 'resolved' && (
                              <>
                                {ticket.status === 'open' && (
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handleUpdateTicketStatus(ticket._id, 'in-progress')}
                                  >
                                    Start
                                  </button>
                                )}
                                {ticket.status === 'in-progress' && (
                                  <button
                                    className="btn btn-sm btn-success"
                                    onClick={() => handleUpdateTicketStatus(ticket._id, 'resolved')}
                                  >
                                    Resolve
                                  </button>
                                )}
                              </>
                            )}
                            <button
                              className="btn btn-sm btn-outline"
                              onClick={() => handleViewTicket(ticket)}
                            >
                              View
                            </button>
                          </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-muted">No tickets found. Create a new ticket to get started!</p>
                </div>
              )}
            </div>
          </div>

        </>
      )}

      {/* Ticket Detail Modal */}
      {isModalOpen && selectedTicket && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="modal">
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title">Ticket #{selectedTicket?.id}</h3>
                  <button className="modal-close" onClick={handleCloseModal}>×</button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <h4 className="font-bold">{selectedTicket?.subject}</h4>
                    <div className="flex gap-2 mb-2">
                      <span className={`badge ${selectedTicket?.status === 'open' ? 'badge-warning' :
                        selectedTicket?.status === 'in-progress' ? 'badge-primary' :
                          'badge-success'
                        }`}>
                        {selectedTicket?.status === 'in-progress' ? 'In Progress' :
                          selectedTicket?.status?.charAt(0).toUpperCase() + selectedTicket?.status?.slice(1)}
                      </span>
                      <span className={`badge ${selectedTicket?.priority === 'high' ? 'badge-error' :
                        selectedTicket?.priority === 'medium' ? 'badge-warning' :
                          'badge-primary'
                        }`}>
                        {selectedTicket?.priority?.charAt(0).toUpperCase() + selectedTicket?.priority?.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-muted">
                      Created: {formatDate(selectedTicket?.createdAt)}
                    </p>
                  </div>
                  {
                    selectedTicket?.department?.map(curElem => (
                      <div className="mb-4">
                        <h5 className="font-bold mb-2">{curElem?.name}</h5>
                        <p>{curElem?.description}</p>
                      </div>
                    ))
                  }


                  <div className="mb-4">
                    <h5 className="font-bold mb-2">Comments ({selectedTicket?.comments?.length})</h5>
                    {selectedTicket?.comments?.length > 0 ? (
                      <div className="space-y-3">
                        {selectedTicket?.comments?.map(comment => (
                          <div key={comment?.id} className="p-2 bg-gray-100 rounded">
                            <p className="text-sm">{comment?.content}</p>
                            <p className="text-xs text-muted mt-1">
                              {formatDate(comment?.createdAt)}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted">No comments yet.</p>
                    )}
                  </div>

                  {/* <div className="form-group">
                    <label htmlFor="comment" className="form-label">Add Comment</label>
                    <textarea
                      id="comment"
                      className="form-control"
                      rows="3"
                      placeholder="Add your comment..."
                    ></textarea>
                  </div> */}
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-outline"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                  {/* <button className="btn btn-primary">
                    Add Comment
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExecutivePanel;