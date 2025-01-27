import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
  Button,
  Slider,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  FitnessCenter as FitnessCenterIcon,
  Timer as TimerIcon,
  LocalFireDepartment as FireIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const exerciseTypes = [
  'Strength',
  'Cardio',
  'HIIT',
  'Yoga',
  'Stretching',
  'Core',
  'Recovery'
];

const intensityLevels = [
  'Light',
  'Moderate',
  'Intense',
  'Very Intense'
];

const sortOptions = [
  { value: 'date-desc', label: 'Latest First' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'duration-desc', label: 'Longest Duration' },
  { value: 'duration-asc', label: 'Shortest Duration' },
  { value: 'calories-desc', label: 'Most Calories' },
  { value: 'calories-asc', label: 'Least Calories' }
];

const WorkoutFilters = ({
  filters,
  onFilterChange,
  onSortChange,
  onClearFilters
}) => {
  const theme = useTheme();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleClearFilters = () => {
    onClearFilters();
    setShowAdvanced(false);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: 1,
        borderColor: 'divider',
        borderRadius: 2
      }}
    >
      {/* Search and Sort Row */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          placeholder="Search workouts..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: filters.search && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => handleFilterChange('search', '')}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={filters.sort}
            onChange={(e) => onSortChange(e.target.value)}
            label="Sort By"
          >
            {sortOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Exercise Types */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Exercise Types
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {exerciseTypes.map(type => (
            <Chip
              key={type}
              label={type}
              icon={<FitnessCenterIcon />}
              onClick={() => {
                const types = filters.types || [];
                handleFilterChange('types',
                  types.includes(type)
                    ? types.filter(t => t !== type)
                    : [...types, type]
                );
              }}
              color={filters.types?.includes(type) ? 'primary' : 'default'}
              variant={filters.types?.includes(type) ? 'filled' : 'outlined'}
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>
      </Box>

      {/* Intensity Levels */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Intensity
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {intensityLevels.map(level => (
            <Chip
              key={level}
              label={level}
              icon={<FireIcon />}
              onClick={() => {
                const levels = filters.intensity || [];
                handleFilterChange('intensity',
                  levels.includes(level)
                    ? levels.filter(l => l !== level)
                    : [...levels, level]
                );
              }}
              color={filters.intensity?.includes(level) ? 'primary' : 'default'}
              variant={filters.intensity?.includes(level) ? 'filled' : 'outlined'}
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>
      </Box>

      {/* Advanced Filters Toggle */}
      <Button
        onClick={() => setShowAdvanced(!showAdvanced)}
        startIcon={showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        endIcon={<FilterListIcon />}
        sx={{ mb: 2 }}
      >
        Advanced Filters
      </Button>

      {/* Advanced Filters */}
      <Collapse in={showAdvanced}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Duration Range */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Duration (minutes)
            </Typography>
            <Box sx={{ px: 2 }}>
              <Slider
                value={filters.duration || [0, 180]}
                onChange={(_, value) => handleFilterChange('duration', value)}
                valueLabelDisplay="auto"
                min={0}
                max={180}
                marks={[
                  { value: 0, label: '0' },
                  { value: 60, label: '60' },
                  { value: 120, label: '120' },
                  { value: 180, label: '180+' }
                ]}
              />
            </Box>
          </Box>

          {/* Calories Range */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Calories Burned
            </Typography>
            <Box sx={{ px: 2 }}>
              <Slider
                value={filters.calories || [0, 1000]}
                onChange={(_, value) => handleFilterChange('calories', value)}
                valueLabelDisplay="auto"
                min={0}
                max={1000}
                marks={[
                  { value: 0, label: '0' },
                  { value: 250, label: '250' },
                  { value: 500, label: '500' },
                  { value: 750, label: '750' },
                  { value: 1000, label: '1000+' }
                ]}
              />
            </Box>
          </Box>
        </Box>
      </Collapse>

      {/* Clear Filters */}
      {(filters.search || filters.types?.length > 0 || filters.intensity?.length > 0 ||
        filters.duration || filters.calories) && (
        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <Button
            variant="outlined"
            onClick={handleClearFilters}
            startIcon={<ClearIcon />}
          >
            Clear All Filters
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default WorkoutFilters;
