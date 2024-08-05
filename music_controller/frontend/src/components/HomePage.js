import React, { useState, useEffect } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Room from "./Room";
import { Grid, Typography, ButtonGroup, Button } from "@mui/material";
import Info from "./Info"

const HomePage = () => {
  const [roomCode, setRoomCode] = useState(null);

  useEffect(() => {
    const fetchRoomCode = async () => {
      try {
        const response = await fetch("/user-in-room");
        if (!response.ok) {
          throw new Error("Room not found");
        }
        const data = await response.json();
        setRoomCode(data.code);
      } catch (error) {
        console.error("Error fetching room code:", error);
      }
    };

    fetchRoomCode();
  }, []);

  const clearRoomCode = () => {
    setRoomCode(null);
  };

  const renderHomePage = () => {
    return (
      <Grid container 
          spacing={3} 
          direction="column" 
          alignItems="center" 
          justifyContent="center" 
          style={{ minHeight: '100vh' }}>
      <Grid item>
        <Typography variant="h3" component="h3" align="center">
          House Party
        </Typography>
      </Grid>
      <Grid item>
        <ButtonGroup
          disableElevation
          variant="contained"
          aria-label=""
        >
          <Button sx={{backgroundColor:"#FFA500 "}} to="/join" component={Link}>
            Join a Room
          </Button>
          <Button sx={{backgroundColor:"#C75B7A "}} to="/info" component={Link}>
            Info
          </Button>
          <Button sx={{backgroundColor:"#B43F3F "}} to="/create" component={Link}>
            Create a Room
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
};

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            roomCode ? <Navigate to={`/room/${roomCode}`} /> : renderHomePage()
          }
        />
        <Route path="/join" element={<RoomJoinPage />} />
        <Route path="/info" element={<Info />}/>

        <Route path="/create" element={<CreateRoomPage />} />
        <Route
          path="/room/:roomCode"
          element={<Room leaveRoomCallback={clearRoomCode} />}
        />
      </Routes>
    </Router>
  );
};

export default HomePage;
