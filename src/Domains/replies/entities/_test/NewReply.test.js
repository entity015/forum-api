const NewReply = require("../NewReply")

describe("NewReply entities", () => {
	it("should throw error when payload not contain needed property", () => {
		// Arrange
		const payload = {}

		// Action & Assert
		expect(() => new NewReply(payload)).toThrowError("NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY")
	})

	it("should throw error when payload not meet data type specification", () => {
		// Arrange
		const payload = {
			content: true,
		}

		// Action & Assert
		expect(() => new NewReply(payload)).toThrowError("NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION")
	})

	it("should create NewReply entities", () => {
		// Arrange
		const payload = {
			content: "Test",
		}

		// Action
		const newReply = new NewReply(payload)

		// Assert
		expect(newReply).toBeInstanceOf(NewReply)
		expect(newReply.content).toEqual(payload.content)
	})
})