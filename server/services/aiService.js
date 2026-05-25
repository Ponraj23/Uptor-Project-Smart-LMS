const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate quiz questions from course content using AI
 */
const generateQuizQuestions = async (topic, numberOfQuestions = 5, difficulty = 'intermediate') => {
  const prompt = `Generate ${numberOfQuestions} multiple choice quiz questions about "${topic}" at ${difficulty} difficulty level.

Return the response as a valid JSON array with this exact format:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Brief explanation of why this is correct"
  }
]

Rules:
- Each question must have exactly 4 options
- correctAnswer is the zero-based index of the correct option
- Questions should test understanding, not just memorization
- Vary the position of correct answers
- Make distractors plausible`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert educator. Return only valid JSON, no markdown or extra text.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0].message.content.trim();
    const questions = JSON.parse(content);
    return questions;
  } catch (error) {
    console.error('AI Quiz Generation Error:', error.message);
    throw new Error('Failed to generate quiz questions');
  }
};

/**
 * Generate personalized learning recommendations
 */
const generateRecommendations = async (studentProfile) => {
  const { completedCourses, quizScores, preferredTopics, currentLevel } = studentProfile;

  const prompt = `Based on this student profile, provide 5 personalized learning recommendations:

Completed Courses: ${completedCourses.join(', ') || 'None'}
Average Quiz Scores: ${quizScores || 'N/A'}%
Preferred Topics: ${preferredTopics.join(', ') || 'General'}
Current Level: ${currentLevel || 'Beginner'}

Return a JSON array with this format:
[
  {
    "title": "Recommendation title",
    "description": "Why this is recommended",
    "suggestedTopic": "Topic name",
    "priority": "high|medium|low"
  }
]`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a learning advisor. Return only valid JSON.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = completion.choices[0].message.content.trim();
    return JSON.parse(content);
  } catch (error) {
    console.error('AI Recommendations Error:', error.message);
    throw new Error('Failed to generate recommendations');
  }
};

/**
 * Analyze student performance and provide insights
 */
const analyzePerformance = async (performanceData) => {
  const prompt = `Analyze this student's learning performance and provide insights:

Courses Enrolled: ${performanceData.coursesEnrolled}
Courses Completed: ${performanceData.coursesCompleted}
Average Quiz Score: ${performanceData.avgQuizScore}%
Total Time Spent: ${performanceData.totalTimeSpent} minutes
Weak Areas: ${performanceData.weakAreas.join(', ') || 'None identified'}
Strong Areas: ${performanceData.strongAreas.join(', ') || 'None identified'}

Return a JSON object:
{
  "overallAssessment": "Brief overall assessment",
  "strengths": ["strength1", "strength2"],
  "areasForImprovement": ["area1", "area2"],
  "actionItems": ["action1", "action2", "action3"],
  "motivationalMessage": "Encouraging message"
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a learning analytics expert. Return only valid JSON.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const content = completion.choices[0].message.content.trim();
    return JSON.parse(content);
  } catch (error) {
    console.error('AI Performance Analysis Error:', error.message);
    throw new Error('Failed to analyze performance');
  }
};

module.exports = {
  generateQuizQuestions,
  generateRecommendations,
  analyzePerformance,
};
