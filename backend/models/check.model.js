import mongoose from 'mongoose'

const checkSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
		index: true
	},
	claim: { type: String, required: true },
	subClaims: { type: [String], default: [] },
	status: {
		type: String,
		enum: ['processing', 'completed', 'failed'],
		default: 'processing',
		required: true
	}
}, { timestamps: true })

export default mongoose.models.Check || mongoose.model('Check', checkSchema)
