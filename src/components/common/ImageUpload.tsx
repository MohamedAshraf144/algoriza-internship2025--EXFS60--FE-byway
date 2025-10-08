import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Alert,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
} from '@mui/icons-material';

interface ImageUploadProps {
  value?: string;
  onChange: (imageUrl: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = "Upload Image",
  error,
  disabled = false
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      // Convert file to base64 for preview and storage
      const base64 = await convertToBase64(file);
      onChange(base64);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image');
    } finally {
      setUploading(false);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleRemoveImage = () => {
    if (disabled) return;
    onChange('');
  };

  const handleClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
        {label}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {value ? (
        <Paper
          elevation={2}
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
          }}
        >
          <Box
            component="img"
            src={value}
            alt="Preview"
            sx={{
              width: 80,
              height: 80,
              objectFit: 'cover',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Image uploaded successfully
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Click to change or remove
            </Typography>
          </Box>
          <IconButton
            onClick={handleRemoveImage}
            disabled={disabled}
            color="error"
            size="small"
          >
            <Delete />
          </IconButton>
        </Paper>
      ) : (
        <Paper
          elevation={dragActive ? 4 : 1}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
          sx={{
            p: 4,
            textAlign: 'center',
            border: '2px dashed',
            borderColor: dragActive ? 'primary.main' : 'divider',
            borderRadius: 2,
            cursor: disabled ? 'default' : 'pointer',
            backgroundColor: dragActive ? 'action.hover' : 'background.paper',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: disabled ? 'divider' : 'primary.main',
              backgroundColor: disabled ? 'background.paper' : 'action.hover',
            },
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            style={{ display: 'none' }}
            disabled={disabled}
          />
          
          <CloudUpload
            sx={{
              fontSize: 48,
              color: dragActive ? 'primary.main' : 'text.secondary',
              mb: 2,
            }}
          />
          
          <Typography variant="h6" gutterBottom>
            {uploading ? 'Uploading...' : 'Drop image here or click to upload'}
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            Supports: JPG, PNG, GIF (Max 5MB)
          </Typography>
        </Paper>
      )}

      {uploading && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="primary">
            Processing image...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ImageUpload;
