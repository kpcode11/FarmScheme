import multer from "multer";

function fileFilter(req, file, cb) {
  const allowed = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "image/webp",
  ];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Unsupported file type"));
  }
  cb(null, true);
}

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB || "10", 10) || 10) * 1024 * 1024 },
});


