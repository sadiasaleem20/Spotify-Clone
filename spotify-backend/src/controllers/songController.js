import { v2 as cloudinary } from "cloudinary";
import songModel from "../models/songModel.js";

const addSong = async (req, res) => {
  try {
    const { name, desc, album } = req.body;
    const audioFile = req.files.audio[0];
    const imageFile = req.files.image[0];

    // Upload files to Cloudinary
    const audioUpload = await cloudinary.uploader.upload(audioFile.path, {
      resource_type: "video",
    });
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const duration = `${Math.floor(audioUpload.duration / 60)}:${Math.floor(
      audioUpload.duration % 60
    )}`;

    const newSong = new songModel({
      name,
      desc,
      album,
      image: imageUpload.secure_url,
      file: audioUpload.secure_url,
      duration,
    });

    await newSong.save();

    res.status(201).json({ success: true, message: "Song Added" });
  } catch (error) {
    console.error("Error adding song:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const listSong = async (req, res) => {
  try {
    const allSongs = await songModel.find({});
    res.status(200).json({ success: true, songs: allSongs });
  } catch (error) {
    console.error("Error listing songs:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const removeSong = async (req, res) => {
  try {
    const song = await songModel.findByIdAndDelete(req.params.id);

    if (!song) {
      return res
        .status(404)
        .json({ success: false, message: "Song not found" });
    }

    res.status(200).json({ success: true, message: "Song removed" });
  } catch (error) {
    console.error("Error removing song:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { addSong, listSong, removeSong };
