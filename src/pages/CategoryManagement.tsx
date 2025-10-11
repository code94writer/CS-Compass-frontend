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
import {
  Category,
  CategoryPayload,
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../api/categories';
import { isApiSuccess } from '../util/helper';

const emptyPayload: CategoryPayload = { name: '', description: '', parent_id: undefined };

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryPayload>(emptyPayload);
  const [editingIsTopLevel, setEditingIsTopLevel] = useState<boolean>(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const parentOptions = useMemo(() => categories.filter(c => !c.parent_id), [categories]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
       
            const categories = response.data||[]
            setCategories(categories);
        
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyPayload);
    setEditingIsTopLevel(false);
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, description: cat.description, parent_id: cat.parent_id || undefined });
    setEditingIsTopLevel(!cat.parent_id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(emptyPayload);
    setEditingId(null);
    setEditingIsTopLevel(false);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.warn('Name is required');
      return;
    }
    if (!form.description.trim()) {
      toast.warn('Description is required');
      return;
    }

    try {
      if (editingId) {
        await updateCategory(editingId, {
          name: form.name.trim(),
          description: form.description.trim(),
          parent_id: form.parent_id || undefined,
        });
        toast.success('Category updated');
      } else {
        await createCategory({
          name: form.name.trim(),
          description: form.description.trim(),
          parent_id: form.parent_id || undefined,
        });
        toast.success('Category created');
      }
      closeModal();
      await loadCategories();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save category');
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCategory(deleteId);
      toast.success('Category deleted');
      setDeleteId(null);
      await loadCategories();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete category');
    }
  };

  const grouped = useMemo(() => {
    const parents = categories.filter(c => !c.parent_id);
    const children = categories.filter(c => !!c.parent_id);
    const map: Record<string, Category[]> = {};
    children.forEach(c => {
      if (!c.parent_id) return;
      if (!map[c.parent_id]) map[c.parent_id] = [];
      map[c.parent_id].push(c);
    });
    return { parents, childrenMap: map };
  }, [categories]);

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>Category Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAddModal}>
          Add Category
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Parent</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grouped.parents.map((p) => (
              <React.Fragment key={p.id}>
                <TableRow hover>
                  <TableCell sx={{ fontWeight: 600 }}>{p.name}</TableCell>
                  <TableCell>{p.description}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell align="right">
                    <IconButton aria-label="edit" onClick={() => openEditModal(p)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete" color="error" onClick={() => setDeleteId(p.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
                {(grouped.childrenMap[p.id] || []).map((c) => (
                  <TableRow hover key={c.id}>
                    <TableCell sx={{ pl: 6 }}>↳ {c.name}</TableCell>
                    <TableCell>{c.description}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell align="right">
                      <IconButton aria-label="edit" onClick={() => openEditModal(c)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton aria-label="delete" color="error" onClick={() => setDeleteId(c.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onClose={closeModal} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'Edit Category' : 'Add Category'}</DialogTitle>
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
            <FormControl fullWidth>
              <InputLabel id="parent-select-label">Parent Category (optional)</InputLabel>
              <Select
                labelId="parent-select-label"
                label="Parent Category (optional)"
                value={editingId && editingIsTopLevel ? '' : (form.parent_id ?? '')}
                disabled={!!editingId && editingIsTopLevel}
                onChange={(e) => {
                  const val = e.target.value as string;
                  setForm((s) => ({ ...s, parent_id: val || undefined }));
                }}
                displayEmpty
              >
                <MenuItem value="">
                  <em>None (Top-level)</em>
                </MenuItem>
                {parentOptions.map((p) => (
                  <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this category?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryManagement;
