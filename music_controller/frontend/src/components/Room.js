import { Button, Grid, Typography, Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

const Room = ({ leaveRoomCallback }) => {
  const { roomCode } = useParams();
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [song, setSong] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchData(roomCode);
    const interval = setInterval(getCurrentSong, 1000);
    return () => clearInterval(interval);
  }, [roomCode]);

  const fetchData = async (code) => {
    try {
      const response = await fetch(`/get-room?code=${code}`);
      if (!response.ok) {
        leaveRoomCallback();
        navigate("/");
        return;
      }
      const data = await response.json();
      setVotesToSkip(data.votes_to_skip);
      setGuestCanPause(data.guest_can_pause);
      setIsHost(data.is_host);
      if (data.is_host) {
        authenticateSpotify();
      }
    } catch (error) {
      console.error("Error fetching room data:", error.message);
    }
  };

  const authenticateSpotify = async () => {
    try {
      const response = await fetch("/spotify/is-authenticated");
      const data = await response.json();
      setSpotifyAuthenticated(data.status);
      if (!data.status) {
        const authResponse = await fetch("/spotify/get-auth-url");
        const authData = await authResponse.json();
        window.location.replace(authData.url);
      }
    } catch (error) {
      console.error("Error during Spotify authentication:", error);
    }
  };

  const getCurrentSong = async () => {
    try {
      const response = await fetch("/spotify/current-song");
      if (!response.ok) {
        setSong({});
        return;
      }

      // Check if response body is empty
      const responseText = await response.text();
      if (responseText.trim() === "") {
        setSong({});
        return;
      }

      const data = JSON.parse(responseText);
      setSong(data);
    } catch (error) {
      console.error("Error fetching the current song:", error);
      setSong({});
    }
  };

  const leaveButtonPressed = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    try {
      const response = await fetch("/leave-room", requestOptions);
      if (response.ok) {
        leaveRoomCallback();
        navigate("/");
      } else {
        console.error("Failed to leave room");
      }
    } catch (error) {
      console.error("Error leaving room:", error);
    }
  };

  const updateShowSettings = (value) => {
    setShowSettings(value);
  };

  const renderSettings = () => (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} md={8} align="center">
        <CreateRoomPage
          update={true}
          votesToSkip={votesToSkip}
          guestCanPause={guestCanPause}
          roomCode={roomCode}
          updateCallback={() => fetchData(roomCode)}
        />
      </Grid>
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => updateShowSettings(false)}
          sx={{ mt: 2 }}
        >
          Close
        </Button>
      </Grid>
    </Grid>
  );

  const renderSettingsButton = () => (
    <Grid item xs={12} align="center">
      <Button
        variant="contained"
        sx={{ mt: 2, backgroundColor: '#914F1E', '&:hover': { backgroundColor: '#FFA500' } }}
        onClick={() => updateShowSettings(true)}
      >
        Settings
      </Button>
    </Grid>
  );

  if (showSettings) {
    return renderSettings();
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '70vh',
        padding: 3,
       
        color: '#E0E0E0', // Light text color
      }}
    >
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="h4" component="h4" sx={{ fontWeight: 600 }}>
          Room Code: {roomCode}
        </Typography>
      </Box>
      <MusicPlayer {...song} />
      {isHost ? renderSettingsButton() : null}
      <Box sx={{ marginTop: 2 }}>
        <Button
          variant="contained"
          onClick={leaveButtonPressed}
          sx={{ backgroundColor:"#FFA500 ", color: '#FFFFFF', '&:hover': { backgroundColor: '#C62828' } }}
        >
          Leave Room
        </Button>
      </Box>
    </Box>
  );
};

export default Room;
