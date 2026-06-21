import { Router } from 'express';
import { getMoments, getMomentById, createMoment, updateMoment, deleteMoment, likeMoment } from '../controllers/momentController';

const router = Router();

router.get('/', getMoments);
router.get('/:id', getMomentById);
router.post('/', createMoment);
router.put('/:id', updateMoment);
router.delete('/:id', deleteMoment);
router.post('/:id/like', likeMoment);

export default router;
