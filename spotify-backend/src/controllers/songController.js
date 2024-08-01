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

    console.log(name, desc, album, audioUpload, imageUpload);

    const newSong = new songModel({
      name,
      desc,
      album,
      image: imageUpload.secure_url,
      file: audioUpload.secure_url,
      duration: audioUpload.duration.toString(),
    });

    await newSong.save();

    res.status(201).json({ message: "Song added successfully", song: newSong });
  } catch (error) {
    console.error("Error adding song:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const listSong = async (req, res) => {
  try {
    const songs = await songModel.find();
    res.status(200).json(songs);
  } catch (error) {
    console.error("Error listing songs:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { addSong, listSong };
