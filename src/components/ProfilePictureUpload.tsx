import React from 'react';
import Image from 'next/image';
import styles from '../styles/ProfilePictureUpdate.module.css';

interface ProfilePictureUploadProps {
  onProfilePictureChange: (image: string) => void;
  onRemoveImage: () => void;
  imagePreview: string | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  onProfilePictureChange,
  onRemoveImage,
  imagePreview,
  fileInputRef
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onProfilePictureChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.profilePictureUpload}>
      <label htmlFor="profile-picture-upload" className={styles.visuallyHidden}>
        Upload Profile Picture
      </label>
      <input
        id="profile-picture-upload"
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={imagePreview !== null}
        aria-label="Upload profile picture"
        className={styles.fileInput}
      />
      {imagePreview && (
        <div className={styles.imagePreviewContainer}>
          <Image
            src={imagePreview}
            alt="Profile Picture Preview"
            width={100}
            height={100}
            className={styles.imagePreview}
          />
          <button
            type="button"
            onClick={onRemoveImage}
            className={styles.removeButton}
            aria-label="Remove profile picture"
          >
            Remove Image
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUpload;