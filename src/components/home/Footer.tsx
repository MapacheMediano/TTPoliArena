// src/components/home/Footer.tsx
'use client';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';

const socialLinks = [
  { icon: <FacebookIcon />, label: 'Facebook', url: '#' },
  { icon: <LinkedInIcon />, label: 'LinkedIn', url: '#' },
  { icon: <YouTubeIcon />, label: 'YouTube', url: '#' },
  { icon: <InstagramIcon />, label: 'Instagram', url: '#' },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1A0A10',
        borderTop: '1px solid rgba(123, 30, 59, 0.2)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {/* Logo y texto */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <SportsEsportsIcon sx={{ fontSize: 28, color: '#D4A84B' }} />
            <Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #D4A84B 0%, #E0C078 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                PoliArena
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Instituto Politécnico Nacional — ESCOM
              </Typography>
            </Box>
          </Box>

          {/* Redes sociales */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
              Redes sociales
            </Typography>
            {socialLinks.map((social) => (
              <IconButton
                key={social.label}
                href={social.url}
                size="small"
                sx={{
                  color: '#C4B0B8',
                  '&:hover': {
                    color: '#D4A84B',
                    backgroundColor: 'rgba(212, 168, 75, 0.1)',
                  },
                }}
                aria-label={social.label}
              >
                {social.icon}
              </IconButton>
            ))}
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(123, 30, 59, 0.15)', my: 2 }} />

        <Typography variant="caption" color="text.secondary" align="center" display="block">
          © 2025 PoliArena — Trabajo Terminal ESCOM-IPN. Todos los derechos reservados.
        </Typography>
      </Container>
    </Box>
  );
}