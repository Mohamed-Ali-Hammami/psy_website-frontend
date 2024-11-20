"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '../../app/context/AuthContext';
import { updateUserDetails } from '../../../src/utils/UpdateUserDetails';
import CombinedForm from '../../components/CombinedForm';
import ProductListing from '../../components/ProductListing';
import { UpdateData } from '../../../src/utils/types';
import './dashboard.css';
import { Skeleton } from '@mui/material';
import { client } from '../../sanity/lib/client';
import Link from 'next/link';

interface UserDetails {
  user_id: number;
  first_name: string; 
  last_name: string;
  username: string;
  email: string;
  phone_number: string;
  profile_picture: string;
  purchases: Purchase[];
}

interface Purchase {
  product_name: string;
  purchased_at: string;
  price: number;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  image: {
    _type: string;
    asset: {
      _ref: string;
      _type: string;
    };
  };
  pdfUrl?: string;
}

export default function Dashboard() {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const { isLoggedIn, logout } = useAuth();
  const [selectedAction, setSelectedAction] = useState<'changePassword' | 'changeUsername' | 'changeEmail' | 'showPurchases' | 'changeProfilePicture' | 'changePhoneNumber' | null>(null);
  const [purchasedProducts, setPurchasedProducts] = useState<Product[]>([]);
  const [purchaseStatus, setPurchaseStatus] = useState<{ [productName: string]: boolean }>({});
  
// Modify handleActionSelect to set the selected action
  const handleActionSelect = (action: 'changePassword' | 'changeUsername' | 'changeEmail' | 'showPurchases' | 'changeProfilePicture'| 'changePhoneNumber') => {
    // If the same action is selected, set it to null to close the form
    setSelectedAction(prevAction => (prevAction === action ? null : action));
  };
  
  const handleUpdate = async (updateData: UpdateData) => {
    const token = localStorage.getItem('token') || '';
  
    try {
      const response = await updateUserDetails(updateData, token);
  
      if (response.success) {
        setUserDetails(prevDetails => {
          if (!prevDetails) return null;
  
          return {
            ...prevDetails,
            ...(updateData.username && { username: updateData.username }),
            ...(updateData.email && { email: updateData.email }),
            ...(updateData.phone_number && { phone_number: updateData.phone_number }),
            ...(updateData.profilePicture && { 
              profile_picture: typeof updateData.profilePicture === 'string' 
                ? updateData.profilePicture 
                : URL.createObjectURL(updateData.profilePicture)
            }),
          };
        });
  
        alert('User  details updated successfully!');
      } else {
        alert(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error("Failed to update user details:", error);
      alert("An error occurred while updating your details. Please try again.");
    } finally {
      setSelectedAction(null);
    }
  };

  const handleClose = () => {
    setSelectedAction(null);
  };

  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = '/';
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        const res = await fetch(`${apiUrl}/api/user/details`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (res.status === 401) {
          logout();
          window.location.href = '/login';
          return;
        }

        if (!res.ok) throw new Error(`Failed to fetch user details: ${res.statusText}`);
        const data = await res.json();
        setUserDetails(data);

        const purchaseStatusMap: { [productName: string]: boolean } = {};
        data.purchases.forEach((purchase: Purchase) => {
          purchaseStatusMap[purchase.product_name] = true;
        });
        setPurchaseStatus(purchaseStatusMap);

        const productNames = data.purchases.map((purchase: Purchase) => purchase.product_name);
        const productsData = await client.fetch(`*[_type == "product" && name in ${JSON.stringify(productNames)}]{
          _id,
          name,
          description,
          price,
          discountPrice,
          image,
          "pdfUrl": pdfFile.asset->url
        }`);
        setPurchasedProducts(productsData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [isLoggedIn, logout]);
  

  let profilePictureSrc = '/path/to/default-image.jpg';
  
  if (userDetails?.profile_picture) {
    // Fix the incorrect prefix by replacing 'dataimage/jpegbase64' with 'data:image/jpeg;base64'
    const base64Prefix = 'data:image/jpeg;base64,';
  
    // Check if the base64 string is malformed and fix it
    if (userDetails.profile_picture.startsWith('dataimage/jpegbase64')) {
      profilePictureSrc = userDetails.profile_picture.replace('dataimage/jpegbase64', base64Prefix);
    } else {
      // If the string is already properly formatted
      profilePictureSrc = base64Prefix + userDetails.profile_picture;
    }
  }
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

  if (!userDetails) {
    return (
      <div className="no-data-container">
        <h2 className="no-data-heading">No User Data Available</h2>
        <p className="no-data-message">We couldn&apos;t retrieve your user information at this time.</p>
        <p className="no-data-suggestion">Please ensure you&apos;re logged in and try again.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
    <div className="dashboard-main">
    <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome Back, {userDetails?.first_name}!</h1>
        <h2 className="welcome-subtitle">
          Your personalized dashboard to manage account settings, track your purchases, and access your products.
        </h2>
        <p className="dashboard-description">
          Explore the options below to update your profile, change your preferences, and view your purchased products.
        </p>
      </div>

      <div className="profile-section">
        <div className="profile-header">
          <h2 className="section-title">Profile Information</h2>
          <p className="section-description">Update your profile details and manage your account settings</p>
        </div>
        <div className="profile-buttons">
          <button className="action-button" onClick={() => handleActionSelect('changeUsername')}>Change Username</button>
          <button className="action-button" onClick={() => handleActionSelect('changeEmail')}>Change Email</button>
          <button className="action-button" onClick={() => handleActionSelect('changePassword')}>Change Password</button>
          <button className="action-button" onClick={() => handleActionSelect('changePhoneNumber')}>Change Phone Number</button>
          <button className="action-button" onClick={() => handleActionSelect('changeProfilePicture')}>Update Profile Picture</button>
          <button className="action-button" onClick={() => handleActionSelect('showPurchases')}>Your Purchases</button>
        </div>
        <div className="profile-content">
          <div className="profile-image-container">
            <div className="profile-name-container">
              <p className="profile-name">{userDetails.first_name} {userDetails.last_name}</p>
            </div>
            <div className="profile-picture-wrapper">
              {profilePictureSrc ? (
                <Image
                src={profilePictureSrc}
                alt={`${userDetails.username}'s profile picture`}
                width={150}
                height={150}
                className="profile-picture"
                unoptimized // Allows Base64 images to load directly
              />
              
              ) : (
                <div className="no-profile-picture">No Profile Picture Available</div>
              )}
              <span className="profile-picture-tooltip">Update Profile Picture</span>
            </div>
          </div>

          <div className="user-details-table">
            <table>
              <tbody>
                <tr>
                  <td><strong>Username:</strong></td>
                  <td>{userDetails.username}</td>
                </tr>
                <tr>
                  <td><strong>Email:</strong></td>
                  <td>{userDetails.email}</td>
                </tr>
                <tr>
                  <td><strong>Phone Number:</strong></td>
                  <td>{userDetails.phone_number}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="form-container">
            {selectedAction && (
              <CombinedForm
                action={selectedAction}
                onUpdate={handleUpdate}
                onClose={handleClose}
                purchases={userDetails.purchases.map((p) => ({
                  product_name: p.product_name,
                  purchased_at: p.purchased_at,
                  price: p.price,
                }))}
              />
            )}
          </div>
        </div>
      </div>

      <div className="purchases-section">
        <div className="purchases-header">
          <h2 className="section-title">Your Purchases</h2>
          <p className="section-description">View and access your purchased products</p>
        </div>
        {purchasedProducts.length > 0 ? (
          <ProductListing products={purchasedProducts} purchaseStatus={purchaseStatus} />
        ) : (
          <div className="empty-purchases">
            <h3 className="empty-title">No Purchases Yet</h3>
            <p className="empty-description">
              You haven&apos;t made any purchases yet. Explore our products to get started!
            </p>
            <Link href="/products" className="browse-products-btn">Browse Products</Link>
          </div>
        )}
      </div>
    </div>
  </div>
);
}