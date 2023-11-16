import OpenAI from "openai";

let answer=[];

const openai = new OpenAI();

async function imageGen(gpt3Prompt) {
  const image = await openai.images.generate({ model: "dall-e-3", prompt: gpt3Prompt });

  console.log(image.data[0].url);//image url
}

async function textGen(numWords, playerPrompt) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { "role": "system", "content": `give me a ${numWords} word DALLE2 prompt involving ${playerPrompt}` },
    ],
    temperature: 0,
    max_tokens: 1024,
  });
  console.log(response.choices[0].message.content);
  answer=response.choices[0].message.content.split(" ");
  imageGen(response.choices[0].message.content);
}

textGen(10, "a cute baby sea otter");





