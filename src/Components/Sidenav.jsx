import * as React from "react";
import { useState, useEffect } from "react";
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
import Collapse from "@mui/material/Collapse";
import DashboardIcon from "@mui/icons-material/Dashboard";
import WarningIcon from "@mui/icons-material/Warning";
import BuildIcon from "@mui/icons-material/Build";
import ComputerIcon from "@mui/icons-material/Computer";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ListIcon from "@mui/icons-material/List";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ConstructionIcon from "@mui/icons-material/Construction";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";
import { useNavigate, useLocation } from "react-router-dom";
import useAppStore from "../appStore";

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

export default function Sidenav() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const open = useAppStore((state) => state.dopen);
  const [openSubMenu, setOpenSubMenu] = React.useState(false);
  const [menuItems, setMenuItems] = useState([]);

  const isSelected = (path) => location.pathname === path;

  useEffect(() => {
    const items = [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
      {
        text: "Incident",
        icon: <WarningIcon />,
        subItems: [
          { text: "Create Incident", icon: <AddCircleOutlineIcon />, path: "/incident/create" },
          { text: "View Incidents", icon: <ListIcon />, path: "/incident/view" },
        ],
      },
      {
        text: "Service",
        icon: <BuildIcon />,
        subItems: [
          { text: "Create Service", icon: <AddCircleOutlineIcon />, path: "/service/create" },
          { text: "View Services", icon: <ListIcon />, path: "/service/view" },
        ],
      },
      {
        text: "Assets",
        icon: <ComputerIcon />,
        subItems: [
          { text: "Assign Assets", icon: <AddCircleOutlineIcon />, path: "/assets/assign" },
        ],
      },
    ];
    
    setMenuItems(items);
  }, [location.pathname]);

  const renderMenuItem = (item, depth = 0) => {
    const isItemSelected = isSelected(item.path);
    const isSubMenu = item.subItems && item.subItems.length > 0;
    const isSubMenuSelected =
      isSubMenu && item.subItems.some((subItem) => isSelected(subItem.path));

    if (!open) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          Loading...
        </Box>
      );
    }

    return (
      <React.Fragment key={item.text}>
        <ListItem
          disablePadding
          sx={{ display: "block", marginBottom: "10px" }}
          onClick={() => {
            if (isSubMenu) {
              setOpenSubMenu(!openSubMenu);
            } else {
              navigate(item.path);
            }
          }}
        >
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
              position: "relative",
              overflow: "hidden",
              fontSize: "0.875rem",
              color: isItemSelected || isSubMenuSelected ? "white" : "inherit",
              pl: depth * 4 + 2.5,
              "&:hover": {
                backgroundColor: "transparent",
                color: "white",
              },
              "&:hover .hoverBox, &.Mui-selected .hoverBox": {
                backgroundColor: "#4880FF",
              },
              "&:hover .hoverLine, &.Mui-selected .hoverLine": {
                visibility: "visible",
              },
              "&:hover .MuiListItemIcon-root, &:hover .MuiListItemText-root": {
                color: "white",
              },
            }}
            selected={isItemSelected || isSubMenuSelected}
          >
            <Box
              className="hoverBox"
              sx={{
                position: "absolute",
                top: 0,
                left: "20px",
                right: "10px",
                bottom: 0,
                backgroundColor:
                  isItemSelected || isSubMenuSelected
                    ? "#4880FF"
                    : "transparent",
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
                visibility:
                  isItemSelected || isSubMenuSelected ? "visible" : "hidden",
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
                color:
                  isItemSelected || isSubMenuSelected ? "white" : "inherit",
                transition: "color 0.3s",
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
                color:
                  isItemSelected || isSubMenuSelected ? "white" : "inherit",
                transition: "color 0.3s",
              }}
            />
            {isSubMenu &&
              (open ? openSubMenu ? <ExpandLess /> : <ExpandMore /> : null)}
          </ListItemButton>
        </ListItem>
        {isSubMenu && (
          <Collapse in={openSubMenu && open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.subItems.map((subItem) =>
                renderMenuItem(subItem, depth + 1)
              )}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
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
        <List>{menuItems.map((item) => renderMenuItem(item))}</List>
      </Drawer>
    </Box>
  );
}
