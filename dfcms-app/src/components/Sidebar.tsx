import * as React from "react";
import "./Sidebar.css";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/Cases";
import MailIcon from "@mui/icons-material/AdminPanelSettings";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

type Anchor = "top" | "left" | "bottom" | "right";

export default function AnchorTemporaryDrawer() {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const navigate = useNavigate();
  const [userRole, setUserRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserRole(parsedUser.role);
    }
  }, []);

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: Anchor) => (
    <Box
      sx={{
        width: anchor === "top" || anchor === "bottom" ? "auto" : 250,
        backgroundColor: "#333", // Dark background color
        color: "#fff", // Light text color
        height: "100%", // Ensure it covers the full height
      }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {/* Always show "Cases" */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/dashboard")}>
            <ListItemIcon>
              <InboxIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Cases" sx={{ color: "#fff" }} />
          </ListItemButton>
        </ListItem>

        {/* Only show "Admin" if user is a DBA */}
        {userRole === "dba" && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/admin")}>
              <ListItemIcon>
                <MailIcon sx={{ color: "#fff" }} />
              </ListItemIcon>
              <ListItemText primary="Admin" sx={{ color: "#fff" }} />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <div>
      {(["left"] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Button className="button" onClick={toggleDrawer(anchor, true)}>
            <MenuIcon />
          </Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
