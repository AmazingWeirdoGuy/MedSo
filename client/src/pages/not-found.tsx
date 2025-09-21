import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-16 flex items-center justify-center min-h-[70vh] animate-in fade-in-0 slide-in-from-bottom-4 duration-700 ease-out">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Error Icon and Code */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-200 ease-in-out">
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-2" data-testid="error-code">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4" data-testid="error-title">Page Not Found</h2>
          </div>

          {/* Error Message */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out mb-8">
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-4" data-testid="error-message">
                Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you may have entered an incorrect URL.
              </p>
              <p className="text-sm text-gray-500" data-testid="error-suggestion">
                Don't worry, you can easily get back to exploring ISB Medical Society's resources and activities.
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link href="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Button 
                className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:scale-105 transition-all duration-200 ease-in-out active:scale-95 py-3 px-6"
                data-testid="button-home"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Homepage
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="w-full sm:w-auto hover:bg-gray-50 hover:scale-105 transition-all duration-200 ease-in-out active:scale-95 py-3 px-6"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Medical Society Navigation Help */}
          <div className="mt-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Looking for something specific?</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <Link href="/" className="text-primary hover:text-primary/80 hover:underline transition-colors duration-200" data-testid="nav-home" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Home
              </Link>
              <Link href="/about" className="text-primary hover:text-primary/80 hover:underline transition-colors duration-200" data-testid="nav-about" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                About Us
              </Link>
              <Link href="/news" className="text-primary hover:text-primary/80 hover:underline transition-colors duration-200" data-testid="nav-news" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                News
              </Link>
              <Link href="/contact" className="text-primary hover:text-primary/80 hover:underline transition-colors duration-200" data-testid="nav-contact" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Contact
              </Link>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
