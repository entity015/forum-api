const SwitchLikeUseCase = require("../../../../Applications/use_case/SwitchLikeUseCase")
const autoBind = require("auto-bind")

class LikesHandler {
	constructor(container) {
		this._container = container

		autoBind(this)
	}

	async putLikeHandler(request) {
		const { id: credentialId } = request.auth.credentials
		const switchLikeUseCase = this._container.getInstance(SwitchLikeUseCase.name)
		await switchLikeUseCase.execute({ ...request.params, credentialId })

		return {
			status: "success",
		}
	}
}

module.exports = LikesHandler