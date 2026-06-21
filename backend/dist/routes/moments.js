"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const momentController_1 = require("../controllers/momentController");
const router = (0, express_1.Router)();
router.get('/', momentController_1.getMoments);
router.get('/:id', momentController_1.getMomentById);
router.post('/', momentController_1.createMoment);
router.put('/:id', momentController_1.updateMoment);
router.delete('/:id', momentController_1.deleteMoment);
router.post('/:id/like', momentController_1.likeMoment);
exports.default = router;
//# sourceMappingURL=moments.js.map