const fs = require("fs");

function requestHandler(req, res) {
  // console.log(req.url, req.method, req.headers); // the most important fields
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Enter Message</title><head>");
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>'
    );
    res.write("</html>");
    return res.end();
  }

  // ! RAW LOGIC, LATER WE WILL USE express.js :))

  if (url === "/message" && method === "POST") {
    const body = [];

    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });

    // these functions are registered, they are callback(s) - to be called sometimes in the future
    // thus - they dont block the Event Loop
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString(); // Output: 'message={TEXT}'   -   "message" because input has a prop 'name'="message"
      console.log(parsedBody);

      const message = parsedBody.split("=")[1];
      fs.writeFile("message.txt", message, (err) => {
        res.statusCode = 302; // ^ 302 - Redirection
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }

  res.setHeader("Content-Type", "text/html"); // * here we specify that we we pass HTML Code as a response
  res.write("<html>");
  res.write("<head><title>My First NodeJS Page!</title></head>");
  res.write("<body><h1>Hello from my Node.js Server!</h1></body>");
  res.write("</html>");
  res.end();
}

module.exports = {
  handler: requestHandler,
  someText: "Some hard-coded text",
};

// * We can also export like that
// module.exports.handler = requestHandler;
// module.exports.someText = "Some hard-coded text";

// * Or like that - a shortcut
// exports.handler = requestHandler
// exports.someText = "Some hard-coded text"
