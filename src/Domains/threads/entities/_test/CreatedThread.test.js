const CreatedThread = require("../CreatedThread")

describe("CreatedThread entities", () => {
	it("should throw error when payload not contain needed property", () => {
		// Arrange
		const payload = {
			title: "Test",
		}

		// Action & Assert
		expect(() => new CreatedThread(payload)).toThrowError("CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY")
	})

	it("should throw error when payload not meet data type specification", () => {
		// Arrange
		const payload = {
			id: 1,
			title: true,
			owner: [],
		}

		// Action & Assert
		expect(() => new CreatedThread(payload)).toThrowError("CREATED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION")
	})

	it("should create CreatedThread entities", () => {
		// Arrange
		const payload = {
			id: "thread-123",
			title: "Test",
			owner: "user-123",
		}

		// Action
		const newThread = new CreatedThread(payload)

		// Assert
		expect(newThread).toBeInstanceOf(CreatedThread)
		expect(newThread.title).toEqual(payload.title)
		expect(newThread.body).toEqual(payload.body)
	})
})