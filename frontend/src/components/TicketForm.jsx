import axios from 'axios';
import { useEffect, useState } from 'react';
import URI from '../utills';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import SessionEndWarning from './SessionEndWarning';

function TicketForm({ onCancel, initialData = null, fetchAllTickets }) {

  const { user } = useSelector(store => store.user);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    // email: initialData?.email || '',
    subject: initialData?.subject || '',
    mobile: initialData?.mobile || '',
    // date: initialData?.date || '',
    // time: initialData?.time || '',
    priority: initialData?.priority || ''
  });

  const [formDepartment, setFormDepartment] = useState(initialData?.department || [])
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [executives, setExecutives] = useState({});
  const [ticketSettings, setTicketSettings] = useState({});
  const [sessionWarning, setSessionWarning] = useState(false);

  const handleCheckboxChange = async (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      const selectedDept = departments.find(dep => dep.name === value);
      setSelectedDepartment(prev => [...prev, value]);
      setFormDepartment(prev => [...prev, { name: value, description: '', users: [] }]);

      try {
        const res = await axios.get(`${URI}/admin/executives`);
        const filtered = res?.data?.allBranchesData?.filter(exec =>
          exec?.branch === user?.branch && exec?.department === selectedDept.name
        );
        setExecutives(prev => ({ ...prev, [selectedDept.name]: filtered }));
      } catch (err) {
        toast.error(err?.response?.data?.message || "Something went wrong");
      }
    } else {
      setSelectedDepartment(prev => prev.filter((val) => val !== value));
      setFormDepartment(prev => prev.filter((dep) => dep.name !== value));
    }
  };


  const handleDepartmentChange = (e, index) => {
    const { value } = e.target;
    setFormDepartment(prev => {
      const updated = [...prev];
      updated[index].description = value;
      return updated;
    });
  };

  const handleUserSelection = (e, index) => {
    const { value, checked } = e.target;

    setFormDepartment(prev => {
      const updated = [...prev];
      const selectedUsers = updated[index].users || [];

      if (checked) {
        // Add user
        updated[index].users = [...selectedUsers, value];
      } else {
        // Remove user
        updated[index].users = selectedUsers.filter(u => u !== value);
      }

      return updated;
    });
  };



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

  const fetchTicketSettings = async () => {
    try {
      const res = await axios.get(`${URI}/admin/getticketsettings/${user?.branch}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(r => {
        setTicketSettings(r?.data?.ticketSettings);
      }).catch(err => {
        // Handle error and show toast
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message); // For 400, 401, etc.
        } else {
          toast.error("Something went wrong");
        }
      });
    } catch (error) {
      console.log('while fetching Ticket Settings', error);
    }
  }


  useEffect(() => {
    fetchDepartment();
    fetchTicketSettings();
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
      toast.error('name is required');
    }

    // if (!formData?.email) {
    //   newErrors.email = 'email is required';
    //   toast.error('email is required');
    // }

    if (!formData.subject) {
      newErrors.subject = 'subject is required';
      toast.error('subject is required');
    }

    if (!formData.mobile) {
      newErrors.mobile = 'mobile is required';
      toast.error('mobile is required');
    } else if (!formData.mobile.length === 10) {
      newErrors.mobile = 'mobile must be 10 characters';
      toast.error('mobile must be 10 characters');
    }

    // if (!formData?.date) {
    //   newErrors.date = 'date is required';
    //   toast.error('date is required');
    // }

    // if (!formData.time) {
    //   newErrors.time = 'time is required';
    //   toast.error('time is required');
    // }

    if (!formData.priority) {
      newErrors.priority = 'priority is required';
      toast.error('priority is required');
    }

    if (!formDepartment || formDepartment.length === 0) {
      newErrors.department = 'department is required';
      toast.error('department is required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (validateForm()) {
        const payload = {
          ...formData,
          department: formDepartment,
          issuedby: user?.username,
          branch: user?.branch,
          status: 'open',
          tat: ticketSettings?.priorities?.find(pri => pri.name === formData?.priority).tat
        };

        const res = await axios.post(`${URI}/executive/raiseticket`, payload, { withCredentials: true }).then(async r => {
          const notificationRes = await axios.post(`${URI}/notification/pushnotification`, { user: user?._id, branch: user?.branch, section: 'tickets', department: formDepartment },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          )
          fetchAllTickets();
          onCancel();
          toast.success(r?.data?.message);
          // Reset form
          setFormData({
            name: '',
            // email: '',
            subject: '',
            // date: '',
            mobile: '',
            // time: '',
            priority: '',

          });
          setFormDepartment([]);
        }).catch(err => {
          // Handle error and show toast
          if (err.response && err.response.data) {
            if (err.response.data.notAuthorized) {
              setSessionWarning(true);
            } else {
              toast.error(err.response.data.message || "Something went wrong");
            }
          } else {
            toast.error("Something went wrong");
          }
        });
      }
    } catch (error) {
      console.log('while raising ticket', error);
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
    finally {
      setLoading(false);
    }
  };


  return (
    <>
      {sessionWarning && <SessionEndWarning setSessionWarning={setSessionWarning} />}

      <form className='form'>
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

        {/* <div className="form-group">
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
      </div> */}

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

        {/* <div className="form-group">
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
      </div> */}

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
            {
              ticketSettings?.priorities?.map(curElem => (
                <option value={curElem?.name}>{curElem?.name}</option>
              ))
            }


          </select>
        </div>

        <div className="form-group">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            id="category"
            name="category"
            className="form-select"
            value={formData?.category}
            onChange={handleChange}
          >
            <option disabled selected value="">--Category--</option>
            {
              ticketSettings?.categories?.map(curElem => (
                <option value={curElem?.name}>{curElem?.name}</option>
              ))
            }

          </select>
        </div>

        {
          formData?.priority ?
            <div className="form-group">
              <label htmlFor="time" className="form-label">T.A.T.</label>
              <label htmlFor=""> Turn Arround Time for Resolve: {
                ticketSettings?.priorities?.find(pri => pri.name === formData?.priority).tat
              } </label>
              {errors?.time && <div className="text-error text-sm mt-1">{errors?.time}</div>}
            </div> : <br />
        }

        <div className="form-group">
          <label htmlFor="department" className="form-label">Department</label>
          <div className='deptcheckbox'>
            {
              departments?.map(curElem => (
                <>
                  <p>{curElem?.name} <input value={curElem?.name} onChange={handleCheckboxChange} type="checkbox" /></p>
                </>
              ))
            }
          </div>
        </div>

        <br />


        {formDepartment?.map((curElem, index) => (
          <div key={curElem?.name} className="form-group">
            <label htmlFor="description" className="form-label">Issue With in {curElem?.name} Department:-</label>
            {
              executives[curElem?.name]?.map(users => (
                <>
                  <p>{users?.name} <input
                    value={users?.username}
                    onChange={(e) => handleUserSelection(e, index)}
                    type="checkbox"
                    checked={formDepartment[index]?.users?.includes(users?.username)}
                  /></p>
                </>
              ))
            }
            <label htmlFor="description" className="form-label">Description for {curElem?.name}</label>
            <textarea
              id={`description-${curElem.name}`}
              name="description"
              className={`form-control ${errors?.description ? 'border-error' : ''}`}
              rows="5"
              value={curElem.description}
              onChange={(e) => handleDepartmentChange(e, index)}
              placeholder="Detailed explanation of the issue (Optional)"
            ></textarea>
            {errors?.description && <div className="text-error text-sm mt-1">{errors?.description}</div>}
          </div>
        ))}



      </form>
      <div className="flex gap-2 justify-end mt-4">

        <button
          type="button"
          className="btn btn-outline"
          onClick={onCancel}
        >
          Cancel
        </button>
        {
          loading ? <button className="btn btn-primary">
            <img src="/img/loader.png" className='Loader' alt="loader" />
          </button>
            :
            <button
              onClick={handleSubmit}
              type="submit"
              className="btn btn-primary"
            >
              {initialData ? 'Update Ticket' : 'Create Ticket'}
            </button>
        }
      </div>
    </>
  );
}

export default TicketForm;