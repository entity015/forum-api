const CreateThreadUseCase = require("../../../../Applications/use_case/CreateThreadUseCase")
const SeeDetailedThreadUseCase = require("../../../../Applications/use_case/SeeDetailedThreadUseCase")
const autoBind = require("auto-bind")

class ThreadsHandler {
	constructor(container) {
		this._container = container

		autoBind(this)
	}

	async postThreadHandler(request, h) {
		const { id: credentialId } = request.auth.credentials
		const createThreadUseCase = this._container.getInstance(CreateThreadUseCase.name)
		const addedThread = await createThreadUseCase.execute({ ...request.payload, credentialId })

		return h.response({
			status: "success",
			data: { addedThread },
		}).code(201)
	}

	async getThreadByIdHandler(request) {
		const seeDetailedThreadUseCase = this._container.getInstance(SeeDetailedThreadUseCase.name)
		const thread = await seeDetailedThreadUseCase.execute(request.params)

		return {
			status: "success",
			data: { thread }
		}
	}
}

module.exports = ThreadsHandler