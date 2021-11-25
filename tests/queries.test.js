// Database layer testing
const queries = require("../model/queries.js"); 

test("should return 5 columns from table when performing a query", async () => {
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