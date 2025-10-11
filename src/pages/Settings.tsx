import React from 'react';
import { Box, Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CategoryIcon from '@mui/icons-material/Category';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const Settings: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Category',
      description: 'Manage categories and subcategories',
      icon: <CategoryIcon fontSize="large" color="primary" />,
      onClick: () => navigate('/admin/settings/categories'),
    },
    {
      title: 'PDFs',
      description: 'Manage PDFs for courses',
      icon: <PictureAsPdfIcon fontSize="large" color="primary" />,
      onClick: () => navigate('/admin/settings/pdfs'),
    },
    {
      title: 'Courses',
      description: 'Manage courses (CRUD)',
      icon: <CategoryIcon fontSize="large" color="primary" />,
      onClick: () => navigate('/admin/settings/courses'),
    },
    // Add more action cards here if needed
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Settings
      </Typography>
      <Grid container spacing={2}>
        {actions.map((a) => (
          <Grid item xs={12} sm={6} md={4} key={a.title}>
            <Card elevation={3}>
              <CardActionArea onClick={a.onClick}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {a.icon}
                    <Box>
                      <Typography variant="h6">{a.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {a.description}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Settings;
