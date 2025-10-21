import React, { useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import Axios from '../utils/axios'
import SummaryApi from '../comman/summaryApi'
import AxiosToastError from '../utils/AxiosToastErroe'
import { UpdateAvatar } from '../Store/userSlice'
import { IoMdClose } from "react-icons/io";
import { FiUploadCloud } from "react-icons/fi";
import { MdCheckCircle } from "react-icons/md";
import imageCompression from 'browser-image-compression';
import toast from 'react-hot-toast';
import '../components/css/UserFileUploadAvatar.css';

const UserFileUploadAvatar = ({ close }) => {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [dragActive, setDragActive] = useState(false)

    const handelSubmit = (e) => {
        e.preventDefault()
    }

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handelUploadAvatarImage({ target: { files: e.dataTransfer.files } });
        }
    };
    
    const handelUploadAvatarImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
    
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            toast.dismiss()
            toast.error("Only PNG and JPEG images are allowed.");
            return;
        }
    
        // Check file size (before compression)
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            toast.dismiss()
            toast.error("Image size must be less than 10MB");
            return;
        }
    
        try {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 600,
                useWebWorker: true
            };
    
            const compressedFile = await imageCompression(file, options);
    
            const formdata = new FormData();
            formdata.append('avatar', compressedFile);
    
            setLoading(true);
    
            const response = await Axios({
                ...SummaryApi.uploadAvatar,
                data: formdata
            });
    
            const { data: responseData } = response;
            dispatch(UpdateAvatar(responseData.data.avatar));
            toast.dismiss();
            toast.success("Avatar uploaded successfully!");
            
            // Close modal after successful upload with a slight delay
            setTimeout(() => {
                close();
            }, 1500);
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="avatar-modal-overlay">
            <div className="avatar-modal-container">
                <button onClick={close} className="modal-close-btn">
                    <IoMdClose size={24} />
                </button>
                
                <div className="modal-header">
                    <h2>Update Profile Picture</h2>
                    <p>Upload a new image to personalize your account</p>
                </div>
                
                <div className="modal-content-horizontal">
                    <div className="avatar-section">
                        <div className="avatar-preview">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt="Profile Avatar"
                                    className="avatar-image"
                                />
                            ) : (
                                <FaUserCircle className="avatar-placeholder" />
                            )}
                            {loading && (
                                <div className="avatar-loading-overlay">
                                    <div className="loading-spinner"></div>
                                </div>
                            )}
                        </div>
                        
                        {!loading && (
                            <div className="avatar-quality-note">
                                <MdCheckCircle size={16} />
                                <span>Recommended: Square image, 600x600px, max 1MB</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="upload-section">
                        <form onSubmit={handelSubmit} className="upload-form">
                            <div 
                                className={`upload-area ${dragActive ? 'drag-active' : ''} ${loading ? 'upload-loading' : ''}`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <input
                                    onChange={handelUploadAvatarImage}
                                    type="file"
                                    id="uploadprofile"
                                    className="hidden-input"
                                    accept="image/png, image/jpeg, image/jpg"
                                    disabled={loading}
                                />
                                
                                <label htmlFor="uploadprofile" className="upload-label">
                                    <div className="upload-content">
                                        <FiUploadCloud size={32} className="upload-icon" />
                                        <div className="upload-text">
                                            <span className="upload-title">
                                                {dragActive ? 'Drop image here' : 'Click to upload or drag and drop'}
                                            </span>
                                            <span className="upload-subtitle">PNG, JPG up to 1MB</span>
                                        </div>
                                    </div>
                                </label>
                            </div>
                            
                            {loading && (
                                <div className="upload-progress">
                                    <div className="progress-bar">
                                        <div className="progress-fill"></div>
                                    </div>
                                    <span className="progress-text">Processing image...</span>
                                </div>
                            )}
                        </form>
                        
                        <div className="modal-actions">
                            <button 
                                onClick={close} 
                                className="cancel-btn"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default UserFileUploadAvatar