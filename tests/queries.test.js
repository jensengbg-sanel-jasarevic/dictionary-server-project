// Database layer testing
const queries = require("../model/queries.js"); 

test("should successfully create & retrieve same word from the 'Dictionary' table", async () => {
    // Arrange
    const expected = "lorem ipsum"
    let actual;
    
    // Act
    await queries.createWord({ word: "lorem ipsum", letter: "l" }) 
    await queries.readWord("lorem ipsum")
    .then((response) => {
        actual = response[response.length - 1].word
    })
    
    // Assert
    expect(actual).toEqual(expected);
});

test("should return 5 columns from 'Dictionary' table", async () => {
    // Arrange
    let expected = 5
    let actual;
    
    // Act
    await queries.readWords().then((resp) => { 
        actual = Object.keys(resp[0]).length
        })

    // Assert
    expect(actual).toBe(expected);
});

test("should successfully retrieve words by specified letter from the 'Dictionary' table", async () => {
    // Arrange
    const expected = "l"
    let actual;
    
    // Act
    await queries.readWordsByLetter("l")
    .then((response) => {
        actual = response[0].letter
    })
    
    // Assert
    expect(actual).toEqual(expected);
});

test("should successfully update a definition for a word from the 'Dictionary' table", async () => {
    // Arrange
    const expected = "updated info"
    let actual;
    
    // Act
    await queries.createWord({ word: "abc", definition: "default info" }) 
    await queries.updateWord({ word: "abc", updateDefinition: "updated info" })
    .then((response) => {
        actual = response[0].definition
    })

    // Assert
    expect(actual).toEqual(expected);
});

test("should successfully create & retrieve same comment from the 'Comments' table", async () => {
    // Arrange
    const expected = "comment text"
    let actual;
    
    // Act
    await queries.createComment({ comment: "comment text" }) 
    await queries.readComments().then((response) => { 
        actual = response[response.length - 1].comment
        })

    // Assert
    expect(actual).toEqual(expected);
});

test("should return 6 columns from 'Comments' table", async () => {
    // Arrange
    let expected = 6
    let actual;
    
    // Act
    await queries.readComments().then((resp) => { 
        actual = Object.keys(resp[0]).length
        })

    // Assert
    expect(actual).toBe(expected);
});

test("should return 1 row affected when updating votes column in 'Comments' table", async () => {
    // Arrange
    const expected = 1
    let commentID;
    let actual;
    
    // Act
    await queries.createComment({}).then((response) => { 
        commentID = response[0]
        })
    await queries.updateCommentVotes(commentID).then((response) => { 
        actual = response
        })
        
    // Assert
   expect(actual).toEqual(expected);
});

test("should return 0 rows affected when performing delete operation on comment with invalid parameter", async () => {
    // Arrange
    const expected = 0
    let actual;
    
    // Act
    await queries.deleteComment(false).then((response) => { 
        actual = response
        })

    // Assert
   expect(actual).toEqual(expected);
});

test("should return 1 row affected when performing delete operation on comment with valid parameter", async () => {
    // Arrange
    const expected = 1
    let commentID;
    let actual;
    
    // Act
    await queries.createComment({}).then((response) => { 
        commentID = response[0]
        })
    await queries.deleteComment(commentID).then((response) => { 
        actual = response
        })

    // Assert
   expect(actual).toEqual(expected);
});