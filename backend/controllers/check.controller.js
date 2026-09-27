<<<<<<< HEAD
import mongoose from 'mongoose'
import Check from '../models/check.model.js'
import Result from '../models/result.model.js'
import { normalizeClaim, decomposeClaim } from '../services/claimControl.service.js'
import { orchestrateSearch } from '../services/searchOrchestrator.service.js'
import { analyzeClaim } from '../services/aiAnalysis.service.js'

function formatCheck(check, result) {
  const formatted = {
    checkId: String(check._id),
    claim: check.claim,
    subClaims: check.subClaims,
    status: check.status
  }

  if (result) {
    formatted.assessment = result.assessment
    formatted.evidence = result.evidence
    formatted.sources = result.sources
  }

  return formatted
}

export async function createCheck(request, response, next) {
  let check
  try {
    const content = request.body?.content ?? request.body?.claim
    const claim = normalizeClaim(content)
    if (!claim) {
      return response.status(400).json({ error: true, message: 'content is required' })
    }

    const subClaims = decomposeClaim(claim)
    if (subClaims.length === 0) subClaims.push(claim)

    check = await Check.create({
      userId: request.user.id,
      claim,
      subClaims,
      status: 'processing'
    })

    // Search each normalized sub-claim independently so retrieved material remains attributable.
    const searchResults = await Promise.all(
      subClaims.map((query) => orchestrateSearch(query))
    )
    const sources = searchResults.flatMap((searchResult) => searchResult.sources)

    // The AI service receives the original claim, decomposed claims, and unified sources.
    const analysis = await analyzeClaim({ claim, subClaims, sources })
    const result = await Result.create({
      checkId: check._id,
      assessment: analysis.assessment,
      evidence: analysis.evidence,
      sources: analysis.sources
    })

    check.status = 'completed'
    await check.save()

    const populatedResult = await Result.findById(result._id)
      .populate({ path: 'checkId', select: 'claim subClaims status createdAt' })
      .exec()

    return response.status(201).json(populatedResult)
  } catch (error) {
    if (check) {
      check.status = 'failed'
      try {
        await check.save()
      } catch (statusError) {
        console.error('Failed to update check status:', statusError)
      }
    }
    return next(error)
  }
}

export async function getCheckHistory(request, response, next) {
  try {
    const checks = await Check.find({ userId: request.user.id })
      .sort({ createdAt: -1 })
      .exec()
    const results = await Result.find({ checkId: { $in: checks.map((check) => check._id) } }).exec()
    const resultsByCheckId = new Map(results.map((result) => [String(result.checkId), result]))

    return response.json({
      checks: checks.map((check) => formatCheck(check, resultsByCheckId.get(String(check._id))))
    })
  } catch (error) {
    return next(error)
  }
}

export async function getCheckById(request, response, next) {
  try {
    const { id } = request.params
    if (!mongoose.isValidObjectId(id)) {
      return response.status(400).json({ error: true, message: 'Invalid check id' })
    }

    const check = await Check.findOne({ _id: id, userId: request.user.id }).exec()
    if (!check) {
      return response.status(404).json({ error: true, message: 'Check not found' })
    }

    const result = await Result.findOne({ checkId: check._id }).exec()
    return response.json(formatCheck(check, result))
=======
import { checks, buildCheckResult } from '../utils/store.js'

export async function createCheck(request, response) {
  try {
    const rawContent = request.body?.content ?? request.body?.claim
    const content = typeof rawContent === 'string' ? rawContent.trim() : ''

    if (!content) {
      return response.status(400).json({ message: 'A claim is required.' })
    }

    const result = buildCheckResult(content)
    checks.set(result.checkId, result)
    return response.status(201).json(result)
>>>>>>> 209e3c227fe7b81c98e09fcb867039ca249750c9
  } catch (error) {
    return response.status(500).json({ message: 'The analysis service is temporarily unavailable.' })
  }
}

export async function getCheckById(request, response) {
  try {
    const result = checks.get(request.params.id)
    if (!result) {
      return response.status(404).json({ message: 'No investigation was found.' })
    }

    return response.json(result)
  } catch (error) {
    return response.status(500).json({ message: 'Unable to load this investigation.' })
  }
}

export async function getHistory(request, response) {
  try {
    const history = Array.from(checks.values()).map((check) => ({
      checkId: check.checkId,
      claim: check.claim.original,
      riskLevel: check.assessment.riskLevel,
      confidence: check.assessment.confidence,
      evidenceCount: Object.values(check.evidence || {}).reduce((total, items) => total + (Array.isArray(items) ? items.length : 0), 0),
      createdAt: new Date().toISOString(),
    }))

    return response.json({ history })
  } catch (error) {
    return response.status(500).json({ message: 'Unable to load history.' })
  }
}
