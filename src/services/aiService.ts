import OpenAI from 'openai';

// This is a mock OpenAI implementation that doesn't require an API key
// In a real application, you would use the actual OpenAI client with a valid API key
class MockOpenAI {
  async chat(options: any) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const { messages } = options;
    const userMessage = messages.find((m: any) => m.role === 'user')?.content || '';
    
    if (userMessage.includes('header')) {
      return {
        choices: [{
          message: {
            content: JSON.stringify({
              title: "Building Digital Experiences That Matter",
              subtitle: "I create innovative solutions that help businesses grow and succeed in the digital landscape",
              ctaText: "View My Work",
              ctaLink: "#projects"
            })
          }
        }]
      };
    }
    
    if (userMessage.includes('about')) {
      return {
        choices: [{
          message: {
            content: JSON.stringify({
              title: "About Me",
              bio: "I'm a passionate developer with over 5 years of experience creating web and mobile applications. I specialize in React, Node.js, and modern JavaScript frameworks. My approach combines technical expertise with a deep understanding of user experience design to build solutions that are both powerful and intuitive.",
              image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
              skills: ["JavaScript", "React", "Node.js", "UI/UX Design", "TypeScript", "GraphQL"]
            })
          }
        }]
      };
    }
    
    if (userMessage.includes('skills')) {
      return {
        choices: [{
          message: {
            content: JSON.stringify({
              title: "My Technical Skills",
              skills: [
                { name: "Frontend Development", level: 90 },
                { name: "React & React Native", level: 85 },
                { name: "Node.js & Express", level: 80 },
                { name: "UI/UX Design", level: 75 },
                { name: "Database Design", level: 70 },
                { name: "DevOps & Deployment", level: 65 }
              ]
            })
          }
        }]
      };
    }
    
    if (userMessage.includes('projects')) {
      return {
        choices: [{
          message: {
            content: JSON.stringify({
              title: "Featured Projects",
              projects: [
                {
                  title: "E-commerce Platform",
                  description: "A full-featured online store with product management, cart functionality, and secure payment processing using Stripe.",
                  image: "https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80",
                  link: "#"
                },
                {
                  title: "Task Management App",
                  description: "A productivity application with drag-and-drop task organization, team collaboration features, and real-time updates.",
                  image: "https://images.unsplash.com/photo-1540350394557-8d14678e7f91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80",
                  link: "#"
                },
                {
                  title: "Healthcare Portal",
                  description: "A secure patient management system with appointment scheduling, medical record access, and HIPAA-compliant messaging.",
                  image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
                  link: "#"
                }
              ]
            })
          }
        }]
      };
    }
    
    if (userMessage.includes('contact')) {
      return {
        choices: [{
          message: {
            content: JSON.stringify({
              title: "Let's Work Together",
              subtitle: "Have a project in mind? I'd love to hear about it. Fill out the form below and I'll get back to you as soon as possible.",
              fields: [
                { name: "name", label: "Your Name", type: "text", required: true },
                { name: "email", label: "Email Address", type: "email", required: true },
                { name: "project", label: "Project Type", type: "text", required: false },
                { name: "message", label: "Tell me about your project", type: "textarea", required: true }
              ],
              submitText: "Send Message"
            })
          }
        }]
      };
    }
    
    if (userMessage.includes('gallery')) {
      return {
        choices: [{
          message: {
            content: JSON.stringify({
              images: [
                {
                  src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80",
                  alt: "Workspace with laptop and notebook",
                  caption: "Modern development workspace"
                },
                {
                  src: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
                  alt: "Code on screen",
                  caption: "Clean code architecture"
                },
                {
                  src: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
                  alt: "Team collaboration",
                  caption: "Collaborative development"
                }
              ]
            })
          }
        }]
      };
    }
    
    if (userMessage.includes('text')) {
      return {
        choices: [{
          message: {
            content: JSON.stringify({
              title: "My Development Philosophy",
              text: "I believe that great software is about more than just code. It's about creating experiences that solve real problems for users while being intuitive and enjoyable to use. My development approach focuses on three core principles: performance, accessibility, and maintainability. Every project I undertake is built with these principles in mind, ensuring that the final product not only meets but exceeds expectations. By staying current with the latest technologies and best practices, I deliver solutions that are future-proof and scalable."
            })
          }
        }]
      };
    }
    
    // Default response
    return {
      choices: [{
        message: {
          content: JSON.stringify({
            title: "Generated Content",
            text: "This is automatically generated content for your portfolio. You can edit this to personalize it for your needs."
          })
        }
      }]
    };
  }
}

// Create a singleton instance
const openai = new MockOpenAI();

export const generatePortfolioContent = async (componentType: string, prompt?: string) => {
  try {
    const basePrompt = `Generate content for a portfolio ${componentType} component.`;
    const fullPrompt = prompt ? `${basePrompt} ${prompt}` : basePrompt;
    
    const response = await openai.chat({
      messages: [
        { role: 'system', content: 'You are a helpful assistant that generates portfolio content in JSON format.' },
        { role: 'user', content: fullPrompt }
      ]
    });
    
    const content = JSON.parse(response.choices[0].message.content);
    return content;
  } catch (error) {
    console.error('Error generating content:', error);
    throw new Error('Failed to generate content. Please try again.');
  }
};