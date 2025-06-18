import React from "react";
import {
  TextField,
  Button,
  Typography,
  Link,
  Container,
  Box,
} from "@mui/material";
import { useLoginLogic } from "./useLoginLogic";

const LoginView: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    onSubmit,
  } = useLoginLogic();

  return (
    <Container maxWidth="xs">
      <Typography
        component="h1"
        variant="h4"
        align="center"
        sx={{ mb: 2, mt: 6 }}
      >
        Log In
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ mt: 1 }}
      >
        <TextField
          {...register("email")}
          variant="outlined"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          error={!!errors.email}
          helperText={errors.email?.message}
          sx={{ mb: 2 }}
        />
        <TextField
          {...register("password")}
          variant="outlined"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          error={!!errors.password}
          helperText={errors.password?.message}
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2, mb: 2 }}
        >
          Log In
        </Button>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
          <Link href="/signup" variant="body2">
            Don't have an account? Sign Up
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginView;
