import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Grid,
  Typography,
  IconButton,
  Paper,
  TextField,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import {
  PhotoCamera,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Compare as CompareIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { storage } from '../../config/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { validateProgressPhoto } from '../../utils/formValidation';

const ProgressPhotoUpload = ({ userId, photos, onPhotoUpload, onPhotoDelete, onPhotoUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const fileInputRef = useRef();

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      const photoData = await uploadPhoto(file);
      onPhotoUpload(photoData);
      setError(null);
    } catch (error) {
      setError('Failed to upload photo: ' + error.message);
    } finally {
      setUploading(false);
      event.target.value = ''; // Reset file input
    }
  };

  const uploadPhoto = async (file) => {
    const timestamp = Date.now();
    const storageRef = ref(storage, `progress-photos/${userId}/${timestamp}_${file.name}`);
    
    // Compress image before upload if needed
    const compressedFile = await compressImage(file);
    
    await uploadBytes(storageRef, compressedFile);
    const url = await getDownloadURL(storageRef);

    const photoData = {
      id: timestamp.toString(),
      url,
      date: new Date().toISOString(),
      type: 'front', // default type
      notes: ''
    };

    const { isValid, errors } = await validateProgressPhoto(photoData);
    if (!isValid) {
      throw new Error(Object.values(errors).join(', '));
    }

    return photoData;
  };

  const compressImage = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              resolve(new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              }));
            },
            'image/jpeg',
            0.7 // compression quality
          );
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handlePhotoClick = (photo) => {
    if (compareMode) {
      handleCompareSelect(photo);
    } else {
      setSelectedPhoto(photo);
      setOpenDialog(true);
    }
  };

  const handleCompareSelect = (photo) => {
    setSelectedPhotos(prev => {
      if (prev.includes(photo)) {
        return prev.filter(p => p !== photo);
      }
      if (prev.length < 2) {
        return [...prev, photo];
      }
      return [prev[1], photo];
    });
  };

  const handleUpdatePhoto = async (photo) => {
    try {
      const { isValid, errors } = await validateProgressPhoto(photo);
      if (!isValid) {
        setError(Object.values(errors).join(', '));
        return;
      }

      await onPhotoUpdate(photo);
      setOpenDialog(false);
      setError(null);
    } catch (error) {
      setError('Failed to update photo: ' + error.message);
    }
  };

  const handleDeletePhoto = async (photo) => {
    try {
      // Delete from storage
      const photoRef = ref(storage, photo.url);
      await deleteObject(photoRef);
      
      // Delete from database
      await onPhotoDelete(photo.id);
      
      setOpenDialog(false);
      setError(null);
    } catch (error) {
      setError('Failed to delete photo: ' + error.message);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="contained"
          component="label"
          startIcon={<PhotoCamera />}
          disabled={uploading}
        >
          Upload Photo
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={handleFileSelect}
          />
        </Button>
        <Button
          variant="outlined"
          startIcon={<CompareIcon />}
          onClick={() => setCompareMode(!compareMode)}
          color={compareMode ? 'primary' : 'inherit'}
        >
          Compare Photos
        </Button>
      </Box>

      {/* Photo grid */}
      <Grid container spacing={2}>
        {photos.map((photo) => (
          <Grid item xs={12} sm={6} md={4} key={photo.id}>
            <Paper
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.02 }}
              sx={{
                p: 1,
                cursor: 'pointer',
                border: compareMode && selectedPhotos.includes(photo)
                  ? '2px solid' + theme => theme.palette.primary.main
                  : 'none'
              }}
              onClick={() => handlePhotoClick(photo)}
            >
              <img
                src={photo.url}
                alt={`Progress photo from ${new Date(photo.date).toLocaleDateString()}`}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 4
                }}
              />
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2">
                  {new Date(photo.date).toLocaleDateString()}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {photo.type}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Photo dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedPhoto && (
          <>
            <DialogTitle>
              Progress Photo Details
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <img
                    src={selectedPhoto.url}
                    alt={`Progress photo from ${new Date(selectedPhoto.date).toLocaleDateString()}`}
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 4
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Date"
                    value={selectedPhoto.date.split('T')[0]}
                    onChange={(e) => setSelectedPhoto({
                      ...selectedPhoto,
                      date: new Date(e.target.value).toISOString()
                    })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Photo Type</InputLabel>
                    <Select
                      value={selectedPhoto.type}
                      onChange={(e) => setSelectedPhoto({
                        ...selectedPhoto,
                        type: e.target.value
                      })}
                      label="Photo Type"
                    >
                      <MenuItem value="front">Front View</MenuItem>
                      <MenuItem value="back">Back View</MenuItem>
                      <MenuItem value="side">Side View</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Notes"
                    value={selectedPhoto.notes}
                    onChange={(e) => setSelectedPhoto({
                      ...selectedPhoto,
                      notes: e.target.value
                    })}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeletePhoto(selectedPhoto)}
              >
                Delete
              </Button>
              <Button
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => handleUpdatePhoto(selectedPhoto)}
              >
                Update
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Compare dialog */}
      <Dialog
        open={compareMode && selectedPhotos.length === 2}
        onClose={() => setSelectedPhotos([])}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Compare Progress Photos
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {selectedPhotos.map((photo, index) => (
              <Grid item xs={12} md={6} key={photo.id}>
                <Typography variant="subtitle1" gutterBottom>
                  {new Date(photo.date).toLocaleDateString()}
                </Typography>
                <img
                  src={photo.url}
                  alt={`Progress photo ${index + 1}`}
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 4
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedPhotos([])}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>

      {/* Loading overlay */}
      {uploading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default ProgressPhotoUpload;
