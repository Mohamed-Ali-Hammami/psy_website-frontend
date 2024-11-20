// src/app/about_us/page.tsx
import React from 'react';
import './about_us.css';

const AboutUsPage: React.FC = () => {
    return (
        <div className="about-us-container">
            <section className="about-us-header">
                <h1 className="about-us-title">About Us</h1>
                <p className="about-us-intro">
                    Welcome to [Website Name]. 
                    As a licensed psychologist with years of experience in psychological assessment and clinical research, 
                    I am committed to providing high-quality psychological tools that support institutions, 
                    hospitals, 
                    and other mental health professionals. 
                    Our platform is designed to deliver rigorous, 
                    dependable assessments to aid practitioners in making impactful, 
                    evidence-based decisions.
                </p>
            </section>
            
            <section className="mission-section">
                <h2 className="section-title">My Mission</h2>
                <p className="section-text">
                    My mission is to empower fellow mental health professionals by providing access to carefully developed psychological assessments that meet the standards required in both clinical and organizational settings.
                    Each tool is crafted to support practitioners who rely on precise, 
                    actionable insights to foster meaningful outcomes in their work.
                </p>
            </section>

            <section className="vision-section">
                <h2 className="section-title">My Vision</h2>
                <p className="section-text">
                    I envision a future where mental health professionals have ready access to trusted resources that enable them to make positive, 
                    lasting contributions to individuals and communities. By offering assessments endorsed by leading psychologists and respected psychological institutions, 
                    I aim to make a significant difference in advancing mental health care worldwide.
                </p>
            </section>

            <section className="endorsements-section">
                <h2 className="section-title">Endorsements & Professional Standards</h2>
                <p className="section-text">
                    The assessments offered on this platform are developed and curated in close collaboration with esteemed psychologists and reputable institutions in the field. 
                    These endorsements affirm that our tools meet the highest standards of clinical validity and ethical practice, 
                    providing professionals with resources they can rely on with confidence.
                </p>
            </section>

            <section className="expertise-section">
                <h2 className="section-title">My Expertise</h2>
                <p className="section-text">
                    With a background rooted in psychological assessment and evidence-based practice, 
                    I bring both expertise and dedication to selecting tools that meet the specialized needs of professionals. 
                    Each assessment is chosen to ensure reliability, 
                    precision, 
                    and applicability across a range of clinical and organizational environments.
                </p>
            </section>

            <section className="values-section">
                <h2 className="section-title">Core Values</h2>
                <ul className="values-list">
                    <li className="value-item">
                        <strong>Integrity:</strong> I am committed to upholding the highest ethical standards, 
                        ensuring that each product serves the true purpose of advancing mental health.
                    </li>
                    <li className="value-item">
                        <strong>Excellence:</strong> Every assessment is thoroughly vetted to meet clinical expectations and professional endorsement standards.
                    </li>
                    <li className="value-item">
                        <strong>Collaboration:</strong> I believe in supporting the work of my colleagues to collectively make a greater impact on mental wellness and societal understanding.
                    </li>
                </ul>
            </section>

            <section className="contact-section">
                <h2 className="section-title">Contact Me</h2>
                <p className="section-text">
                    If you have questions about our products or would like more information about how these assessments can benefit your practice, 
                    please feel free to reach out to me directly at 
                    <a href="mailto:[Contact Email]" className="contact-email">[Contact Email]</a>. 
                    I am here to support your work with resources designed to make a difference in the mental health field.
                </p>
            </section>
        </div>
    );
};

export default AboutUsPage;
