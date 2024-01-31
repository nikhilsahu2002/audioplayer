import React, { useState, useRef, useEffect } from "react";
import "../Styles/List.css";

export default function Home() {
  const [selectedFileNames, setSelectedFileNames] = useState([]);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [isplaying, setisplaying] = useState(false);
  const audioRef = useRef();

  useEffect(() => {
    if (audioRef.current && playingIndex !== null) {
      audioRef.current.src = selectedFileNames[playingIndex].url;
      audioRef.current.play();
      audioRef.current.addEventListener("ended", handleSongEnd);
    }

    return () => {
      audioRef.current.removeEventListener("ended", handleSongEnd);
    };
  }, [playingIndex, selectedFileNames]);

  const handleFileUpload = (event) => {
    const files = event.target.files;

    if (files.length > 0) {
      const newFiles = Array.from(files).map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      }));
      setSelectedFileNames((prevFileNames) => [...prevFileNames, ...newFiles]);
      setPlayingIndex(0);
      setisplaying(true);
      console.log("Selected audio files:", newFiles);
    }
  };

  const playAudio = (index) => {
    setPlayingIndex(index);

    setisplaying(true);
  };

  const handleSongEnd = () => {
    if (playingIndex !== null && playingIndex < selectedFileNames.length - 1) {
      setPlayingIndex(playingIndex + 1);
    }
  };

  return (
    <>
      <div className="">
        <div className="bg-slate-800 grid grid-cols-12 gap-4 ">
          <div className="col-span-12 md:col-span-4">
            <div className="main">
              <div className="currentplaying">
                <img
                  width="64"
                  height="64"
                  src="https://img.icons8.com/dusk/64/playlist.png"
                  alt="playlist"
                />
                <p className="heading">Currently Playing</p>
              </div>
              {selectedFileNames.map((file, index) => (
                <div className="loader" key={index}>
                  <div className="song">
                    <p
                      className={`name ${
                        playingIndex === index ? "active" : ""
                      }`}
                      onClick={() => playAudio(index)}>
                      {file.name.split(".").slice(0, -1).join(".")}
                    </p>
                  </div>
                  <div className="albumcover"></div>
                  {playingIndex === index && isplaying ? (
                    <div className="loading">
                      <div className="load"></div>
                      <div className="load"></div>
                      <div className="load"></div>
                      <div className="load"></div>
                    </div>
                  ) : (
                    <div className="play"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-12 md:col-span-8 flex justify-center items-center p-5">
            <div className="player bg-red-500 p-5  rounded-lg">
              <h2 className="font-semibold text-lg text-white">
                {playingIndex !== null
                  ? selectedFileNames[playingIndex].name
                      .split(".")
                      .slice(0, -1)
                      .join(".")
                  : "No Title"}
              </h2>
              <audio
                ref={audioRef}
                controls
                className=" flex justify-center items-center mt-10 "
              />
            </div>
          </div>
        </div>
        {/* upload file here */}
        <div className="upload flex justify-center items-center mt-10">
          <label className="box justify-center w-auto h-auto bg-gray-600 rounded-lg p-5 cursor-pointer">
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <img
              width="100"
              height="100"
              className="ml-5"
              src="https://img.icons8.com/clouds/100/upload.png"
              alt="upload"
            />
            <p className="font-semibold text-white">Upload audio file here</p>
          </label>
        </div>
      </div>
    </>
  );
}
