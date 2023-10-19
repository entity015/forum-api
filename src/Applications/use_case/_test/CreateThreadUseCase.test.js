const ThreadRepository = require("../../../Domains/threads/ThreadRepository")
const NewThread = require("../../../Domains/threads/entities/NewThread")
const CreatedThread = require("../../../Domains/threads/entities/CreatedThread")
const CreateThreadUseCase = require("../CreateThreadUseCase")

describe("CreateThreadUseCase", () => {
	it("should orchestrating add thread action correctly", async () => {
		// Arrange
		const useCasePayload = {
			title: "Test",
			body: "Test",
			credentialId: "user-123"
		}
		// mock result
		const mockCreatedThread = new CreatedThread({
			id: "thread-123",
			title: "Test",
			owner: "user-123",
		})
		// mock service
		const mockThreadRepository = new ThreadRepository()
		mockThreadRepository.addThread = jest.fn()
			.mockImplementation(() => Promise.resolve(mockCreatedThread))

		const createThreadUseCase = new CreateThreadUseCase({
			threadRepository: mockThreadRepository,
		})

		// Action
		const createdThread = await createThreadUseCase.execute(useCasePayload)

		// Assert
		expect(mockThreadRepository.addThread)
			.toBeCalledWith(new NewThread(useCasePayload), useCasePayload.credentialId)
		expect(createdThread).toStrictEqual(new CreatedThread({
			id: "thread-123",
			title: "Test",
			owner: "user-123",
		}))
	})
})