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
import RestoreIcon from '@mui/icons-material/Restore';
import { toast } from 'react-toastify';
import { getPDFs } from '../api/pdf';
import { isApiSuccess } from '../util/helper';
import { getCategories } from '../api/categories';
import { createCourse, updateCourse, CoursePayload, deactivateCourse, reactivateCourse } from '../api/courses';

interface CategoryOption { id: string; name: string; }

interface CourseItem {
  id: string;
  name: string;
  description: string;
  price?: number;
  discount?: number;
  category_id?: string;
  aboutCreator?: string;
  is_active?: boolean;
  offer?: Record<string, any>;
  expiry?: string; // ISO
}

const emptyCourse: CoursePayload = {
  name: '',
  description: '',
  category_id: '',
  aboutCreator: '',
  price: 0,
  discount: 0,
  offer: {},
  expiry: '',
};

const CoursesManagement: React.FC = () => {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [categories, setCategories] = useState<CategoryOption[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CoursePayload>(emptyCourse);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [reactivateId, setReactivateId] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      const cats = res?.data || [];
      setCategories(cats.map((c: any) => ({ id: c.id, name: c.name })));
    } catch (e) {
      // non-blocking
    }
  };

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response: any = await getPDFs();
      if (isApiSuccess(response)) {
        const list = response.data?.data || [];
        setCourses(list);
      } else {
        toast.error('Failed to fetch courses');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    loadCourses();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyCourse);
    setModalOpen(true);
  };

  const openEditModal = (c: CourseItem) => {
    setEditingId(c.id);
    setForm({
      name: c.name || '',
      description: c.description || '',
      category_id: c.category_id || '',
      aboutCreator: c.aboutCreator || '',
      price: c.price ?? 0,
      discount: c.discount ?? 0,
      offer: c.offer || {},
      expiry: c.expiry ? c.expiry : '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(emptyCourse);
    setEditingId(null);
  };

  const validate = () => {
    if (!form.name.trim()) return 'Name is required';
    if (!form.description.trim()) return 'Description is required';
    if (!form.category_id) return 'Category is required';
    if (form.price === undefined || form.price === null || isNaN(Number(form.price))) return 'Price is required';
    if (form.discount === undefined || form.discount === null || isNaN(Number(form.discount))) return 'Discount is required';
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
        await updateCourse(editingId, {
          ...form,
          price: Number(form.price),
          discount: Number(form.discount),
          offer: form.offer || {},
        });
        toast.success('Course updated');
      } else {
        await createCourse({
          ...form,
          price: Number(form.price),
          discount: Number(form.discount),
          offer: form.offer || {},
        });
        toast.success('Course created');
      }
      closeModal();
      await loadCourses();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to save course');
    }
  };

  const confirmDeactivate = async () => {
    if (!deleteId) return;
    try {
      await deactivateCourse(deleteId);
      toast.success('Course deactivated');
      setDeleteId(null);
      await loadCourses();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to deactivate course');
    }
  };

  const confirmReactivate = async () => {
    if (!reactivateId) return;
    try {
      await reactivateCourse(reactivateId);
      toast.success('Course reactivated');
      setReactivateId(null);
      await loadCourses();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to reactivate course');
    }
  };

  const renderTable = () => (
    <TableContainer component={Paper}>
      <Table size="medium">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Discount</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.map((c) => (
            <TableRow hover key={c.id}>
              <TableCell sx={{ fontWeight: 600 }}>{c.name}</TableCell>
              <TableCell>{c.description}</TableCell>
              <TableCell>₹{c.price ?? '-'}</TableCell>
              <TableCell>{c.discount ?? '-'}</TableCell>
              <TableCell align="right">
                <IconButton aria-label="edit" onClick={() => openEditModal(c)}>
                  <EditIcon />
                </IconButton>
                {c.is_active===true ? (
                  <IconButton aria-label="deactivate" color="error" onClick={() => setDeleteId(c.id)}>
                    <DeleteIcon />
                  </IconButton>
                ) : (
                  <IconButton aria-label="reactivate" color="primary" onClick={() => setReactivateId(c.id)}>
                    <RestoreIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Helper to convert expiry ISO to datetime-local input value
  const expiryValue = (val: string) => {
    if (!val) return '';
    try {
      const d = new Date(val);
      const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
      const yyyy = d.getFullYear();
      const mm = pad(d.getMonth() + 1);
      const dd = pad(d.getDate());
      const hh = pad(d.getHours());
      const mi = pad(d.getMinutes());
      return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
    } catch {
      return '';
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>Courses Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAddModal}>
          Add Course
        </Button>
      </Stack>

      {renderTable()}

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onClose={closeModal} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'Edit Course' : 'Add Course'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              required
              fullWidth
            />
            <TextField
              label="Description"
              value={form.description}
              onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
              required
              fullWidth
              multiline
              minRows={2}
            />
            <FormControl fullWidth required>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                label="Category"
                value={form.category_id}
                onChange={(e) => setForm((s) => ({ ...s, category_id: e.target.value as string }))}
              >
                {categories.map((p) => (
                  <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="About Creator"
              value={form.aboutCreator}
              onChange={(e) => setForm((s) => ({ ...s, aboutCreator: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Price"
              type="number"
              value={form.price}
              onChange={(e) => setForm((s) => ({ ...s, price: Number(e.target.value) }))}
              fullWidth
              required
            />
            <TextField
              label="Discount"
              type="number"
              value={form.discount}
              onChange={(e) => setForm((s) => ({ ...s, discount: Number(e.target.value) }))}
              fullWidth
              required
            />
            <TextField
              label="Offer (JSON)"
              value={JSON.stringify(form.offer || {})}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value || '{}');
                  setForm((s) => ({ ...s, offer: parsed }));
                } catch {
                  // keep previous if invalid JSON; optionally show hint
                }
              }}
              fullWidth
              multiline
              minRows={2}
            />
            <TextField
              label="Expiry"
              type="datetime-local"
              value={expiryValue(form.expiry)}
              onChange={(e) => {
                const val = e.target.value; // yyyy-MM-ddTHH:mm
                setForm((s) => ({ ...s, expiry: val ? new Date(val).toISOString() : '' }));
              }}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Deactivate Confirmation */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Deactivate Course</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to deactivate this course?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDeactivate}>Deactivate</Button>
        </DialogActions>
      </Dialog>

      {/* Reactivate Confirmation */}
      <Dialog open={!!reactivateId} onClose={() => setReactivateId(null)}>
        <DialogTitle>Reactivate Course</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to reactivate this course?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReactivateId(null)}>Cancel</Button>
          <Button color="primary" variant="contained" onClick={confirmReactivate}>Reactivate</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CoursesManagement;
