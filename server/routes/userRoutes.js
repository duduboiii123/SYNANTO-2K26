import express from 'express';
import { createUser, getUser } from '../controllers/userController.js';
import { body } from 'express-validator';

const router = express.Router();

router.post('/', 
  [
    body('name').trim().notEmpty().withMessage('Driver Name is required').escape(),
    body().custom((value, { req }) => {
      if (!req.body.crewId && !req.body.crew) {
        throw new Error('Crew selection is required');
      }
      return true;
    })
  ], 
  createUser
);

router.get('/:id', getUser);

export default router;

