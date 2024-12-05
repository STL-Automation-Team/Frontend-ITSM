import * as React from "react";
import { useState, useEffect } from "react";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Button, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "./AxiosInstance";
import useAppStore from "../appStore";
import { useAuth } from "./AuthProvider";
import Logo from "../Images/STLLogo.png";

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 32,
  height: 32,
  fontSize: "1rem",
  backgroundColor: theme.palette.primary.main,
}));

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [userName, setUserName] = useState("");
  const { userRoles } = useAuth(); // Fetch role from AuthProvider
  const [role, setRole] = useState(userRoles.join(", ")); // Assuming multiple roles

  const updateOpen = useAppStore((state) => state.updateOpen);
  const dopen = useAppStore((state) => state.dopen);

  const navigate = useNavigate();
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  useEffect(() => {
    const fetchUserData = async () => {
      const contactId = localStorage.getItem("contact_id");
      console.log(contactId);
      if (contactId) {
        try {
          const response = await AxiosInstance.get(`http://10.100.130.76:3000/contact/${contactId}`);
          console.log(response);
          const userData = response.data.name; // Assuming the first result is correct
          console.log(userData);
          if (userData) {
            setUserName(userData); // Set the username from response
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleLogout = async () => {
    try {
      await AxiosInstance.post("/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("contact_id");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menuId = "primary-search-account-menu";
  console.log("hi",userName);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ backgroundColor: "white", boxShadow: "none" }}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            <img
              src={Logo}
              alt="Logo"
              style={{ height: "25px", width: "auto", marginRight: "1rem", marginTop: "5px" }}
            />
          </Typography>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2, color: "black" }}
            onClick={() => updateOpen(!dopen)}
          >
            <MenuIcon />
          </IconButton>
          <Search
            sx={{ color: "black", border: "0.5px solid #D5D5D5", backgroundColor: "#F5F6FA" }}
          >
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Search…" inputProps={{ "aria-label": "search" }} />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", marginRight:"0.5rem" }}>
          <Typography variant="subtitle1" color="black" sx={{ fontWeight: "bold", marginRight: 2, fontSize:'0.9rem' }}>
              {userName.toUpperCase()}
              <br />
              {role}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                marginRight: '1rem'
              }}
              onClick={handleProfileMenuOpen}
            >
              <UserAvatar sx={{marginRight:'1rem'}}>{userName.charAt(0).toUpperCase()}</UserAvatar>
              
              <ArrowDropDownIcon sx={{ color: "black", ml: 0.5 }} />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
