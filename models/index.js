import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {studentModel} from './studentModel.js';

dotenv.config();
const db = {};
db.mongoose = mongoose;
db.url = process.env.MONGODB;
db.studentModel = studentModel(mongoose);

export { db };
