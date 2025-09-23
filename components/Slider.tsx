"use client";

import React, { useRef, useState, useEffect } from "react";

const Slider = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
    };

    const updatePlayState = () => {
      setIsPlaying(!video.paused);
    };

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateTime);
    video.addEventListener("play", updatePlayState);
    video.addEventListener("pause", updatePlayState);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateTime);
      video.removeEventListener("play", updatePlayState);
      video.removeEventListener("pause", updatePlayState);
    };
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    video.currentTime = percentage * video.duration;
  };

  return (
    <div className="relative w-full h-96 max-h-96 overflow-hidden -mt-4">
      {/* Vidéo unique */}
      <video
        ref={videoRef}
        src="/yodi.mp4"
        className="w-full h-full object-cover"
        muted
        loop
        playsInline
        autoPlay
        onError={(e) => {
          console.error("Erreur de chargement de la vidéo:", e);
        }}
      >
        Votre navigateur ne supporte pas la lecture de vidéos.
      </video>
    </div>
  );
};

export default Slider;
