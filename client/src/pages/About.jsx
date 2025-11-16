// About page - explains what the web application is about
export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-6 text-gray-800">About Byline Certification</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">What We Do</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Byline Certification is a comprehensive web platform designed to help aspiring journalists
                and writers develop their skills and earn professional certification. We provide a structured
                learning environment where you can practice reporting, receive expert feedback, and work
                towards achieving your byline certification.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">How It Works</h2>
              <div className="space-y-4 text-gray-600">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Sign Up & Login</h3>
                    <p>Create your account and log in to access the platform's features.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Draft Your Report</h3>
                    <p>Write and submit your news reports or articles for review and marking.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Expert Review</h3>
                    <p>Our certified administrators review your submissions and provide detailed feedback and scores.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Get Certified</h3>
                    <p>Once you achieve the benchmark score, you'll receive your byline certification!</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">Features</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Access to current news articles for inspiration and reference</li>
                <li>Submit unlimited reports for review and feedback</li>
                <li>Receive detailed scoring and constructive feedback from experts</li>
                <li>Track your progress and submission history</li>
                <li>Work towards achieving your professional byline certification</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                Our mission is to democratize journalism education and provide accessible pathways
                for aspiring journalists to develop their skills, receive professional feedback,
                and earn recognition for their work. We believe that quality journalism training
                should be available to everyone, regardless of their background or location.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">Get Started</h2>
              <p className="text-gray-600 leading-relaxed">
                Ready to begin your journey? Sign up today and start submitting your reports.
                Our team of experienced administrators is here to help you improve and achieve
                your certification goals.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

