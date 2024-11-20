
import React, { useState, useCallback } from 'react';
import { UpdateData } from '../../src/utils/types';
import styles from '../styles/CombinedForm.module.css';
import ProfilePictureUpload from './ProfilePictureUpload';

interface CombinedFormProps {
  onUpdate: (updateData: UpdateData) => void;
  onClose: () => void;
  action: 'changePassword' | 'changeUsername' | 'changeEmail' | 'changeProfilePicture' | 'changePhoneNumber' | 'showPurchases' | null;
  purchases?: { product_name: string; purchased_at: string; price: number }[];
  viewOnly?: boolean;
  children?: React.ReactNode;
}

const CombinedForm: React.FC<CombinedFormProps> = ({ 
  onUpdate, 
  onClose, 
  action, 
  purchases, 
  viewOnly, 
  children 
}) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    password: '',
    oldPassword: '',
    newPassword: ''
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (viewOnly) return;

    let updateData: UpdateData;

    try {
      switch (action) {
        case 'changeProfilePicture':
          if (!imagePreview) {
            alert('Please select a profile picture');
            return;
          }
          updateData = { profilePicture: imagePreview };
          break;
        
        case 'changeUsername':
          updateData = { 
            username: formData.username, 
            password: formData.password 
          };
          break;
        
        case 'changeEmail':
          updateData = { 
            email: formData.email, 
            password: formData.password 
          };
          break;
        
        case 'changePhoneNumber':
          updateData = { 
            phone_number: formData.phone_number, 
            password: formData.password 
          };
          break;
        
        case 'changePassword':
          updateData = { 
            oldPassword: formData.oldPassword, 
            newPassword: formData.newPassword 
          };
          break;
        
        default:
          throw new Error(`Unsupported action: ${action}`);
      }

      onUpdate(updateData);
    } catch (error) {
      console.error('Form submission error:', error);
      alert('An error occurred. Please try again.');
    }
  }, [action, formData, imagePreview, viewOnly, onUpdate]);

  const removeImage = useCallback(() => {
    setImagePreview(null);
  }, []);

  const renderFormSection = () => {
    switch (action) {
      case 'changeProfilePicture':
        return (
          <ProfilePictureUpload 
            onProfilePictureChange={setImagePreview}
            onRemoveImage={removeImage}
            imagePreview={imagePreview}
            fileInputRef={fileInputRef}
          />
        );
      case 'changeUsername':
        return (
          <>
            <input
              type="text"
              name="username"
              placeholder="New Username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className={styles.inputField}
            />
            <input
              type="password"
              name="password"
              placeholder="Current Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className={styles.inputField}
            />
          </>
        );
      
      case 'changeEmail':
        return (
          <>
            <input
              type="email"
              name="email"
              placeholder="New Email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className={styles.inputField}
            />
            <input
              type="password"
              name="password"
              placeholder="Current Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className={styles.inputField}
            />
          </>
        );
      
      case 'changePassword':
        return (
          <>
            <input
              type="password"
              name="oldPassword"
              placeholder="Old Password"
              value={formData.oldPassword}
              onChange={handleInputChange}
              required
              className={styles.inputField}
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleInputChange}
              required
              className={styles.inputField}
            />
          </>
        );
      
      case 'changePhoneNumber':
        return (
          <>
            <input
              type="tel"
              name="phone_number"
              placeholder="New Phone Number"
              value={formData.phone_number}
              onChange={handleInputChange}
              required
              className={styles.inputField}
            />
            <input
              type="password"
              name="password"
              placeholder="Current Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className={styles.inputField}
            />
          </>
        );

      case 'showPurchases':
        return (
          <div className={styles.purchasesTable}>
            <h3>Your Purchases</h3>
            {purchases && purchases.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Date Purchased</th>
                    <th>Current Price</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((purchase, index) => (
                    <tr key={index}>
                      <td>{purchase.product_name}</td>
                      <td>{new Date(purchase.purchased_at).toLocaleDateString()}</td>
                      <td>${(purchase.price / 100).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No purchases found.</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <button
        type="button"
        onClick={onClose}
        className={styles.closeButton}
        aria-label="Close"
      >
        &times;
      </button>

      {children}

      {renderFormSection()}

      {(action === 'changeUsername' || action === 'changeEmail' || action === 'changePassword' || action === 'changePhoneNumber' || action === 'changeProfilePicture') && (
        <button type="submit" className={styles.submitButton}>
          Update
        </button>
      )}

      {action === 'showPurchases' && (
        <button type="button" onClick={onClose} className={styles.closeButton}>
          Close
        </button>
      )}
    </form>
  );
};

export default CombinedForm;