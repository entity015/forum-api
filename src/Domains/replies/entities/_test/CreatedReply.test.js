const CreatedReply = require("../CreatedReply")

describe("CreatedReply entities", () => {
	it("should throw error when payload when not contain needed property", () => {
		// Arrange
		const payload = {
			id: "reply-123",
			content: "Test",
		}

		// Action & Assert
		expect(() => new CreatedReply(payload)).toThrowError("CREATED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY")
	})

	it("should throw error when payload when not meet data type specification", () => {
		// Arrange
		const payload = {
			id: 1,
			content: "Test",
			owner: [],
		}

		// Action & Assert
		expect(() => new CreatedReply(payload)).toThrowError("CREATED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION")
	})

	it("should create CreatedReply entities", () => {
		// Arrange
		const payload = {
			id: "reply-123",
			content: "Test",
			owner: "user-123",
		}

		// Action
		const createdReply = new CreatedReply(payload)

		// Assert
		expect(createdReply).toBeInstanceOf(CreatedReply)
		expect(createdReply.id).toEqual(payload.id)
		expect(createdReply.content).toEqual(payload.content)
		expect(createdReply.owner).toEqual(payload.owner)
	})
})