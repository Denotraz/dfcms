import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

interface BasicButtonsProps {
  onClick: () => void;
}

export default function BasicButtons({ onClick }: BasicButtonsProps) {
  return (
    <Stack spacing={2} direction="row">
      <Button variant="contained" onClick={onClick}>
        Login
      </Button>
    </Stack>
  );
}
