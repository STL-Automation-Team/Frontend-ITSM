import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import WarningIcon from "@mui/icons-material/Warning";
import BuildIcon from "@mui/icons-material/Build";
import ComputerIcon from "@mui/icons-material/Computer";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ListIcon from "@mui/icons-material/List";
import { useNavigate, useLocation } from "react-router-dom";
import useAppStore from "../appStore";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";



const drawerWidth = 250;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  {
    text: "Incident",
    icon: <WarningIcon />,
    children: [
      { text: "Create Incident", icon: <AddCircleOutlineIcon />, path: "/incident/create" },
      { text: "View Incidents", icon: <ListIcon />, path: "/incident/view" },
    ],
  },
  {
    text: "Service",
    icon: <BuildIcon />,
    children: [
      { text: "Create Service", icon: <AddCircleOutlineIcon />, path: "/service/create" },
      { text: "View Services", icon: <ListIcon />, path: "/service/view" },
    ],
  },
  {
    text: "Assets",
    icon: <ComputerIcon />,
    children: [
      { text: "Assign Assets", icon: <AddCircleOutlineIcon />, path: "/assets/assign" },
    ],
  },
];

export default function Sidenav() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const open = useAppStore((state) => state.dopen);
  const [openSubMenu, setOpenSubMenu] = React.useState({});

  const handleClick = (item) => {
    if (item.children) {
      setOpenSubMenu((prevState) => ({
        ...prevState,
        [item.text]: !prevState[item.text],
      }));
    } else {
      navigate(item.path);
    }
  };

  const renderMenuItems = (items, depth = 0) => {
    return items.map((item) => {
      const isSelected = location.pathname === item.path;
      const isSubMenu = item.children && item.children.length > 0;

      return (
        <React.Fragment key={item.text}>
          <ListItem
            disablePadding
            sx={{ display: "block" }}
          >
            <ListItemButton
              onClick={() => handleClick(item)}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                position: "relative",
                overflow: "hidden",
                fontSize: "0.875rem",
                color: isSelected ? "white" : "inherit",
                pl: depth * 4 + 2.5,
                "&:hover": {
                  backgroundColor: "transparent",
                },
                "&:hover .hoverBox, &.Mui-selected .hoverBox": {
                  backgroundColor: "#4880FF",
                },
                "&:hover .hoverLine, &.Mui-selected .hoverLine": {
                  visibility: "visible",
                },
              }}
              selected={isSelected}
            >
              <Box
                className="hoverBox"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: "20px",
                  right: "10px",
                  bottom: 0,
                  backgroundColor: isSelected ? "#4880FF" : "transparent",
                  borderRadius: 4,
                  transition: "background-color 0.3s",
                }}
              />
              <Box
                className="hoverLine"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  width: 4,
                  backgroundColor: "#4880FF",
                  borderRadius: "0 4px 4px 0",
                  zIndex: 1,
                  visibility: isSelected ? "visible" : "hidden",
                }}
              />
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 1.5 : "auto",
                  ml: open ? 1.5 : "auto",
                  justifyContent: "center",
                  position: "relative",
                  zIndex: 2,
                  "& svg": {
                    fontSize: "1.2rem",
                  },
                  color: isSelected ? "white" : "inherit",
                  "&:hover": {
                    color: "white",
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  opacity: open ? 1 : 0,
                  zIndex: 2,
                  "& .MuiTypography-root": {
                    fontSize: "0.90rem",
                  },
                  color: isSelected ? "white" : "inherit",
                  "&:hover": {
                    backgroundColor: "transparent",
                    color: "white",
                  },
                }}
              />
              {isSubMenu && (openSubMenu[item.text] ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
          </ListItem>
          {isSubMenu && (
            <Collapse in={openSubMenu[item.text]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderMenuItems(item.children, depth + 1)}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <Box sx={{ display: "flex", border: "white" }}>
      <CssBaseline />
      <Drawer variant="permanent" open={open} sx={{ border: "white" }}>
        <DrawerHeader>
          <IconButton>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {renderMenuItems(menuItems)}
        </List>
      </Drawer>
    </Box>
  );
}