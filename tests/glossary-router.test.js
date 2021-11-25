// Business layer testing
const supertest = require("supertest"); // Module for testing HTTP
const app = require("../index.js"); 

test("should return HTTP status code 200 when hitting interface endpoint that gets all words", async () => {
    // Arrange
    let expected = 200
    let actual;
        
    // Act
    await supertest(app).get('/api/glossary/words')
    .then((resp) => {
        actual = resp.statusCode
    })

    // Assert
    expect(actual).toBe(expected);
});