import WebTorrent from "webtorrent";
import { google } from "googleapis";
import fs from "fs";
import { GoogleAuth } from "google-auth-library";
import { authorize } from "./googleAUTH.js";
const client = new WebTorrent();
import axios from "axios";
/**
 * Insert new file.
 * @return{obj} file Id
 * */
async function gdriveUpload(videoName) {
  const auth = await authorize();

  const service = google.drive({ version: "v3", auth });
  const requestBody = {
    name: videoName,
    fields: "id",
  };
  const media = {
    mimeType: "video/x-matroska",
    body: fs.createReadStream("./upload_temp/video.mkv"),
  };
  try {
    const file = await service.files.create({
      requestBody,
      media: media,
    });
    console.log("File Id:", file.data.id);
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }
}

function googleCollab() {}

// Function to download mkv file using torrent magnet URL
function downloadVideo(magnetURL, outputPath) {
  console.log(outputPath);
  client.add(magnetURL, { path: outputPath }, (torrent) => {
    console.log(torrent.path);

    console.log("Torrent added:", torrent.infoHash);
    torrent.on("done", () => {
      console.log("Download completed!");
    });

    torrent.on("error", (err) => {
      console.log("Error:", err);
    });
  });
}

// Function to see current progress of download
function videoProgress() {
  const torrents = client.torrents;
  torrents.forEach((torrent) => {
    console.log(torrent.path);

    const progress = (torrent.progress * 100).toFixed(2);
    return `Torrent ${torrent.infoHash} - Progress: ${progress}%`;
  });
}

export { downloadVideo, videoProgress, gdriveUpload };
