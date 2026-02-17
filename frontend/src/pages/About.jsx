import { 
  SparklesIcon, 
  EyeIcon, 
  RocketLaunchIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  TrophyIcon,
  HeartIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import FloatingShapes from '../components/common/FloatingShapes';
import PageHeader from '../components/common/PageHeader';

const About = () => {
  const stats = [
    { number: '1,000+', label: 'Registered Players', color: 'text-red-500' },
    { number: '50+', label: 'Countries', color: 'text-blue-400' },
    { number: '200+', label: 'Club Partnerships', color: 'text-green-400' },
    { number: '5,000+', label: 'Family Connections', color: 'text-purple-400' },
  ];

  const coreValues = [
    {
      icon: SparklesIcon,
      title: 'Excellence',
      description: 'We strive for excellence in connecting talented players with top-tier opportunities.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Transparency',
      description: 'Clear, honest, and ethical operations in all of our dealings with players and clubs.'
    },
    {
      icon: UserGroupIcon,
      title: 'Community',
      description: 'Building a global community of football enthusiasts and professionals.'
    },
    {
      icon: TrophyIcon,
      title: 'Quality',
      description: 'Maintaining high standards and profiles that stand out in the market.'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <FloatingShapes />

      {/* Hero Section */}
      <PageHeader
        badge="Our Story"
        title={<>About <span className="text-red-500">Us</span></>}
        subtitle="We are dedicated to connecting professional football players with opportunities worldwide through our comprehensive database platform."
      />

      {/* Mission & Vision */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-10 hover:bg-white/10 transition-all duration-300 hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/20">
              <div className="absolute -top-6 left-8">
                <div className="p-4 bg-red-500 rounded-2xl shadow-lg shadow-red-500/50">
                  <RocketLaunchIcon className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6 mt-6">Our Mission</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                Our mission is to make a transparent, accessible platform where professional football players can showcase their talents and connect with scouts, clubs, and opportunities worldwide.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                We believe every talented player deserves visibility and the chance to advance their career, regardless of their location or access to traditional networks.
              </p>
            </div>

            {/* Vision */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-10 hover:bg-white/10 transition-all duration-300 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="absolute -top-6 left-8">
                <div className="p-4 bg-blue-500 rounded-2xl shadow-lg shadow-blue-500/50">
                  <EyeIcon className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6 mt-6">Our Vision</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                To become the world's leading platform for football player discovery, fostering players, scouts, and clubs worldwide.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                We envision a future where talent is discovered solely based on merit and ability, with our platform serving as the bridge that makes this a reality for organizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our Impact in <span className="text-red-500">Numbers</span>
          </h2>
          <p className="text-xl text-gray-400 mb-16 max-w-3xl mx-auto">
            Trusted by thousands of players and clubs worldwide
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/20"
              >
                <div className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-3 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                  {stat.number}
                </div>
                <div className="text-gray-400 text-base md:text-lg font-semibold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Our Core <span className="text-red-500">Values</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 text-center hover:bg-white/10 transition-all duration-300 hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/20 hover:-translate-y-2"
                >
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 border-2 border-red-500/50 rounded-2xl mb-6 group-hover:bg-red-500 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-8 h-8 text-red-500 group-hover:text-white transition-colors duration-300" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-4 group-hover:text-red-500 transition-colors duration-300">
                    {value.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="relative py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-10 md:p-16">
            {/* Decorative corner accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-500/10 rounded-tr-full"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl">
                  <HeartIcon className="w-6 h-6 text-red-500" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Our Story</h2>
              </div>

              <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                <p>
                  <span className="text-red-500 font-semibold">Started in 2023</span>, Football Players Database was born from a simple observation: many talented players lacked the visibility and connections needed to advance their careers. Traditional scouting methods were limited to geographic and network constraints, leaving countless players undiscovered.
                </p>

                <p>
                  We set out to <span className="text-white font-semibold">revolutionize player discovery</span> by creating a comprehensive, accessible database where players showcase their skills and connect with scouts, clubs, and opportunities. Today, we serve over 1,000 professional players across 50+ countries, connecting them to more than 200 partnering clubs.
                </p>

                <p>
                  Our platform combines <span className="text-white font-semibold">detailed player profiles</span>, verified credentials, career statistics, and highlights to allow scouts and clubs to discover talent based on skill, statistics, and potential, rather than just connections or geography.
                </p>

                <p className="text-white font-semibold text-xl pt-4">
                  Together, we're building the future of football talent discovery—one player at a time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
