import mongoose from 'mongoose'

const assessmentSchema = new mongoose.Schema({
	riskLevel: { type: String, required: true },
	confidence: { type: Number, required: true },
	summary: { type: String, required: true }
}, { _id: false })

const SourceSchema = new mongoose.Schema({
	type: String,
	title: String,
	publisher: String,
	url: String,
	publishedAt: String
}, { _id: false, strict: true })

const EvidenceSchema = new mongoose.Schema({
	id: String,
	subClaim: String,
	relationship: String,
	statement: String,
	reason: String,
	sourceId: String,
	sourceTitle: String,
	sourceUrl: String,
	confidence: Number
}, { _id: false, strict: true })

const evidenceSchema = new mongoose.Schema({
	supporting: { type: [EvidenceSchema], default: [] },
	contradicting: { type: [EvidenceSchema], default: [] },
	unclear: { type: [EvidenceSchema], default: [] }
}, { _id: false })

const resultSchema = new mongoose.Schema({
	checkId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Check',
		required: true,
		index: true
	},
	assessment: { type: assessmentSchema, required: true },
	evidence: { type: evidenceSchema, default: () => ({}) },
	sources: { type: [SourceSchema], default: [] }
}, { timestamps: true })

export const Result = mongoose.models.Result || mongoose.model('Result', resultSchema)
export default Result
