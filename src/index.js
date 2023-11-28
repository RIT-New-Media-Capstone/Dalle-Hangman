const openaiApiKey = 'REPLACE WITH YOUR KEY'; // Replace with your OpenAI API key

const apiUrl = 'https://api.openai.com/v1/chat/completions';

// const requestData = {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${openaiApiKey}`
//   },
//   body: JSON.stringify({
//     model: 'gpt-3.5-turbo',
//     messages: [
//       {
//         role: 'system',
//         content: 'You are a helpful assistant.'
//       },
//       {
//         role: 'user',
//         content: 'give me a 5 word DALLE2 prompt involving cats'
//       }
//     ]
//   })
// };

// const imgapiUrl = 'https://api.openai.com/v1/images/generations';

// const imgrequestData = {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${openaiApiKey}`
//   },
//   body: JSON.stringify({
//     model: 'dall-e-3',
//     prompt: 'A cute baby sea otter',
//     n: 1,
//     size: '1024x1024'
//   })
// };




// fetch(apiUrl, requestData)
//   .then(response => response.json())
//   .then(data => {
//     // Handle the response data here
//     console.log(data.choices[0].message.content);
//   })
//   .catch(error => {
//     // Handle errors here
//     console.error('Error:', error);
//   });

// async function generatePromptRequest(numberOfWords, promptTopic) {
//   const requestData = {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${openaiApiKey}`
//     },
//     body: JSON.stringify({
//       model: 'gpt-3.5-turbo',
//       messages: [
//         {
//           role: 'system',
//           content: 'You are a helpful assistant.'
//         },
//         {
//           role: 'user',
//           content: `give me a ${numberOfWords} word DALLE2 prompt involving ${promptTopic}, but dont use these words: Create, an, scene, of, a`
//         }
//       ]
//     })
//   };

//   return fetch(apiUrl, requestData)
//     .then(response => response.json())
//     .then(data => {
//       // Handle the response data here
//       console.log(data);
//     })
//     .catch(error => {
//       // Handle errors here
//       console.error('Error:', error);
//     });
// }

// // Example usage:
// const numberOfWords = 5;
// const promptTopic = 'cats';

// generatePromptRequest(numberOfWords, promptTopic);

const apiUrlPrompt = 'https://api.openai.com/v1/chat/completions';
const apiUrlImage = 'https://api.openai.com/v1/images/generations';

async function generatePromptRequest(numberOfWords, promptTopic) {
  const requestData = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiApiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.'
        },
        {
          role: 'user',
          content: `give me a ${numberOfWords} word DALLE2 prompt involving ${promptTopic}`//selected words
        }
      ]
    })
  };

  return fetch(apiUrlPrompt, requestData)
    .then(response => response.json())
    .then(data => data.choices[0].message.content) // Extracting the content from the response
    .catch(error => {
      console.error('Error:', error);
      throw error; // Propagate the error for handling downstream if needed
    });
}

async function generateImage(prompt) {
  const requestData = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiApiKey}`
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024'
    })
  };

  return fetch(apiUrlImage, requestData)
    .then(response => response.json())
    .then(data => {
      // Handle the response data here
      console.log(data.data[0].url);
      //grab img src and made null or zero,
      //change img href to data.data[0].url
    })
    .catch(error => {
      // Handle errors here
      console.error('Error:', error);
      
    });
}

// Example usage:
const numberOfWords = 5;
const promptTopic = 'cats';

generatePromptRequest(numberOfWords, promptTopic)
  .then(prompt => generateImage(prompt));

