"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../app/context/AuthContext';
import { Skeleton } from '@mui/material';
import './sudashboard.css';
import Image from 'next/image';

interface Purchase {
  product_name: string;
  purchased_at: string;
  price: number;
}

interface UserDetails {
  user_id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone_number: string;
  profile_picture: string | null;
  country: string;
  address: string;
  created_at: string;
  updated_at: string;
  purchases: Purchase[];
}

export default function SuperuserDashboard() {
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const { isLoggedIn, logout, token } = useAuth();
  const [termsContent, setTermsContent] = useState<string>('');
  const [isEditingTerms, setIsEditingTerms] = useState(false);
  const [newTermsContent, setNewTermsContent] = useState<string>(termsContent);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // Fetch user details
    const fetchUserDetails = async () => {
      try {
        const userRes = await fetch(`${apiUrl}/api/superuser-dashboard`, {
          method: 'GET',
          headers: { 
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json' 
          },
        });

        if (!userRes.ok) {
          if (userRes.status === 401) {
            logout();
            setError('Session expired or invalid token.');
            return;
          }
          throw new Error(`Failed to fetch user details: ${userRes.statusText}`);
        }

        const userData = await userRes.json();
        setUsers(userData.users);
        setTermsContent(userData.terms_of_service)

      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchUserDetails();
    }
  }, [isLoggedIn, logout, token]);

  const handleUserDetails = (user: UserDetails) => {
    setSelectedUser(user);
  };

  const closeUserDetails = () => {
    setSelectedUser(null);
  };
  
  const getProfilePictureSrc = (profilePicture: string | null) => {
    if (!profilePicture) return '/path/to/default-image.jpg';
    
    const base64Prefix = 'data:image/jpeg;base64,';
  
    // Check if the base64 string is malformed and fix it
    if (profilePicture.startsWith('dataimage/jpegbase64')) {
      return profilePicture.replace('dataimage/jpegbase64', base64Prefix);
    } else {
      // If the string is already properly formatted
      return base64Prefix + profilePicture;
    }
  };
  const handleEditTerms = () => {
    setIsEditingTerms(true);
  };
  
  const handleTermsContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewTermsContent(event.target.value);
  };
  
  const handleUpdateTerms = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await fetch(`${apiUrl}/api/superuser-dashboard`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newTermsContent,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update terms: ${response.statusText}`);
      }

      // Set a success message
      setSuccessMessage('Terms updated successfully!');

      // Refresh the window after a short delay to show the message
      setTimeout(() => {
        window.location.reload(); // Refresh the page to reflect changes
      }, 2000); // Adjust the delay as needed
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Skeleton variant="rectangular" width="100%" height={200} />
        <Skeleton variant="text" width={300} height={60} style={{ marginTop: 20 }} />
        <Skeleton variant="text" width={400} height={40} />
        <Skeleton variant="text" width={600} height={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2 className="error-heading">Something Went Wrong</h2>
        <p className="error-message">{error}</p>
        <p className="error-suggestion">Please try refreshing the page or contact support if the problem persists.</p>
      </div>
    );
  }

  return (
    <><div>
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div><div className="superuser-dashboard-container">

        <div className="superuser-dashboard-main">
          {/* Terms of Service Display Section */}
          <div className="terms-display-section">
            <h2 className="section-title">Terms of Service</h2>
            <div className="terms-display">
              <h3>Content:</h3>
              {isEditingTerms ? (
                <div>
                  <label htmlFor="termsContent">Update Terms of Service:</label>
                  <textarea
                    id="termsContent" // Associate the label with this textarea
                    value={newTermsContent}
                    onChange={handleTermsContentChange}
                    rows={10}
                    cols={50}
                    placeholder="Enter the updated terms of service here..." // Optional placeholder for additional guidance
                  />
                  <button onClick={handleUpdateTerms}>Save Changes</button>
                  <button onClick={() => setIsEditingTerms(false)}>Cancel</button>
                </div>
              ) : (
                <div>
                  <p>{termsContent}</p>
                  <button onClick={handleEditTerms}>Edit Terms</button>
                </div>

              )}
            </div>
          </div>

          <div className="user-list-section">
            <h2 className="section-title">All Users ({users.length})</h2>
            <table className="users-table">
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Purchases</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.user_id}>
                    <td>
                      <Image
                        src={getProfilePictureSrc(user.profile_picture)}
                        alt={`${user.username}'s profile picture`}
                        width={150}
                        height={150}
                        className="profile-picture"
                        unoptimized />
                    </td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.phone_number}</td>
                    <td>{user.purchases.length}</td>
                    <td>
                      <button
                        onClick={() => handleUserDetails(user)}
                        className="view-details-btn"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* User Details Modal */}
          {selectedUser && (
            <div className="user-details-modal">
              <div className="user-details-content">
                <button className="close-btn" onClick={closeUserDetails}>×</button>
                <div className="user-details-header">
                  <Image
                    src={getProfilePictureSrc(selectedUser.profile_picture)}
                    alt={`${selectedUser.username}'s profile picture`}
                    width={150}
                    height={150}
                    className="profile-picture"
                    unoptimized />
                  <h2>{`${selectedUser.first_name} ${selectedUser.last_name}`}</h2>
                  <p>Username: {selectedUser.username}</p>
                  <p>Email: {selectedUser.email}</p>
                  <p>Phone Number: {selectedUser.phone_number}</p>
                  <p>Country: {selectedUser.country}</p>
                  <p>Address: {selectedUser.address}</p>
                  <p>Created At: {new Date(selectedUser.created_at).toLocaleString()}</p>
                  <p>Updated At: {new Date(selectedUser.updated_at).toLocaleString()}</p>
                </div>
                <h3>Purchases</h3>
                <table className="purchases-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Purchased At</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedUser.purchases.map((purchase, index) => (
                      <tr key={index}>
                        <td>{purchase.product_name}</td>
                        <td>{new Date(purchase.purchased_at).toLocaleString()}</td>
                        <td>${purchase.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div></>
  );
}