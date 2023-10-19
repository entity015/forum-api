const CreatedComment = require("../CreatedComment")

describe("CreatedComment entities", () => {
	it("should throw error when payload when not contain needed property", () => {
		// Arrange
		const payload = {
			id: "comment-123",
			content: "Test",
		}

		// Action & Assert
		expect(() => new CreatedComment(payload)).toThrowError("CREATED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY")
	})

	it("should throw error when payload when not meet data type specification", () => {
		// Arrange
		const payload = {
			id: 1,
			content: "Test",
			owner: [],
		}

		// Action & Assert
		expect(() => new CreatedComment(payload)).toThrowError("CREATED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION")
	})

	it("should create CreatedComment entities", () => {
		// Arrange
		const payload = {
			id: "comment-123",
			content: "Test",
			owner: "user-123",
		}

		// Action
		const createdComment = new CreatedComment(payload)

		// Assert
		expect(createdComment).toBeInstanceOf(CreatedComment)
		expect(createdComment.id).toEqual(payload.id)
		expect(createdComment.content).toEqual(payload.content)
		expect(createdComment.owner).toEqual(payload.owner)
	})
})