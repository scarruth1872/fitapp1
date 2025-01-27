import { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Button,
  Avatar,
  Box,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Public as PublicIcon,
  Lock as LockIcon,
  FitnessCenter as FitnessCenterIcon,
  Timer as TimerIcon,
  LocalFireDepartment as FireIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useTemplate } from '../contexts/TemplateContext';
import { useAuth } from '../contexts/AuthContext';

const TemplateCard = ({ template, onEdit }) => {
  const theme = useTheme();
  const { currentUser } = useAuth();
  const { toggleLike, toggleSave, togglePublic, deleteTemplate } = useTemplate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const isOwner = template.userId === currentUser?.uid;

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    try {
      await deleteTemplate(template.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  const handleTogglePublic = async () => {
    try {
      await togglePublic(template.id);
      handleMenuClose();
    } catch (error) {
      console.error('Error toggling template publicity:', error);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <Card
        elevation={0}
        sx={{
          border: 1,
          borderColor: 'divider',
          '&:hover': {
            boxShadow: theme.shadows[4]
          },
          transition: 'box-shadow 0.3s ease-in-out'
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              src={template.userPhotoURL}
              alt={template.userDisplayName}
              sx={{ mr: 1 }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1">
                {template.userDisplayName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDistanceToNow(new Date(template.createdAt), { addSuffix: true })}
              </Typography>
            </Box>
            {isOwner && (
              <>
                <IconButton onClick={handleMenuClick}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => {
                    handleMenuClose();
                    onEdit(template);
                  }}>
                    <ListItemIcon>
                      <EditIcon fontSize="small" />
                    </ListItemIcon>
                    Edit
                  </MenuItem>
                  <MenuItem onClick={handleTogglePublic}>
                    <ListItemIcon>
                      {template.isPublic ? (
                        <LockIcon fontSize="small" />
                      ) : (
                        <PublicIcon fontSize="small" />
                      )}
                    </ListItemIcon>
                    {template.isPublic ? 'Make Private' : 'Make Public'}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      setShowDeleteDialog(true);
                    }}
                    sx={{ color: 'error.main' }}
                  >
                    <ListItemIcon>
                      <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    Delete
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>

          <Typography variant="h6" gutterBottom>
            {template.name}
          </Typography>

          <Typography variant="body2" color="text.secondary" paragraph>
            {template.description}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip
              icon={<FitnessCenterIcon />}
              label={`${template.exercises.length} exercises`}
              size="small"
            />
            <Chip
              icon={<TimerIcon />}
              label={template.duration}
              size="small"
            />
            {template.difficulty && (
              <Chip
                icon={<FireIcon />}
                label={template.difficulty}
                size="small"
                color={
                  template.difficulty === 'Beginner' ? 'success' :
                  template.difficulty === 'Intermediate' ? 'warning' :
                  'error'
                }
              />
            )}
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {template.tags?.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        </CardContent>

        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          <Box>
            <IconButton
              onClick={() => toggleLike(template.id)}
              color={template.likes?.includes(currentUser?.uid) ? 'error' : 'default'}
            >
              {template.likes?.includes(currentUser?.uid) ? (
                <FavoriteIcon />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
            <IconButton
              onClick={() => toggleSave(template.id)}
              color={template.saves?.includes(currentUser?.uid) ? 'primary' : 'default'}
            >
              {template.saves?.includes(currentUser?.uid) ? (
                <BookmarkIcon />
              ) : (
                <BookmarkBorderIcon />
              )}
            </IconButton>
            <IconButton>
              <ShareIcon />
            </IconButton>
          </Box>

          <Button
            variant="contained"
            startIcon={<FitnessCenterIcon />}
            size="small"
          >
            Start Workout
          </Button>
        </CardActions>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      >
        <DialogTitle>Delete Template</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this workout template? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default TemplateCard;
