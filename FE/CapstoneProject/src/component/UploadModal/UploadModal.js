import React, { useState } from "react";
import { uploadVideoFile, uploadImageFile } from "../../api/apiService/dataService";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography
} from "@mui/material";

const UploadModal = ({ onClose, onUploadSuccess, type = "video" }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Vui lòng chọn một tệp để tải lên.");
      return;
    }

    setIsUploading(true);
    setError(null);
    setPreviewUrl(null);

    try {
      let url;
      if (type === "video") {
        url = await uploadVideoFile(file);
      } else {
        url = await uploadImageFile(file);
      }

      setPreviewUrl(url);
      onUploadSuccess(url);
    } catch (err) {
      console.error(err);
      setError("Upload thất bại. Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setPreviewUrl(null);
    setError(null);
  };

  const renderPreview = () => {
    if (!previewUrl) return null;

    if (type === "image") {
      return (
        <div className="mt-4">
          <Typography variant="subtitle1" fontWeight="bold" className="mb-2">Preview Ảnh</Typography>
          <img src={previewUrl} alt="Preview" className="w-full h-auto rounded" />
        </div>
      );
    }

    if (type === "video") {
      return (
        <div className="mt-4">
          <Typography variant="subtitle1" fontWeight="bold" className="mb-2">Preview Video</Typography>
          <video controls className="w-full h-auto rounded">
            <source src={previewUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Upload {type === "video" ? "Video" : "Ảnh"}</DialogTitle>
      <DialogContent>
        <input
          type="file"
          accept={type === "video" ? "video/*" : "image/*"}
          onChange={handleFileChange}
          className="mb-4 w-full"
        />
        {error && <Typography color="error" className="mb-4">{error}</Typography>}
        {isUploading && (
          <div className="flex items-center space-x-2 mb-4">
            <CircularProgress size={20} />
            <span>Đang tải...</span>
          </div>
        )}
        {renderPreview()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isUploading}>
          Hủy
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          color="primary"
          disabled={isUploading || !file}
        >
          {isUploading ? "Đang tải..." : "Upload"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

UploadModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onUploadSuccess: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["video", "image"])
};

export default UploadModal;
