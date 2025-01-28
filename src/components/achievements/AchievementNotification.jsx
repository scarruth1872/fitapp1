import React, { forwardRef } from 'react';
import {
  Snackbar,
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Button,
  Slide,
  useTheme
} from '@mui/material';
import {
  Close as CloseIcon,
  Share as ShareIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import Confetti from 'react-confetti';
import { motion, AnimatePresence } from 'framer-motion';

const SlideTransition = forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const AchievementAnimation = ({ children }) => (
  <motion.div
    initial={{ scale: 0.5, opacity: 0 }}
    animate={{ 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }}
    exit={{ scale: 0.5, opacity: 0 }}
  >
    {children}
  </motion.div>
);

const AchievementNotification = ({
  open,
  achievement,
  onClose,
  onShare,
  position = { vertical: 'bottom', horizontal: 'center' }
}) => {
  const theme = useTheme();

  if (!achievement) return null;

  const handleShare = (event) => {
    event.stopPropagation();
    onShare(achievement);
  };

  return (
    <>
      {open && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
          colors={[
            theme.palette.primary.main,
            theme.palette.secondary.main,
            theme.palette.success.main,
            '#FFD700', // Gold
            '#FFA500', // Orange
          ]}
        />
      )}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={onClose}
        anchorOrigin={position}
        TransitionComponent={SlideTransition}
      >
        <AnimatePresence>
          <AchievementAnimation>
            <Card
              sx={{
                minWidth: 300,
                maxWidth: 400,
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: theme.shadows[10],
                border: `2px solid ${theme.palette.primary.main}`,
                position: 'relative',
                overflow: 'visible'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: -20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: theme.shadows[5],
                }}
              >
                <TrophyIcon sx={{ color: 'white' }} />
              </Box>

              <CardContent sx={{ pt: 4 }}>
                <Box textAlign="center" mb={2}>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      color: theme.palette.primary.contrastText,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                    }}
                  >
                    Achievement Unlocked!
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: theme.palette.primary.contrastText,
                      mt: 1,
                      fontWeight: 'bold',
                    }}
                  >
                    {achievement.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.primary.contrastText,
                      opacity: 0.9,
                      mt: 1,
                    }}
                  >
                    {achievement.description}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 2,
                  }}
                >
                  <Button
                    size="small"
                    startIcon={<ShareIcon />}
                    onClick={handleShare}
                    sx={{
                      color: theme.palette.primary.contrastText,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    Share
                  </Button>
                  <IconButton
                    size="small"
                    onClick={onClose}
                    sx={{
                      color: theme.palette.primary.contrastText,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </AchievementAnimation>
        </AnimatePresence>
      </Snackbar>
    </>
  );
};

export default AchievementNotification;
