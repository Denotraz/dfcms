const bcrypt = require('bcrypt');
const plaintext = "sammy";
const hash = "$2b$10$TQ6Mh1CJHWnrOWePIO4BeOrAT60csvfe.lVuwEGroAYFl4VgsZDQe"; // A valid hash for "password123"
bcrypt.compare(plaintext, hash, (err, match) => {
  console.log("Match result:", match); // Should log true if the hash corresponds to the plaintext
});
