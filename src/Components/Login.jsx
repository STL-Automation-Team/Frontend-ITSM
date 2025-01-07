import React, {useState} from "react";
import { Box, Typography, TextField, Button, Link, Paper, Snackbar, Alert } from "@mui/material";
import { styled } from "@mui/material/styles";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import animationData from "../Images/LoginAnimation1.json";
import STLLogo from '../Images/STLLogo.png';
import Loginbg1 from '../Images/Loginbg1.png';
import { AuthProvider, useAuth } from "./AuthProvider";

// All styled components remain the same...
const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage: `url(${Loginbg1})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

const LoginPaper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  width: '80%',
  maxWidth: '1200px',
  minHeight: '600px',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
}));

const LoginForm = styled(Box)(({ theme }) => ({
  width: '50%',
  padding: theme.spacing(6),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const IllustrationBox = styled(Box)(({ theme }) => ({
  width: '50%',
  backgroundColor: '#2196f3',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
  },
}));

const LoginButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: '10px',
  padding: theme.spacing(1.5),
  fontWeight: 'bold',
}));

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ type: "", content: "" });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      // Create a FormData object and append the login parameters
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
  
      const response = await fetch('http://10.100.130.76:3000/api/v1/auth/login', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Use the login function from auth context
        await login(data.access_token);
        localStorage.setItem('contact_id', data.contact_id);
  
        setMessage({ type: "success", content: "Login successful!" });
  
        setTimeout(() => {
          navigate('/incident/dashboard');
        }, 1500);
      } else {
        setMessage({ type: "error", content: data.message || "Login failed. Please try again." });
      }
    } catch (error) {
      setMessage({ type: "error", content: "An error occurred. Please try again later." });
    }
  };
  

  const handleCloseSnackbar = () => {
    setMessage({ type: "", content: "" });
  };


  return (
    <PageContainer>
      <LoginPaper elevation={3}>
        <LoginForm component="form" onSubmit={handleLogin}>
          <img src={STLLogo} alt="Logo" style={{ width: '9rem' }} />
          <Box height={40} />
          <Typography variant="h4">Welcome,</Typography>
          <Box height={20} />
          <Typography variant="h5">Sign in to continue!</Typography>
          <Box height={20} />
          <StyledTextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <StyledTextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <LoginButton type="submit" variant="contained" color="primary" fullWidth>
            LOGIN
          </LoginButton>
          <Link href="#" color="primary" align="center" mt={2}>
            Forgot password?
          </Link>
        </LoginForm>
        <IllustrationBox>
          <Lottie
            animationData={animationData}
            loop={true}
            autoplay={true}
            style={{ width: 700, height: 700 }} 
          />
        </IllustrationBox>
      </LoginPaper>
      <Snackbar open={!!message.content} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={message.type} sx={{ width: '100%' }}>
          {message.content}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default LoginPage;