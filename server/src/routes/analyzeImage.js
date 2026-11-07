import { Router } from 'express';
import multer from 'multer';
import { inspectImageBuffer } from '../services/imageAnalysis.js';

const router = Router();

// Configure Multer for in-memory processing
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB ceiling
  },
  fileFilter: (req, file, cb) => {
    const allowedMime = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedMime.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      const err = new Error('Unsupported image format. Allowed formats: JPG, JPEG, PNG, WEBP.');
      err.code = 'UNSUPPORTED_IMAGE_FORMAT';
      err.status = 400;
      cb(err);
    }
  }
});

/**
 * POST /api/analyze-image
 * Accepts multipart/form-data:
 * - image (File)
 * - analysisType ('ai_generated' | 'deepfake')
 */
router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NO_IMAGE_UPLOADED',
          message: 'Please provide an image file under the "image" form field.'
        }
      });
    }

    const analysisType = (req.body.analysisType === 'deepfake') ? 'deepfake' : 'ai_generated';

    const result = await inspectImageBuffer(
      req.file.buffer,
      analysisType,
      req.file.originalname
    );

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'FILE_TOO_LARGE',
          message: 'Image size exceeds maximum allowed upload limit of 5 MB.'
        }
      });
    }
    next(error);
  }
});

export default router;

