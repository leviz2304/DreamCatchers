// src/components/UploadMedia.js
import React, { useState } from 'react';
import { uploadVideo, uploadThumbnail } from '../../api/apiService/dataService'; // Đảm bảo bạn đã thêm các hàm này vào apiService.js

const UploadMedia = ({ onUploadComplete }) => {
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [loadingVideo, setLoadingVideo] = useState(false);
    const [loadingThumbnail, setLoadingThumbnail] = useState(false);

    const handleUploadVideo = async () => {
        if (!videoFile) {
            alert("Vui lòng chọn file video để upload.");
            return;
        }
        setLoadingVideo(true);
        try {
            const response = await uploadVideo(videoFile);
            setVideoUrl(response.content.url);
            onUploadComplete({ videoUrl: response.content.url, thumbnailUrl });
            alert("Video được tải lên thành công!");
        } catch (error) {
            console.error("Error uploading video:", error);
            alert("Tải lên video thất bại!");
        } finally {
            setLoadingVideo(false);
        }
    };

    const handleUploadThumbnail = async () => {
        if (!thumbnailFile) {
            alert("Vui lòng chọn file thumbnail để upload.");
            return;
        }
        setLoadingThumbnail(true);
        try {
            const response = await uploadThumbnail(thumbnailFile);
            setThumbnailUrl(response.content.url);
            onUploadComplete({ videoUrl, thumbnailUrl: response.content.url });
            alert("Thumbnail được tải lên thành công!");
        } catch (error) {
            console.error("Error uploading thumbnail:", error);
            alert("Tải lên thumbnail thất bại!");
        } finally {
            setLoadingThumbnail(false);
        }
    };

    return (
        <div>
            <h3>Upload Media</h3>
            <div>
                <label>Video:</label>
                <input type="file" accept="video/*" onChange={e => setVideoFile(e.target.files[0])} />
                <button onClick={handleUploadVideo} disabled={loadingVideo}>
                    {loadingVideo ? 'Uploading...' : 'Upload Video'}
                </button>
                {videoUrl && (
                    <div>
                        <h4>Video Preview:</h4>
                        <video width="320" height="240" controls>
                            <source src={videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                )}
            </div>
            <div>
                <label>Thumbnail:</label>
                <input type="file" accept="image/*" onChange={e => setThumbnailFile(e.target.files[0])} />
                <button onClick={handleUploadThumbnail} disabled={loadingThumbnail}>
                    {loadingThumbnail ? 'Uploading...' : 'Upload Thumbnail'}
                </button>
                {thumbnailUrl && (
                    <div>
                        <h4>Thumbnail Preview:</h4>
                        <img src={thumbnailUrl} alt="Thumbnail" width="200" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadMedia;
