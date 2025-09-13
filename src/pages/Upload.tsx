import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { uploadPDF } from '../api/pdf';
import { I_UploadPDF } from '../types';

const Upload: React.FC = () => {
  const [formData, setFormData] = useState<I_UploadPDF>({
    title: '',
    file: null as any,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    
    if (name === 'file' && files && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    
    if (!formData.file) {
      toast.error('Please select a PDF file');
      return;
    }

    if (formData.file.type !== 'application/pdf') {
      toast.error('Please select a valid PDF file');
      return;
    }

    setLoading(true);

    try {
      const response = await uploadPDF(formData);
      
      if (response?.data) {
        toast.success('PDF uploaded successfully!');
        navigate('/');
      } else {
        toast.error('Failed to upload PDF');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('An error occurred during upload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box mb={4}>
          <Typography variant="h3" component="h1" gutterBottom>
            Upload New PDF
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Upload a new PDF document to make it available to subscribed users
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="PDF Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter PDF title"
            sx={{ mb: 3 }}
          />

          <Box
            sx={{
              border: '2px dashed',
              borderColor: 'primary.main',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              mb: 3,
              '&:hover': {
                borderColor: 'primary.dark',
                backgroundColor: 'action.hover',
              },
            }}
          >
            <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Choose PDF File
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Drag and drop a PDF file here, or click to select
            </Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon />}
            >
              Select File
              <input
                type="file"
                hidden
                accept=".pdf"
                name="file"
                onChange={handleChange}
                required
              />
            </Button>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              PDF files only
            </Typography>
          </Box>

          {formData.file && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Selected file:</strong> {formData.file.name} ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
              </Typography>
            </Alert>
          )}

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              startIcon={<ArrowBackIcon />}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <UploadIcon />}
              sx={{ minWidth: 140 }}
            >
              {loading ? 'Uploading...' : 'Upload PDF'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Upload;
