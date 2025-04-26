import axios from 'axios';
import { useEffect, useState } from 'react';
import URI from '../utills';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

function TicketForm({ onCancel, initialData = null, fetchAllTickets }) {

  const { user } = useSelector(store => store.user);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    subject: initialData?.subject || '',
    mobile: initialData?.mobile || '',
    date: initialData?.date || '',
    time: initialData?.time || '',
    priority: initialData?.priority || '',
    department: initialData?.department || '',
    description: initialData?.description || ''
  });

  const [errors, setErrors] = useState({});

  //fetch department
  const [departments, setDepartments] = useState([]);
  const fetchDepartment = async () => {
    try {
      const res = await axios.get(`${URI}/admin/department`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        setDepartments(res?.data?.departmentes)
      }).catch(err => {
        // Handle error and show toast
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message); // For 400, 401, etc.
        } else {
          toast.error("Something went wrong");
        }
      });
    } catch (error) {
      console.log('while geting branches for super admin', error);
    }
  }

  useEffect(() => {
    fetchDepartment();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'name is required';
    }

    if (!formData?.email) {
      newErrors.email = 'email is required';
    }

    if (!formData.subject) {
      newErrors.subject = 'subject is required';
    }

    if (!formData.mobile) {
      newErrors.mobile = 'mobile is required';
    } else if (!formData.mobile.length === 10) {
      newErrors.mobile = 'mobile must be 10 characters';
    }

    if (!formData?.date) {
      newErrors.date = 'date is required';
    }

    if (!formData.time) {
      newErrors.time = 'time is required';
    }

    if (!formData.priority) {
      alert('issue');
      newErrors.priority = 'priority is required';
    }

    if (!formData.department) {
      newErrors.department = 'department is required';
    }

    if (!formData.description) {
      newErrors.description = 'description is required';
    } else if (!formData.description.length > 5) {
      newErrors.description = 'description must be at least 5 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let res;
    try {
      if (validateForm()) {

        const formdata = new FormData();
        formdata.append('name', formData?.name);
        formdata.append('email', formData?.email);
        formdata.append('subject', formData?.subject);
        formdata.append('mobile', formData?.mobile);
        formdata.append('date', formData?.date);
        formdata.append('time', formData?.time);
        formdata.append('priority', formData?.priority);
        formdata.append('department', formData?.department);
        formdata.append('description', formData?.description);
        formdata.append('issuedby', user?.username);
        formdata.append('branch', user?.branch);
        formdata.append('status', 'open')
        res = await axios.post(`${URI}/executive/raiseticket`, formdata, {
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res=>{
          setFormData({
            name: '',
            email: '',
            subject: '',
            date: '',
            mobile: '',
            time: '',
            priority: '',
            description: '',
          });
          fetchAllTickets();
          toast.success(res?.data?.message);
        }).catch(err => {
          // Handle error and show toast
          if (err.response && err.response.data && err.response.data.message) {
            toast.error(err.response.data.message); // For 400, 401, etc.
          } else {
            toast.error("Something went wrong");
          }
        });

      }
    } catch (error) {
      console.log('while raising ticket', error);
      toast?.error('error', res?.data?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='form'>
      <div className="form-group">
        <label htmlFor="name" className="form-label">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          className={`form-control ${errors.name ? 'border-error' : ''}`}
          value={formData?.name}
          onChange={handleChange}
          placeholder="Name"
        />
        {errors.name && <div className="text-error text-sm mt-1">{errors.name}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          className={`form-control ${errors.email ? 'border-error' : ''}`}
          value={formData?.email}
          onChange={handleChange}
          placeholder="Enter Email"
        />
        {errors.email && <div className="text-error text-sm mt-1">{errors?.email}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="subject" className="form-label">Subject</label>
        <input
          type="text"
          id="subject"
          name="subject"
          className={`form-control ${errors.subject ? 'border-error' : ''}`}
          value={formData?.subject}
          onChange={handleChange}
          placeholder="Subject of Ticket"
        />
        {errors.subject && <div className="text-error text-sm mt-1">{errors.subject}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="mobile" className="form-label">Mobile</label>
        <input
          type="number"
          id="mobile"
          name="mobile"
          className={`form-control ${errors?.mobile ? 'border-error' : ''}`}
          value={formData?.mobile}
          onChange={handleChange}
          placeholder="Enter Mobile Number"
        />
        {errors?.mobile && <div className="text-error text-sm mt-1">{errors.mobile}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="date" className="form-label">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          className={`form-control ${errors.date ? 'border-error' : ''}`}
          value={formData?.date}
          onChange={handleChange}
          placeholder="Date of Ticket Raising"
        />
        {errors?.date && <div className="text-error text-sm mt-1">{errors?.date}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="time" className="form-label">Time</label>
        <input
          type="time"
          id="time"
          name="time"
          className={`form-control ${errors.time ? 'border-error' : ''}`}
          value={formData?.time}
          onChange={handleChange}
          placeholder="Time of Ticket Raising"
        />
        {errors?.time && <div className="text-error text-sm mt-1">{errors?.time}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="priority" className="form-label">Priority</label>
        <select
          id="priority"
          name="priority"
          className="form-select"
          value={formData?.priority}
          onChange={handleChange}
        >
          <option disabled selected value="">--Priority--</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="department" className="form-label">Department</label>
        <select
          id="department"
          name="department"
          className="form-select"
          value={formData?.department}
          onChange={handleChange}
        >
          <option selected disabled value="">--Department--</option>
          {
            departments?.map(curElem => (
              <option value={curElem?.name}>{curElem?.name}</option>
            ))
          }
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea
          id="description"
          name="description"
          className={`form-control ${errors?.description ? 'border-error' : ''}`}
          rows="5"
          value={formData?.description}
          onChange={handleChange}
          placeholder="Detailed explanation of the issue"
        ></textarea>
        {errors?.description && <div className="text-error text-sm mt-1">{errors?.description}</div>}
      </div>
      <br />
      <div className="flex gap-2 justify-end mt-4">
        <button
          type="button"
          className="btn btn-outline"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
        >
          {initialData ? 'Update Ticket' : 'Create Ticket'}
        </button>
      </div>
    </form>
  );
}

export default TicketForm;