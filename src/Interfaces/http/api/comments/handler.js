const AddCommentUseCase = require("../../../../Applications/use_case/AddCommentUseCase")
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase")
const autoBind = require("auto-bind")

class CommentsHandler {
	constructor(container) {
		this._container = container

		autoBind(this)
	}

	async postCommentHandler(request, h) {
		const { id: credentialId } = request.auth.credentials
		const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name)
		const addedComment = await addCommentUseCase.execute({
			...request.params,
			...request.payload,
			credentialId,
		})

		return h.response({
			status: "success",
			data: { addedComment },
		}).code(201)
	}

	async deleteCommentHandler(request) {
		const { id: credentialId } = request.auth.credentials
		const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name)
		await deleteCommentUseCase.execute({ ...request.params, credentialId })

		return {
			status: "success",
		}
	}
}

module.exports = CommentsHandler