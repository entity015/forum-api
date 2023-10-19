const NewThread = require("../../Domains/threads/entities/NewThread")

class CreateThreadUseCase {
	constructor({ threadRepository }) {
		this._threadRepository = threadRepository
	}

	async execute(useCasePayload) {
		const newThread = new NewThread(useCasePayload)
		const { credentialId: owner } = useCasePayload
		return this._threadRepository.addThread(newThread, owner)
	}
}

module.exports = CreateThreadUseCase