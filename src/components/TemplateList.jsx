import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Add as AddIcon,
  FitnessCenter as FitnessCenterIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTemplate } from '../contexts/TemplateContext';
import TemplateCard from './TemplateCard';

const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
const popularTags = ['Strength', 'Cardio', 'HIIT', 'Yoga', 'Core', 'Full Body'];

const TemplateList = ({ mode = 'personal' }) => {
  const {
    templates,
    publicTemplates,
    loading,
    hasMore,
    createTemplate,
    fetchPublicTemplates
  } = useTemplate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    difficulty: 'Beginner',
    duration: '30 mins',
    tags: [],
    exercises: []
  });

  useEffect(() => {
    if (mode === 'public') {
      fetchPublicTemplates();
    }
  }, [mode]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleTagClick = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleCreateTemplate = async () => {
    try {
      await createTemplate(newTemplate);
      setShowCreateDialog(false);
      setNewTemplate({
        name: '',
        description: '',
        difficulty: 'Beginner',
        duration: '30 mins',
        tags: [],
        exercises: []
      });
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const filterTemplates = (templateList) => {
    return templateList.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.every(tag => template.tags?.includes(tag));
      const matchesDifficulty = !selectedDifficulty ||
        template.difficulty === selectedDifficulty;

      return matchesSearch && matchesTags && matchesDifficulty;
    });
  };

  const displayedTemplates = filterTemplates(mode === 'public' ? publicTemplates : templates);

  return (
    <Box>
      {/* Search and Filters */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search templates..."
          variant="outlined"
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchQuery('')}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ pt: 1 }}>
            Difficulty:
          </Typography>
          {difficulties.map((difficulty) => (
            <Chip
              key={difficulty}
              label={difficulty}
              onClick={() => setSelectedDifficulty(
                selectedDifficulty === difficulty ? '' : difficulty
              )}
              color={selectedDifficulty === difficulty ? 'primary' : 'default'}
              variant={selectedDifficulty === difficulty ? 'filled' : 'outlined'}
            />
          ))}
        </Stack>

        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="subtitle2" sx={{ pt: 1 }}>
            Tags:
          </Typography>
          {popularTags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onClick={() => handleTagClick(tag)}
              color={selectedTags.includes(tag) ? 'primary' : 'default'}
              variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
            />
          ))}
        </Stack>
      </Box>

      {/* Create Template Button */}
      {mode === 'personal' && (
        <Box sx={{ mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowCreateDialog(true)}
            fullWidth
          >
            Create New Template
          </Button>
        </Box>
      )}

      {/* Template Grid */}
      {loading && displayedTemplates.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : displayedTemplates.length > 0 ? (
        <Grid container spacing={3}>
          <AnimatePresence>
            {displayedTemplates.map((template) => (
              <Grid item xs={12} sm={6} md={4} key={template.id}>
                <TemplateCard
                  template={template}
                  onEdit={() => {
                    setNewTemplate(template);
                    setShowCreateDialog(true);
                  }}
                />
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <FitnessCenterIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography color="text.secondary">
            {searchQuery || selectedTags.length > 0 || selectedDifficulty
              ? 'No templates match your filters'
              : mode === 'personal'
                ? 'Create your first workout template'
                : 'No public templates available'}
          </Typography>
        </Box>
      )}

      {/* Load More Button */}
      {hasMore && mode === 'public' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            onClick={() => fetchPublicTemplates(false)}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            Load More
          </Button>
        </Box>
      )}

      {/* Create/Edit Template Dialog */}
      <Dialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {newTemplate.id ? 'Edit Template' : 'Create Template'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Template Name"
              value={newTemplate.name}
              onChange={(e) => setNewTemplate(prev => ({
                ...prev,
                name: e.target.value
              }))}
              fullWidth
              required
            />

            <TextField
              label="Description"
              value={newTemplate.description}
              onChange={(e) => setNewTemplate(prev => ({
                ...prev,
                description: e.target.value
              }))}
              fullWidth
              multiline
              rows={3}
            />

            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={newTemplate.difficulty}
                onChange={(e) => setNewTemplate(prev => ({
                  ...prev,
                  difficulty: e.target.value
                }))}
                label="Difficulty"
              >
                {difficulties.map((difficulty) => (
                  <MenuItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Duration"
              value={newTemplate.duration}
              onChange={(e) => setNewTemplate(prev => ({
                ...prev,
                duration: e.target.value
              }))}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Tags</InputLabel>
              <Select
                multiple
                value={newTemplate.tags}
                onChange={(e) => setNewTemplate(prev => ({
                  ...prev,
                  tags: e.target.value
                }))}
                input={<OutlinedInput label="Tags" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {popularTags.map((tag) => (
                  <MenuItem key={tag} value={tag}>
                    {tag}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateTemplate}
            variant="contained"
            disabled={!newTemplate.name}
          >
            {newTemplate.id ? 'Save Changes' : 'Create Template'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TemplateList;
