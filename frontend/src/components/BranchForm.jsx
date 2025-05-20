import axios from 'axios';
import { useEffect, useState } from 'react';
import URI from '../utills';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import SessionEndWarning from './SessionEndWarning';

function BranchForm({ onCancel, fetchBranches, initialData = null, admins = [] }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    location: initialData?.location || '',
    admin: initialData?.admin || ''
  });

  const [errors, setErrors] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionWarning, setSessionWarning] = useState(false);

  //fetch users
  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`${URI}/superadmin/getadmins`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        setAllUsers(res?.data?.allBranchesData?.filter((us) => us?.designation !== 'superadmin'));
      }).catch(err => {
        // Handle error and show toast
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message); // For 400, 401, etc.
        } else {
          toast.error("Something went wrong");
        }
      });
    } catch (error) {
      console.log("while fetching all Users data", error);
    }
  }

  useEffect(() => {
    fetchAllUsers();
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

    if (!formData.name.trim()) {
      newErrors.name = 'Branch name is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      if (validateForm()) {

        const res = await axios.post(`${URI}/superadmin/createbranch`, formData, {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }).then(res => {
          fetchBranches();
          onCancel();
          setFormData({
            name: '',
            location: '',
            admin: ''
          })
          toast.success(res?.data?.message);
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
      console.log("while creating branch", error);
    }
    finally {
      setLoading(false);
    }
  };


  const updateUser = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();

      const res = await axios.post(`${URI}/superadmin/updatebranch`, { name: formData?.name, location: formData?.location, admin: formData?.admin, branchid: initialData?._id }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }).then(res => {
        fetchBranches();
        onCancel();
        setFormData({
          name: '',
          location: '',
          admin: '',
        });
        toast.success(res?.data?.message);
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


    } catch (error) {
      console.log("while updating Branch");
    }
    finally {
      setLoading(false);
    }
  }

  // Filter out admins who are already assigned to a branch
  const availableAdmins = allUsers?.filter(admin =>
    admin.designation === 'admin'
  );

  return (
    <>
      {sessionWarning && <SessionEndWarning setSessionWarning={setSessionWarning} />}
      <form>
        <div className="form-group">
          <label htmlFor="name" className="form-label">Branch Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className={`form-control ${errors.name ? 'border-error' : ''}`}
            value={formData?.name}
            onChange={handleChange}
            placeholder="Enter branch name"
          />
          {errors.name && <div className="text-error text-sm mt-1">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="location" className="form-label">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            className={`form-control ${errors.location ? 'border-error' : ''}`}
            value={formData?.location}
            onChange={handleChange}
            placeholder="Enter branch location"
          />
          {errors.location && <div className="text-error text-sm mt-1">{errors.location}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="admin" className="form-label">Branch Admin</label>
          <select
            id="admin"
            name="admin"
            className="form-select"
            // value={formData?.admin}
            onChange={handleChange}
          >
            <option value="" selected disabled>Select an admin (optional)</option>
            {availableAdmins?.map(admin => (
              <option key={admin?.id} value={admin?.username}>
                {admin?.username} - {admin?.branches?.map(b => (<>{b}, </>))}
              </option>
            ))}
            {
              initialData?.admin && <option value="" style={{ color: 'red' }}>Remove Admin</option>
            }

          </select>
        </div>

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
                type="submit"
                onClick={initialData ? updateUser : handleSubmit}
                className="btn btn-primary"
              >
                {initialData ? 'Update Branch' : 'Create Branch'}
              </button>
          }
        </div>
      </form>
    </>
  );
}

export default BranchForm;