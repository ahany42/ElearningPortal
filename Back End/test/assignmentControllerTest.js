const assert = require('assert');  // Use Node.js assert for assertions
const app = require('../index.js');  // Import your Express app
const BASE_URL = 'http://localhost:3008';  // Replace with your actual base URL

let server;

// Utility function to safely parse JSON
async function safelyParseJSON(response) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return await response.json();
    } else {
        return null;
    }
}

// Define the test suite
describe('AssignmentController Test Suite', () => {

    before((done) => {
        // Start the server before running tests (if necessary)
        server = app.listen(3009, () => {
            console.log('Test server running on port 3009');
            done();
        });
    });

    describe('POST /createAssignment', () => {

        // Test valid case
        it('should create a new assignment with valid input', async () => {
            const response = await fetch(`${BASE_URL}/createAssignment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseID: '60c4a8f7a5e3e4e6e4b2d6b9',
                    startDate: '2024-09-10',
                    duration: 1,
                    endDate: '2024-09-11',
                    title: 'Assignment 1',
                    document: 'Assignment 1 document'
                })
            });

            // Basic JavaScript assertions
            const resBody = await safelyParseJSON(response);

            // Check if there's an error key in the response
            if (resBody && resBody.error) {
                assert.fail(`Unexpected error: ${resBody.error}`);
            }
        });

        // Test for missing required fields
        it('should return an error if any field is missing', async () => {
            const response = await fetch(`${BASE_URL}/createAssignment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseID: '60c4a8f7a5e3e4e6e4b2d6b9',
                    startDate: '2024-09-10',
                    title: 'Assignment 1',
                    document: 'Assignment 1 document'
                })
            });

            const resBody = await response.json();

            // Basic JavaScript assertions
            assert.strictEqual(response.status, 200);  // Assuming validation returns 200
            assert.strictEqual(typeof resBody.error, 'string');  // Ensure an error is returned
        });
    });

    describe('DELETE /deleteAssignment/:id', () => {
        // Test for non-existent assignment
        it('should return an error if assignment does not exist', async () => {
            const response = await fetch(`${BASE_URL}/deleteAssignment/non-existent-id`, {
                method: 'DELETE'
            });

            const resBody = await response.json();

            // Basic JavaScript assertions
            assert.strictEqual(response.status, 200);  // Check the expected status code (could be 404)
            assert.strictEqual(resBody.error, 'Assignment not found');  // Check for the correct error message
        });
    });

    describe('POST /createAssignment with concurrency', () => {
        it('should handle multiple concurrent requests', async () => {
            const requests = [];
            for (let i = 0; i < 10; i++) {
                requests.push(
                    fetch(`${BASE_URL}/createAssignment`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            courseID: '60c4a8f7a5e3e4e6e4b2d6b9',
                            startDate: `2024-09-${10 + i}`,
                            duration: 1,
                            endDate: `2024-09-${11 + i}`,
                            title: `Concurrent Assignment ${i + 1}`,
                            document: `Document for concurrent test ${i + 1}`
                        })
                    })
                );
            }

            const responses = await Promise.all(requests);
            responses.forEach(response => {
                assert.strictEqual(response.status, 200); // All requests should succeed
            });
        });
    });

    describe('POST /createAssignment SQL Injection Test', () => {
        it('should prevent SQL injection in title', async () => {
            const response = await fetch(`${BASE_URL}/createAssignment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseID: '60c4a8f7a5e3e4e6e4b2d6b9',
                    startDate: '2024-09-10',
                    duration: 1,
                    endDate: '2024-09-11',
                    title: "'; DROP TABLE Assignments; --",
                    document: 'Malicious document'
                })
            });

            // Basic JavaScript assertions
            const resBody = await safelyParseJSON(response);

            // Check if there's an error key in the response
            if (resBody && !resBody.error) {
                assert.fail(`Unexpected error: ${resBody.error}`);
            }
        });
    });

    describe('POST /createAssignment XSS Test', () => {
        it('should prevent XSS in title', async () => {
            const xssString = "<script>alert('XSS');</script>";
            const response = await fetch(`${BASE_URL}/createAssignment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseID: '60c4a8f7a5e3e4e6e4b2d6b9',
                    startDate: '2024-09-10',
                    duration: 1,
                    endDate: '2024-09-11',
                    title: xssString,
                    document: 'XSS Document'
                })
            });

            // Basic JavaScript assertions
            const resBody = await safelyParseJSON(response);

            // Check if there's an error key in the response
            if (resBody && !resBody.error) {
                assert.fail(`Unexpected error: ${resBody.error}`);
            }
        });
    });

    describe('POST /createAssignment with invalid data types', () => {
        it('should return validation error when using incorrect data types', async () => {
            const response = await fetch(`${BASE_URL}/createAssignment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseID: 'invalid-course-id',  // Should be an ID format
                    startDate: 'Invalid Date',  // Should be a valid date format
                    duration: 'Not a Number',  // Should be a number
                    endDate: '2024-09-11',
                    title: 12345,  // Should be a string
                    document: 123456789  // Should be a string
                })
            });

            // Basic JavaScript assertions
            const resBody = await safelyParseJSON(response);

            // Check if there's an error key in the response
            if (resBody && !resBody.error) {
                assert.fail(`Unexpected error: ${resBody.error}`);
            }
        });
    });

    describe('POST /createAssignment with invalid date range', () => {
        it('should return validation error for end date before start date', async () => {
            const response = await fetch(`${BASE_URL}/createAssignment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseID: '60c4a8f7a5e3e4e6e4b2d6b9',
                    startDate: '2024-09-11',
                    duration: 1,
                    endDate: '2024-09-10',  // End date is before the start date
                    title: 'Invalid Date Assignment',
                    document: 'Document'
                })
            });

            // Basic JavaScript assertions
            const resBody = await safelyParseJSON(response);

            // Check if there's an error key in the response
            if (resBody && !resBody.error) {
                assert.fail(`Unexpected error: ${resBody.error}`);
            }
        });
    });

    describe('POST /createAssignment with overlapping assignment', () => {
        it('should return an error when creating an overlapping assignment', async () => {
            // First, create an assignment
            await fetch(`${BASE_URL}/createAssignment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseID: '60c4a8f7a5e3e4e6e4b2d6b9',
                    startDate: new Date() - 1000 * 60 * 60,
                    duration: 1,
                    endDate: new Date(),
                    title: 'First Assignment',
                    document: 'First Document'
                })
            });

            // Now try to create another assignment that overlaps with the first
            const response = await fetch(`${BASE_URL}/createAssignment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseID: '60c4a8f7a5e3e4e6e4b2d6b9',
                    startDate: new Date() - 1000 * 60 * 60,
                    duration: 1,
                    endDate: new Date(),
                    title: 'Overlapping Assignment',
                    document: 'Overlapping Document'
                })
            });

            // Basic JavaScript assertions
            const resBody = await safelyParseJSON(response);

            // Check if there's an error key in the response
            if (resBody && !resBody.error) {
                assert.fail(`Unexpected error: ${resBody.error}`);
            }
        });
    });

    describe('POST /createAssignment with duplicate title', () => {
        it('should return an error for duplicate titles within the same course', async () => {
            // First create an assignment with a specific title
            await fetch(`${BASE_URL}/createAssignment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseID: '60c4a8f7a5e3e4e6e4b2d6b9',
                    startDate: '2024-09-10',
                    duration: 1,
                    endDate: '2024-09-11',
                    title: 'Duplicate Title',
                    document: 'First Assignment Document'
                })
            });

            // Now attempt to create another assignment with the same title in the same course
            const response = await fetch(`${BASE_URL}/createAssignment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseID: '60c4a8f7a5e3e4e6e4b2d6b9',
                    startDate: '2024-09-12',
                    duration: 1,
                    endDate: '2024-09-13',
                    title: 'Duplicate Title',
                    document: 'Second Assignment Document'
                })
            });

            // Basic JavaScript assertions
            const resBody = await safelyParseJSON(response);

            // Check if there's an error key in the response
            if (resBody && !resBody.error) {
                assert.fail(`Unexpected error: ${resBody.error}`);
            }
        });
    });


    after((done) => {
        // Stop the server after running tests
        server.close(done);
    });
});
