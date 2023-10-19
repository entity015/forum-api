const AddReplyUseCase = require("../../../../Applications/use_case/AddReplyUseCase")
const DeleteReplyUseCase = require("../../../../Applications/use_case/DeleteReplyUseCase")
const autoBind = require("auto-bind")

class RepliesHandler {
	constructor(container) {
		this._container = container

		autoBind(this)
	}

	async postReplyHandler(request, h) {
		const { id: credentialId } = request.auth.credentials
		const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name)
		const addedReply = await addReplyUseCase.execute({
			...request.params,
			...request.payload,
			credentialId,
		})

		return h.response({
			status: "success",
			data: { addedReply },
		}).code(201)
	}

	async deleteReplyHandler(request) {
		const { id: credentialId } = request.auth.credentials
		const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name)
		await deleteReplyUseCase.execute({ ...request.params, credentialId })

		return {
			status: "success",
		}
	}
}

module.exports = RepliesHandler