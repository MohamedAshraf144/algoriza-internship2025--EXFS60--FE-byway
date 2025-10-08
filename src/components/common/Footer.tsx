import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Link, 
  GridLegacy as Grid,
  Stack,
  IconButton,
  Divider
} from '@mui/material';
import { 
  School, 
  Facebook, 
  Twitter, 
  Instagram, 
  LinkedIn,
  Email,
  Phone,
  LocationOn
} from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'grey.900', 
        color: 'white', 
        py: 8, 
        mt: 'auto' 
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <School sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
              <Typography variant="h5" fontWeight="bold">
                Byway
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.8, lineHeight: 1.6 }}>
              Your gateway to learning. Discover thousands of courses from expert instructors 
              and transform your skills with our comprehensive learning platform.
            </Typography>
            <Stack direction="row" spacing={2}>
              <IconButton sx={{ color: 'white', '&:hover': { color: 'primary.main' } }}>
                <Facebook />
              </IconButton>
              <IconButton sx={{ color: 'white', '&:hover': { color: 'primary.main' } }}>
                <Twitter />
              </IconButton>
              <IconButton sx={{ color: 'white', '&:hover': { color: 'primary.main' } }}>
                <Instagram />
              </IconButton>
              <IconButton sx={{ color: 'white', '&:hover': { color: 'primary.main' } }}>
                <LinkedIn />
              </IconButton>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quick Links
            </Typography>
            <Stack spacing={2}>
              <Link 
                href="/courses" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  opacity: 0.8,
                  '&:hover': { opacity: 1, color: 'primary.main' },
                  transition: 'all 0.2s ease'
                }}
              >
                Browse Courses
              </Link>
              <Link 
                href="/instructors" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  opacity: 0.8,
                  '&:hover': { opacity: 1, color: 'primary.main' },
                  transition: 'all 0.2s ease'
                }}
              >
                Instructors
              </Link>
              <Link 
                href="/categories" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  opacity: 0.8,
                  '&:hover': { opacity: 1, color: 'primary.main' },
                  transition: 'all 0.2s ease'
                }}
              >
                Categories
              </Link>
              <Link 
                href="/about" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  opacity: 0.8,
                  '&:hover': { opacity: 1, color: 'primary.main' },
                  transition: 'all 0.2s ease'
                }}
              >
                About Us
              </Link>
            </Stack>
          </Grid>

          {/* Support */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Support
            </Typography>
            <Stack spacing={2}>
              <Link 
                href="/help" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  opacity: 0.8,
                  '&:hover': { opacity: 1, color: 'primary.main' },
                  transition: 'all 0.2s ease'
                }}
              >
                Help Center
              </Link>
              <Link 
                href="/contact" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  opacity: 0.8,
                  '&:hover': { opacity: 1, color: 'primary.main' },
                  transition: 'all 0.2s ease'
                }}
              >
                Contact Us
              </Link>
              <Link 
                href="/faq" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  opacity: 0.8,
                  '&:hover': { opacity: 1, color: 'primary.main' },
                  transition: 'all 0.2s ease'
                }}
              >
                FAQ
              </Link>
              <Link 
                href="/community" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  opacity: 0.8,
                  '&:hover': { opacity: 1, color: 'primary.main' },
                  transition: 'all 0.2s ease'
                }}
              >
                Community
              </Link>
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Contact Info
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Email sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  support@byway.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Phone sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocationOn sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  123 Learning Street, Education City, EC 12345
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, bgcolor: 'rgba(255,255,255,0.1)' }} />

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2
        }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {new Date().getFullYear()} Byway. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={4}>
            <Link 
              href="/privacy" 
              color="inherit" 
              underline="hover"
              sx={{ 
                opacity: 0.8,
                '&:hover': { opacity: 1, color: 'primary.main' },
                transition: 'all 0.2s ease'
              }}
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              color="inherit" 
              underline="hover"
              sx={{ 
                opacity: 0.8,
                '&:hover': { opacity: 1, color: 'primary.main' },
                transition: 'all 0.2s ease'
              }}
            >
              Terms of Service
            </Link>
            <Link 
              href="/cookies" 
              color="inherit" 
              underline="hover"
              sx={{ 
                opacity: 0.8,
                '&:hover': { opacity: 1, color: 'primary.main' },
                transition: 'all 0.2s ease'
              }}
            >
              Cookie Policy
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;