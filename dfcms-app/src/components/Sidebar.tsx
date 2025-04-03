import * as React from "react";
import "./Sidebar.css";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/Cases";
import MailIcon from "@mui/icons-material/AdminPanelSettings";

type Anchor = "top" | "left" | "bottom" | "right";

export default function AnchorTemporaryDrawer() {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

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
        {["Cases", "Admin"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              onClick={() => {
                if (text === "Cases") {
                  window.location.href = "/dashboard"; // Redirect to the dashboard page
                }
              }}
            >
              <ListItemIcon>
                {index % 2 === 0 ? (
                  <InboxIcon sx={{ color: "#fff" }} /> // Light icon color
                ) : (
                  <MailIcon sx={{ color: "#fff" }} /> // Light icon color
                )}
              </ListItemIcon>
              <ListItemText primary={text} sx={{ color: "#fff" }} />{" "}
              {/* Light text color */}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      {(["left"] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Button className="button" onClick={toggleDrawer(anchor, true)}>
            {anchor}
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
