const fs = require("fs");
const [,, targetPath, content] = process.argv;
fs.writeFileSync(targetPath, content, { encoding: "utf8" });
console.log("Wrote:", targetPath);
