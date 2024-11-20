// src/constants.ts

export const slidesData = [
    {
      id: 1,
      image: "/images/Home_background.jpg",
      title: "Welcome to Your Journey of Self-Discovery",
      content: {
        text: "Professional Psychological Tests & Personalized Support for a Better You",
      },
    },
    {
      id: 2,
      image: "/images/image5.jpg",
      title: "About Dr. John Doe",
      content: {
        text: "Dr. John Doe is a licensed clinical psychologist with over 15 years of experience in helping individuals understand their mental health. He specializes in cognitive-behavioral therapy and psychological assessments, offering personalized insights for improving emotional well-being.",
        testimonials: [
          {
            text: "Dr. Doe has been instrumental in helping me overcome my anxiety. His guidance and support have been invaluable.",
            author: "Emily R.",
          },
          {
            text: "I was skeptical about online therapy, but Dr. Doe's approach has been a game-changer for me. I feel more confident and in control of my emotions.",
            author: "David K.",
          },
        ],
      },
    },
    {
      id: 3,
      image: "/images/vbcl.jpg",
      title: "Our Psychological Tests",
      content: {
        text: "Take a look at our professionally developed psychological assessments designed to help you understand your mind better.",
        link: { href: "/products", text: "View All Tests" },
      },
    },
    {
      id: 4,
      image: "/images/vbs.jpg",
      title: "Our Services",
      content: {
        text: "In addition to psychological tests, we provide:",
        list: [
          { text: "Individual Counseling" },
          { text: "Online Therapy Sessions" },
          { text: "Mental Health Coaching" },
        ],
        testimonials: [
          {
            text: "The online therapy sessions with Dr. Doe have been a lifesaver for me. I feel more connected and supported than ever before.",
            author: "Sarah K.",
          },
          {
            text: "The mental health coaching program has helped me develop coping strategies and improve my overall well-being. I highly recommend it!",
            author: "Mark Z.",
          },
        ],
      },
    },
    {
      id: 6,
      image: "/images/vbt.jpg",
      title: "Contact Us",
      content: {
        text: "Have questions or need to schedule an appointment? Reach out to us!",
        email: "info@psychologistonline.com",
        phone: "(555) 123-4567",
        link: { href: "#", text: "Get in Touch" }, // Set href to "#" to avoid page navigation
      },
    },
  ];