// Database layer testing
const queries = require("../model/queries.js"); 

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

test("should create a word successfully on the 'Dictionary' table", async () => {
    // Arrange
    const expected = "lorem ipsum"
    let actual;
    
    // Act
    await queries.createWord({ word: "lorem ipsum" }) 
    await queries.readWord("lorem ipsum")
    .then((response) => {
        actual = response[response.length - 1].word
    })
    
    // Assert
    expect(actual).toEqual(expected);
});