import React from "react";
import {
  Grid,
  Typography,
  Card,
  IconButton,
  LinearProgress,
  Box,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";

const MusicPlayer = (props) => {
  const songProgress = (props.time / props.duration) * 100;

  const skipSong = async () => {
    try {
      const response = await fetch("/spotify/skip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Failed to skip song:", error);
    }
  };

  const playSong = async () => {
    try {
      const response = await fetch("/spotify/play", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Failed to play song:", error);
    }
  };

  const pauseSong = async () => {
    try {
      const response = await fetch("/spotify/pause", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Failed to pause song:", error);
    }
  };

  const previousSong = async () => {
    try {
      const response = await fetch("/spotify/previous", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Failed to play previous song:", error);
    }
  };

  return (
    <Card
      sx={{
        backgroundColor: "#1E1E1E",
        color: "#E0E0E0",
        padding: 3,
        borderRadius: 4,
        boxShadow: 4,
        maxWidth: "600px",
        margin: "auto",
      }}
    >
      <Grid container alignItems="center" spacing={3}>
        <Grid item xs={12} sm={4} sx={{ display: "flex", justifyContent: "center" }}>
          <img
            src={props.image_url}
            alt="Album cover"
            style={{
              borderRadius: "10px",
              width: "100%",
              height: "auto",
              border: "3px solid #E0E0E0",
              boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            }}
          />
        </Grid>
        <Grid item xs={12} sm={8} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Box sx={{ textAlign: "center", marginBottom: 3 }}>
            <Typography component="h5" variant="h5" sx={{ fontWeight: 600 }}>
              {props.title}
            </Typography>
            <Typography color="#B0B0B0" variant="subtitle1"> {/* Açık gri renk */}
              {props.artist}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 2 }}>
            <IconButton
              onClick={previousSong}
              sx={{ color: "#E0E0E0", '&:hover': { color: "#FF5722" }, margin: 1 }}
            >
              <SkipPreviousIcon />
            </IconButton>
            <IconButton
              onClick={() => (props.is_playing ? pauseSong() : playSong())}
              sx={{ color: "#E0E0E0", '&:hover': { color: "#FF5722" }, margin: 1 }}
            >
              {props.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton
              onClick={skipSong}
              sx={{ color: "#E0E0E0", '&:hover': { color: "#FF5722" }, margin: 1 }}
            >
              <SkipNextIcon />
              <Typography sx={{ marginLeft: 1 }}>
                {props.votes} / {props.votes_required}
              </Typography>
            </IconButton>
          </Box>
        </Grid>
      </Grid>
      <LinearProgress
        variant="determinate"
        value={songProgress}
        sx={{
          marginTop: 3,
          height: 6,
          borderRadius: 3,
          backgroundColor: "#424242",
          '& .MuiLinearProgress-bar': {
            backgroundColor: "#FF5722",
          }
        }}
      />
    </Card>
  );
};

export default MusicPlayer;
