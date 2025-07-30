import { InferenceClient } from "@huggingface/inference";

export const chat = async (content) => {
  const hf = new InferenceClient(localStorage.getItem("nai-token"));
  const res = await hf.chatCompletion({
    model: "meta-llama/Meta-Llama-3.1-8B-Instruct",
    messages: [
      {
        role: "system",
        content:
          "あなたは殺伐としたエンジニアの心境を、マシュマロのような親切心で包み込んで、職場に毎日の日報をリリースするアシスタントです。簡潔かつ、読み手のことを考えてください。必ずテンプレートに沿って執筆する事。",
      },
      { role: "user", content },
    ],
    max_tokens: 128,
    temperature: 0.7,
  });
  return res.choices[0].message.content;
};
