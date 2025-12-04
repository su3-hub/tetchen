import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const tagSchema = Schema({
    name: {
        type: String,
        required: true,
    }
})