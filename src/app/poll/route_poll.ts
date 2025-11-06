// File: ./src/features/poll/poll.feature.ts

import express, {
  type Request,
  type Response,
  type NextFunction,
  type RequestHandler,
} from 'express';
import { Schema, model, Document, Types } from 'mongoose';

// ----------------------------------------------------------------
// 1. TYPES & INTERFACES
// ----------------------------------------------------------------

/**
 * Interface representing the authenticated user attached to req.user.
 * This comes from your authentication middleware.
 */
interface IAuthUser {
  _id: string;
  email: string;
}

/**
 * Extends the Express Request type to include the authenticated user.
 */
interface IUserRequest extends Request {
  user?: IAuthUser; // Make user optional to avoid errors if not authenticated
}

/**
 * Interface for the Poll document stored in MongoDB.
 */
interface IPoll extends Document {
  name: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  options: string[];
  createdBy: Types.ObjectId; // Link to the user via their _id
  creatorEmail: string; // Store email as requested
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface for the expected request body when creating a poll.
 */
interface ICreatePollBody {
  name: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  options: string[];
}

// ----------------------------------------------------------------
// 2. MONGOOSE SCHEMA
// ----------------------------------------------------------------

const pollSchema = new Schema<IPoll>(
  {
    name: {
      type: String,
      required: [true, 'Poll name is required.'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required.'],
    },
    endTime: {
      type: Date,
      required: [true, 'End time is required.'],
    },
    options: {
      type: [String],
      required: [true, 'At least one option is required.'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'You must provide at least one option.',
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Assumes you have a 'User' model
      required: true,
    },
    creatorEmail: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  },
);

// ----------------------------------------------------------------
// 3. MONGOOSE MODEL
// ----------------------------------------------------------------

/**
 * Mongoose Model for the Poll document.
 */
const Poll = model<IPoll>('Poll', pollSchema);

// ----------------------------------------------------------------
// 4. CONTROLLER
// ----------------------------------------------------------------

const pollController = {
  /**
   * Create a new poll.
   */
  createPoll: async (
    req: IUserRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      // 1. Get user data from auth middleware (req.user)
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: 'Authentication required.' });
      }
      const { _id: userId, email: userEmail } = user;

      // 2. Get poll data from request body
      const { name, description, startTime, endTime, options } =
        req.body as ICreatePollBody;

      // 3. Validation: Check if this user already has a poll with the same name
      // This prevents a user from creating duplicate polls,
      // but allows different users to have polls with the same name.
      const existingPoll = await Poll.findOne({
        name,
        createdBy: new Types.ObjectId(userId), // Scope the check to the current user
      });

      if (existingPoll) {
        return res.status(400).json({
          message: `You already have a poll with the name "${name}".`,
        });
      }

      // 4. Create the new poll instance
      const newPoll = new Poll({
        name,
        description,
        startTime,
        endTime,
        options,
        createdBy: new Types.ObjectId(userId), // Link to user _id
        creatorEmail: userEmail, // Store user email
      });

      // 5. Save the poll to the database
      const savedPoll = await newPoll.save();

      // 6. Send success response
      return res
        .status(201)
        .json({ message: 'Poll created successfully!', poll: savedPoll });
    } catch (error) {
      // Pass errors to the global error handler
      next(error);
    }
  },

  // --- Other CRUD methods (GET, PUT, DELETE) would go here ---
  // e.g., getMyPolls, getPollById, updatePoll, deletePoll
};

// ----------------------------------------------------------------
// 5. EXPRESS ROUTER
// ----------------------------------------------------------------

/**
 * Express router for all poll-related routes.
 */
const pollRouter = express.Router();

// POST /api/polls/
pollRouter.post('/create-poll', pollController.createPoll as RequestHandler);

// You would add other routes here:
// pollRouter.get('/', pollController.getMyPolls);
// pollRouter.get('/:id', pollController.getPollById);
// pollRouter.put('/:id', pollController.updatePoll);
// pollRouter.delete('/:id', pollController.deletePoll);

// ----------------------------------------------------------------
// 6. EXPORT
// ----------------------------------------------------------------

// Export the router to be used in your main server file (e.g., app.ts)
// Example usage in app.ts:
// import { pollRouter } from './features/poll/poll.feature';
// app.use('/api/polls', pollRouter);

export default pollRouter