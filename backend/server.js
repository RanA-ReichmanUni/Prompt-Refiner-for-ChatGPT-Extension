const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const OPENAI_API_KEY = "your_openai_api_key";

app.post("/refine", async (req, res) => {
  const { text } = req.body;

  try {
    // const response = await axios.post(
    //   "https://api.openai.com/v1/completions",
    //   {
    //     model: "text-davinci-003",
    //     prompt: `Provide three refined versions of the following text: "${text}"`,
    //     max_tokens: 100,
    //     n: 3,
    //   },
    //   { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` } }
    // );

    // const refinements = response.data.choices.map((choice) => choice.text.trim());
    res.json({
      refinements: {
        message1: "Hello",
        message2: "Hello2",
        message3: "Hello3 gjsdkfgkjlds kjdghsfkjlgh lkjhf dskljh gkljhds fklgjh kldsfjhgklj hdsfklgjh dksfljhg",
      },
    });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res.status(500).send("Failed to refine text");
  }
});

app.listen(3000, () => console.log("Backend running on http://localhost:3000"));
