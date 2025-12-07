import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, analysisType, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Analyzing image for: ${analysisType} in language: ${language}`);

    const languageInstructions: Record<string, string> = {
      en: "Respond in English",
      hi: "हिंदी में जवाब दें",
      te: "తెలుగులో సమాధానం ఇవ్వండి",
      ta: "தமிழில் பதிலளிக்கவும்",
      kn: "ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ",
      ml: "മലയാളത്തിൽ മറുപടി നൽകുക",
      mr: "मराठीत उत्तर द्या",
      gu: "ગુજરાતીમાં જવાબ આપો",
      bn: "বাংলায় উত্তর দিন",
      pa: "ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ",
      or: "ଓଡ଼ିଆରେ ଉତ୍ତର ଦିଅନ୍ତୁ",
    };

    const langInstruction = languageInstructions[language] || languageInstructions.en;

    let systemPrompt = "";
    
    switch (analysisType) {
      case "pest":
        systemPrompt = `You are an expert agricultural entomologist and pest management specialist helping Indian farmers. 
        Analyze the image and identify any pests, insects, or pest damage visible.
        Provide:
        1. Pest identification (name and type)
        2. Severity assessment (mild/moderate/severe)
        3. Damage caused to crops
        4. Organic control methods
        5. Chemical control methods (with safety precautions)
        6. Preventive measures for future
        
        Be friendly, empathetic, and speak like a trusted farming friend.
        ${langInstruction}`;
        break;
        
      case "soil":
        systemPrompt = `You are an expert soil scientist and agronomist helping Indian farmers.
        Analyze the image of the soil sample and provide:
        1. Soil type identification (clay, sandy, loamy, etc.)
        2. Visual health indicators
        3. Potential nutrient deficiencies based on color/texture
        4. Recommended crops suitable for this soil
        5. Soil improvement suggestions (organic methods preferred)
        6. Irrigation and drainage recommendations
        
        Be friendly, empathetic, and speak like a trusted farming friend.
        ${langInstruction}`;
        break;
        
      case "disease":
        systemPrompt = `You are an expert plant pathologist helping Indian farmers identify and treat crop diseases.
        Analyze the image and identify any plant diseases or health issues visible.
        Provide:
        1. Disease identification (name and cause - fungal/bacterial/viral)
        2. Affected plant part and severity
        3. How it spreads
        4. Organic treatment options
        5. Chemical treatment options (with safety precautions)
        6. Prevention strategies
        
        Be friendly, empathetic, and speak like a trusted farming friend.
        ${langInstruction}`;
        break;
        
      default:
        systemPrompt = `You are an expert agricultural advisor helping Indian farmers.
        Analyze the image and provide helpful insights about what you see.
        Be friendly, empathetic, and speak like a trusted farming friend.
        ${langInstruction}`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Please analyze this image and provide detailed agricultural guidance.`,
              },
              {
                type: "image_url",
                image_url: { url: imageUrl },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content || "Unable to analyze image";

    console.log("Analysis completed successfully");

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in analyze-crop function:", error);
    const errorMessage = error instanceof Error ? error.message : "Analysis failed";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
