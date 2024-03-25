/* eslint-disable import/no-anonymous-default-export */
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req: { body: {
  user_Question: string;
}; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: { message: string; } | { message: string; } | { message: string; }; result?: string | undefined; }): void; new(): any; }; }; }) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const userQuestion = req.body.user_Question || '';
  // const userQuestion = "what are the Lanka Money Transfer partnered banks?";
  // const userQuestion = "what is credit card";
  // const userQuestion = "what is saving accounts?";
  if (userQuestion.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid question",
      }
    });
    return;
  }
  // prompt: `Is "${userQuestion}" is related to account, if yes what is the account name?, just say name of the product or service. if no, just say "No"`,


  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `State the name of the service or product that mentioned in this question "${userQuestion}", If it is not service or product, just say "sorry".`,
      temperature: 0.6,
    });
    console.log(completion.data.choices[0].text);
    res.status(200).json({ result: completion.data.choices[0].text });
    
  } catch(error) {
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
  }
}
