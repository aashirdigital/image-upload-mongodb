import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Delete, CloudUpload, Logout } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/UserDashboard.css';
import axios from 'axios';

const UserDashboard = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [imageName, setImageName] = useState(null);
    const [image, setImage] = useState(null);
    const [allImages, setAllImages] = useState(null);
    const [search, setSearch] = useState(null);

    const searchHandler = (e) => {
        setSearch(e.target.value.toLowerCase());
    };

    const covertToBase64 = (e) => {
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.onerror = (err) => {
            console.log("Error:", err);
        };
    };

    const imageUploadHandler = async () => {
        try {
            const res = await axios.post('/api/image/uploadImage', { userId: params.id, name: imageName, image: image });
            if (res.data.success) {
                toast(res.data.message);
                setImageName("");
                setImage(null);
                getAllImages(); // Fetch all images again after successful upload
            } else {
                toast(res.data.message);
            }
        } catch (error) {
            toast("Error occurred");
        }
    };

    const logoutHandler = () => {
        localStorage.removeItem('token');
        toast("Logout Successful")
        navigate('/')
    };

    const getAllImages = async () => {
        try {
            const res = await axios.post(`/api/image/getAllUserImages`, { userId: params.id });
            if (res.data.success) {
                setAllImages(res.data.data);
                if (res.data.data.length > 0) {
                    // toast(res.data.message);
                } else {
                    toast("No Images found");
                }
            } else {
                toast(res.data.message);
            }
        } catch (error) {
            toast("Error Occurred");
        }
    };

    const deleteHandler = async (id) => {
        try {
            const res = await axios.post('/api/image/deleteImage', { id: id });
            if (res.data.success) {
                toast(res.data.message);
                getAllImages(); // Fetch all images again after successful deletion
            } else {
                toast(res.data.message);
            }
        } catch (error) {
            toast("Error Occurred");
        }
    };

    const getUserData = async () => {
        try {
            const res = await axios.post('/api/user/getUserData', {},
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem('token')
                    }
                })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAllImages();
        getUserData();
        // eslint-disable-next-line
    }, []);

    const filteredImages = allImages?.filter((obj) => obj.name.toLowerCase().includes(search));
    const displayImages = filteredImages?.length > 0 ? filteredImages : allImages;

    return (
        <div className='container-fluid dashboard'>
            <div onClick={logoutHandler} className="logout-container">
                <Logout className='icon' />
            </div>
            <div className="search-bar">
                <input onChange={searchHandler} type="search" placeholder='Search image' />
                <button>Search</button>
                <div className='upload-btn'>
                    <CloudUpload className='icon' data-bs-toggle="modal" data-bs-target="#exampleModal" />
                </div>
            </div>
            <div className="image-container my-4">
                {
                    displayImages?.map(obj => {
                        return <>
                            <div className='image-card' key={obj._id}>
                                <div onClick={() => deleteHandler(obj._id)} className="delete-icon">
                                    <Delete className='icon' />
                                </div>
                                <img src={obj.image} alt="img" />
                                <p className='mont'>{obj.name}</p>
                            </div>
                        </>
                    })
                }
            </div>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Upload your image</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3 row">
                                <label htmlFor="name" className="col-sm-2 col-form-label">Name</label>
                                <div className="col-12">
                                    <input value={imageName} onChange={(e) => setImageName(e.target.value)} name='name' type="text" className="form-control" id="name" />
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="name" className="col-sm-2 col-form-label">Image</label>
                                <div className="col-12">
                                    <input
                                        accept='image/*'
                                        onChange={covertToBase64}
                                        type="file" className="form-control" id="name" />
                                </div>
                            </div>
                            {
                                image === "" || image === null ? "" :
                                    <div className="mb-3 row">
                                        <img width={80} src={image} alt="img" />
                                    </div>
                            }
                        </div>
                        <div className="modal-footer">
                            <button onClick={imageUploadHandler} type="button">Upload</button>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default UserDashboard
