import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Home() {
  const { token, role } = useSelector((s) => s.auth);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
      {/* Hero */}
      <section className="hero-section relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.12),transparent)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 text-primary-700 text-xs font-medium mb-8 border border-primary-100">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
            Pet care, simplified
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.1]">
            Veterinary care that{' '}
            <span className="text-primary-600">your pet deserves</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Book appointments with verified vets, manage your pet&apos;s health records, and get reminders—all in one place.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {!token ? (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition shadow-saas-md hover:shadow-saas-lg"
                >
                  Get started free
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center px-6 py-3.5 border border-slate-300 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-400 transition"
                >
                  Sign in
                </Link>
              </>
            ) : (
              <>
                {role === 'user' && (
                  <Link
                    to="/dashboard/book"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition shadow-saas-md"
                  >
                    Book appointment
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                )}
                <Link
                  to={role === 'user' ? '/dashboard' : role === 'doctor' ? '/doctor' : '/admin'}
                  className="inline-flex items-center px-6 py-3.5 border border-slate-300 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition"
                >
                  Go to dashboard
                </Link>
              </>
            )}
          </div>
          <div className="mt-14 flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified veterinarians
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Same-day booking
            </span>
          </div>
        </div>
      </section>

      {/* Social proof / stats */}
      <section className="border-y border-slate-200/80 bg-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-slate-900">500+</div>
              <div className="text-sm text-slate-500 mt-0.5">Appointments booked</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-slate-900">15+</div>
              <div className="text-sm text-slate-500 mt-0.5">Expert vets</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-slate-900">98%</div>
              <div className="text-sm text-slate-500 mt-0.5">Pet parents satisfied</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-slate-900">24/7</div>
              <div className="text-sm text-slate-500 mt-0.5">Booking available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28 bg-slate-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Everything you need for pet care
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              From routine checkups to specialist care, we make it easy to keep your furry family healthy.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                title: 'Easy booking',
                desc: 'Pick a vet, choose a slot, and confirm—all in under a minute.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: 'Verified vets',
                desc: 'Every doctor is verified and experienced in veterinary care.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                ),
                title: 'Health records',
                desc: 'Vaccination and visit history in one place for each pet.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                ),
                title: 'Smart reminders',
                desc: 'Get notified for upcoming appointments and follow-ups.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-saas-lg border border-slate-200/80 p-6 shadow-saas hover:shadow-saas-md hover:border-primary-200/60 transition"
              >
                <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              How it works
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Three simple steps to get your pet the care they need.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              { step: '1', title: 'Create an account', desc: 'Sign up in seconds. Add your pet’s name and details—no paperwork.' },
              { step: '2', title: 'Choose your vet & time', desc: 'Browse our doctors, see their availability, and pick a slot that works.' },
              { step: '3', title: 'Show up & get care', desc: 'Arrive at the clinic at your appointment time. We’ll take it from there.' },
            ].map((item) => (
              <div key={item.step} className="text-center md:text-left">
                <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center text-lg font-bold mx-auto md:mx-0 mb-5">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to={token && role === 'user' ? '/dashboard/book' : '/register'}
              className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition"
            >
              {token && role === 'user' ? 'Book now' : 'Get started'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Services & links */}
      <section className="py-20 md:py-28 bg-slate-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Explore PetsCare
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Services, doctors, and pet profiles—all in one platform.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              to="/services"
              className="group flex items-start gap-4 p-6 bg-white rounded-saas-lg border border-slate-200/80 shadow-saas hover:shadow-saas-md hover:border-primary-200/60 transition"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center text-2xl shrink-0 group-hover:bg-primary-100 transition">
                🩺
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary-600 transition">Services</h3>
                <p className="text-sm text-slate-600 mt-1">Checkups, vaccinations, grooming, and more.</p>
              </div>
              <svg className="w-5 h-5 text-slate-400 group-hover:text-primary-500 ml-auto shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              to="/doctors"
              className="group flex items-start gap-4 p-6 bg-white rounded-saas-lg border border-slate-200/80 shadow-saas hover:shadow-saas-md hover:border-primary-200/60 transition"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center text-2xl shrink-0 group-hover:bg-primary-100 transition">
                👨‍⚕️
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary-600 transition">Our doctors</h3>
                <p className="text-sm text-slate-600 mt-1">Meet our verified veterinary team.</p>
              </div>
              <svg className="w-5 h-5 text-slate-400 group-hover:text-primary-500 ml-auto shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              to="/pets"
              className="group flex items-start gap-4 p-6 bg-white rounded-saas-lg border border-slate-200/80 shadow-saas hover:shadow-saas-md hover:border-primary-200/60 transition"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center text-2xl shrink-0 group-hover:bg-primary-100 transition">
                🐾
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary-600 transition">Pets</h3>
                <p className="text-sm text-slate-600 mt-1">Browse pets in our care.</p>
              </div>
              <svg className="w-5 h-5 text-slate-400 group-hover:text-primary-500 ml-auto shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <blockquote className="text-xl md:text-2xl font-medium text-slate-800 leading-relaxed">
              &ldquo;Booking a vet visit used to mean phone tag and long waits. With PetsCare I had an appointment confirmed in minutes. My dog got the checkup he needed the same week.&rdquo;
            </blockquote>
            <div className="mt-6">
              <div className="font-semibold text-slate-900">Sarah M.</div>
              <div className="text-sm text-slate-500">Pet parent</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-primary-50/80 to-white border-t border-slate-200/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Ready to give your pet the best care?
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Join thousands of pet parents who trust PetsCare for their furry family.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {!token ? (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition shadow-saas-md"
                >
                  Create free account
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center px-6 py-3.5 border border-slate-300 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition"
                >
                  Sign in
                </Link>
              </>
            ) : (
              <Link
                to={role === 'user' ? '/dashboard/book' : role === 'doctor' ? '/doctor' : '/admin'}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition shadow-saas-md"
              >
                Go to dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      </div>
      {/* Footer - full width, sticks to bottom */}
      <footer className="mt-auto w-screen relative left-1/2 -translate-x-1/2 bg-slate-900 text-slate-300 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <Link to="/" className="text-lg font-semibold text-white">PetsCare</Link>
              <p className="mt-2 text-sm text-slate-400 max-w-xs">
                Veterinary care and appointment booking for pet parents and clinics.
              </p>
            </div>
            <nav className="flex flex-wrap gap-6 md:gap-8">
              <Link to="/services" className="text-sm font-medium text-slate-400 hover:text-white transition">Services</Link>
              <Link to="/doctors" className="text-sm font-medium text-slate-400 hover:text-white transition">Doctors</Link>
              <Link to="/pets" className="text-sm font-medium text-slate-400 hover:text-white transition">Pets</Link>
              <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-white transition">Sign in</Link>
              <Link to="/register" className="text-sm font-medium text-primary-400 hover:text-primary-300 transition">Get started</Link>
            </nav>
          </div>
          <div className="mt-10 pt-8 border-t border-slate-800 text-sm text-slate-500">
            © {new Date().getFullYear()} PetsCare. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
