exports.handler = async function(event, context) {
  if(event.httpMethod !== 'POST') {
    return {statusCode:405, body:'Method not allowed'};
  }
  try {
    const {prompt} = JSON.parse(event.body);
    const GEMINI_KEY = process.env.GEMINI_KEY;
    
    if(!GEMINI_KEY) {
      return {statusCode:500, body: JSON.stringify({error: 'No API key found'})};
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({contents:[{parts:[{text: prompt}]}]})
    });
    
    const data = await response.json();
    
    if(!response.ok) {
      return {statusCode:500, body: JSON.stringify({error: 'Gemini error', details: data})};
    }
    
    const text = data.candidates[0].content.parts[0].text;
    return {
      statusCode: 200,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({text})
    };
  } catch(e) {
    return {statusCode:500, body: JSON.stringify({error: e.message, stack: e.stack})};
  }
};
