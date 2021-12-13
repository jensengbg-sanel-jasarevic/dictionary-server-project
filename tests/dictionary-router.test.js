// Business layer testing
const supertest = require("supertest"); // Module for testing HTTP
const app = require("../controller/index-api.js");

test("should return HTTP status code 200 when hitting interface endpoint that gets all words", async () => {
    // Arrange
    let expected = 200
    let actual;
        
    // Act
    await supertest(app).get('/api/dictionary/words')
    .then((resp) => {
        actual = resp.statusCode
    })

    // Assert
    expect(actual).toBe(expected);
});

test("should return HTTP status code 200 when hitting interface endpoint that gets words by a specific letter", async () => {
    // Arrange
    let expected = 200
    let actual;
        
    // Act
    await supertest(app).get('/api/dictionary/words/a')
    .then((resp) => {
        actual = resp.statusCode
    })

    // Assert
    expect(actual).toBe(expected);
});


test("should return HTTP status code 404 when attempting to get a non-existing word", async () => {
    // Arrange
    let expected = 404
    let actual;
        
    // Act
    await supertest(app).get('/api/dictionary/loremipsum')
    .then((resp) => {
        actual = resp.statusCode
    })

    // Assert
    expect(actual).toBe(expected);
});
