// Import necessary libraries
const { Parser } = require('json2csv');

// Function to convert JSON to CSV
function convert2csv(json) {
    try {
        const parser = new Parser();
        return parser.parse(json);
    } catch (err) {
        console.error(err);
        return '';
    }
}

// Function to send the final result based on the requested format
function sendFinalResult(req, res, json) {
    let format = req.query.format;

    // If request result found no data, then send code 204
    if (json.length == 0) {
        res.status(204).send("204: Data Not Found");
    }

    // Check which format is requested, handle output respectively
    if ((format == null) || (format == 'json')) {
        res.send(json);
    } else if ((format != null) && (format == 'csv')) {
        // Convert JSON to CSV using the convert2csv function
        const csvData = convert2csv(json);
        
        // Set appropriate headers for CSV response
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=export.csv');
        
        // Send CSV data as the response
        res.send(csvData);
    } else {
        res.status(400).send("400: Bad Request!");
        // Bad format request
    }
}

// Export the sendFinalResult function
module.exports = { sendFinalResult };
