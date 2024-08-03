import { v2 as cloudinary } from "cloudinary";
import albumModel from "../models/albumModel.js";

const addAlbum = async (req, res) => {
  try {
    const name = req.body.name;
    const desc = req.body.desc;
    const bgColour = req.body.bgColour;
    const imageFile = req.file;
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resourse_type: "image",
    });
    const albumData = {
      name,
      desc,
      bgColour,
      image: imageUpload.secure_url,
    };

    const album = albumModel(albumData);
    await album.save();
    res.json({ success: true, message: "Album Added" });
  } catch (error) {
    res.json({ success: false });
  }
};
const listAlbum = async (req, res) => {
  try {
    const allAlbums = await albumModel.find({});
    res.json({ success: true, albums: allAlbums });
  } catch (error) {
    res.json({ success: false });
  }
};

const removeAlbum = async (req, res) => {
  try {
    const album = await albumModel.findByIdAndDelete(req.params.id);

    if (!album) {
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

export { addAlbum, listAlbum, removeAlbum };
