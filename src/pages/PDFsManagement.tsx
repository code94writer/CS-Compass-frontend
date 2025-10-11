import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import { getPDFById, getPDFs } from '../api/pdf';
import { isApiSuccess } from '../util/helper';
import { createCoursePDF, deleteCoursePDF, listCoursePDFs, updateCoursePDF, CoursePDFItem } from '../api/coursePdfs';

interface CourseItem {
  id: string;
  name: string;
  description?: string;
}

const PDFsManagement: React.FC = () => {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  const [pdfs, setPdfs] = useState<CoursePDFItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formFile, setFormFile] = useState<File | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadCourses = async () => {
    try {
      const response: any = await getPDFs();
      if (isApiSuccess(response)) {
        const list = response.data?.data || [];
        setCourses(list);
      } else {
        toast.error('Failed to load courses');
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to load courses');
    }
  };

  const loadPdfs = async (courseId: string) => {
    if (!courseId) return;
    try {
      setLoading(true);
      const response: any = await getPDFById(courseId);
      if (isApiSuccess(response)) {
        const list = response.data?.data?.pdfs || [];
        setPdfs(list);
      } else {
        toast.error('Failed to load PDFs');
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to load PDFs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      loadPdfs(selectedCourseId);
    } else {
      setPdfs([]);
    }
  }, [selectedCourseId]);

  const openAddModal = () => {
    if (!selectedCourseId) {
      toast.warn('Select a course first');
      return;
    }
    setEditingId(null);
    setFormTitle('');
    setFormDescription('');
    setFormFile(null);
    setModalOpen(true);
  };

  const openEditModal = (item: CoursePDFItem) => {
    setEditingId(item.id);
    setFormTitle(item.title || '');
    setFormDescription(item.description || '');
    setFormFile(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setFormTitle('');
    setFormDescription('');
    setFormFile(null);
  };

  const validate = () => {
    if (!formTitle.trim()) return 'Title is required';
    if (!editingId && !formFile) return 'PDF file is required';
    return null;
  };

  const handleSave = async () => {
    const err = validate();
    if (err) {
      toast.warn(err);
      return;
    }
    try {
      if (editingId) {
        const res: any = await updateCoursePDF(selectedCourseId, editingId, {
          file: formFile || undefined,
          title: formTitle.trim(),
          description: formDescription.trim() || undefined,
        });
        if (isApiSuccess(res)) {
          toast.success('PDF updated');
        } else {
          toast.error(res?.data?.message || 'Failed to update PDF');
          return;
        }
      } else {
        const res: any = await createCoursePDF(
          selectedCourseId,
          formFile as File,
          formTitle.trim(),
          formDescription.trim() || undefined
        );
        if (isApiSuccess(res)) {
          toast.success('PDF added');
        } else {
          toast.error(res?.data?.message || 'Failed to add PDF');
          return;
        }
      }
      closeModal();
      await loadPdfs(selectedCourseId);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to save PDF');
    }
  };

  const confirmDelete = async () => {
    if (!deleteId || !selectedCourseId) return;
    try {
      await deleteCoursePDF(selectedCourseId, deleteId);
      toast.success('PDF deleted');
      setDeleteId(null);
      await loadPdfs(selectedCourseId);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to delete PDF');
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>PDFs Management</Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="course-select-label">Select Course</InputLabel>
        <Select
          labelId="course-select-label"
          label="Select Course"
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value as string)}
        >
          {courses.map((c) => (
            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">{selectedCourseId ? 'PDFs for selected course' : 'Select a course to manage PDFs'}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAddModal} disabled={!selectedCourseId}>
          Add PDF
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pdfs.map((p) => (
              <TableRow hover key={p.id}>
                <TableCell sx={{ fontWeight: 600 }}>{p.title}</TableCell>
                <TableCell>{p.description || '-'}</TableCell>
                <TableCell align="right">
                  <IconButton aria-label="edit" onClick={() => openEditModal(p)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="delete" color="error" onClick={() => setDeleteId(p.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {pdfs.length === 0 && selectedCourseId && (
              <TableRow>
                <TableCell colSpan={3} align="center">No PDFs found for this course</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onClose={closeModal} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'Edit PDF' : 'Add PDF'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Title"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Description"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              multiline
              minRows={2}
              fullWidth
            />
            <Button component="label" variant="outlined">
              {editingId ? 'Replace PDF (optional)' : 'Select PDF file'}
              <input
                type="file"
                accept="application/pdf"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  setFormFile(f);
                }}
              />
            </Button>
            {!editingId && !formFile && (
              <Typography variant="caption" color="text.secondary">PDF file is required</Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={!formTitle.trim() || (!editingId && !formFile)}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete PDF</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this PDF?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PDFsManagement;
