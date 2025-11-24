import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import axios from '../utils/axios';
import { FaArrowLeft } from 'react-icons/fa';

const PlannerPage = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'destination';
  const { locationId } = useParams();
  const formattedLocation = locationId.replace(/-/g, ' ');
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [tripSelections, setTripSelections] = useState([]);
  const [currentSelection, setCurrentSelection] = useState({
    destination: formattedLocation,
    duration: '',
    groupType: '',
  });
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch packages for the destination when component mounts
  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching destination:', formattedLocation);

        // First get all destinations
        const destResponse = await axios.get(`/destination/places`);
        console.log('All destinations:', destResponse.data);

        if (destResponse.data.data && destResponse.data.data.length > 0) {
          // Find the destination that matches our search term (case-insensitive)
          const destination = destResponse.data.data.find(
            dest => dest.name.toLowerCase().includes(formattedLocation.toLowerCase())
          );

          if (destination) {
            console.log('Found destination:', destination);
            const destinationId = destination._id;

            // Then get packages for this destination
            const packagesResponse = await axios.get(`/destination/destinations/${destinationId}/packages`);
            console.log('Packages response:', packagesResponse.data);

            if (packagesResponse.data && packagesResponse.data.data) {
              console.log('Setting packages:', packagesResponse.data.data);
              setPackages(packagesResponse.data.data);
            } else {
              console.log('No packages in response');
              setError('No packages found for this destination');
            }
          } else {
            setError('Destination not found. Available destinations: ' +
              destResponse.data.data.map(d => d.name).join(', '));
          }
        } else {
          setError('No destinations available');
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
        setError('Failed to fetch packages');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [formattedLocation]);

  const handleDurationClick = (value) => {
    setCurrentSelection((prev) => ({
      ...prev,
      duration: value,
    }));
    setStep(2);
  };

  const handleGroupClick = (value) => {
    setCurrentSelection((prev) => ({
      ...prev,
      groupType: value,
    }));
    setStep(3);
  };

  const latestTrip = tripSelections[tripSelections.length - 1] || currentSelection;

  // Filter packages based on duration and group type
  const filteredPackages = packages.filter(pkg => {
    console.log('Filtering package:', pkg);
    let durationMatch = true;
    if (currentSelection.duration) {
      // Extract numbers from the duration string (e.g., "3-4 Days" -> [3, 4])
      const durationNumbers = currentSelection.duration.match(/(\d+)(?:-(\d+))?/);
      if (durationNumbers) {
        const min = parseInt(durationNumbers[1]);
        const max = durationNumbers[2] ? parseInt(durationNumbers[2]) : null;
        console.log('Duration range:', { min, max, packageDuration: pkg.duration });

        if (currentSelection.duration.includes('+')) {
          durationMatch = pkg.duration >= min;
        } else {
          durationMatch = pkg.duration >= min && (!max || pkg.duration <= max);
        }
      }
    }
    const groupTypeMatch = !currentSelection.groupType || pkg.groupType === currentSelection.groupType;
    console.log('Filter results:', { durationMatch, groupTypeMatch, package: pkg });
    return durationMatch && groupTypeMatch;
  });

  console.log('Current Selection:', currentSelection);
  console.log('Available Packages:', packages);
  console.log('Filtered Packages:', filteredPackages);

  const handleBookNow = (packageId) => {
    navigate(`/package/${packageId}`);
  };

  // Styles
  const plannerPageStyle = {
    padding: '2rem',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
  };

  const h2Style = {
    color: 'white',
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '3rem',
    textShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    letterSpacing: '-0.02em'
  };

  const h3Style = {
    color: 'white',
    fontSize: '1.8rem',
    fontWeight: '600',
    marginBottom: '2rem',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.15)'
  };

  const cardOptionsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1.5rem',
    margin: '3rem auto',
    maxWidth: '900px',
    padding: '0 1rem'
  };

  const getCardOptionStyle = (isSelected, isHovered) => ({
    width: '100%',
    height: '240px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(15px)',
    border: isSelected ? '3px solid #00d4aa' : '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '20px',
    padding: '1.5rem',
    textAlign: 'center',
    position: 'relative',
    boxShadow: isSelected 
      ? '0 20px 45px rgba(0, 212, 170, 0.3)' 
      : isHovered 
        ? '0 25px 50px rgba(0, 0, 0, 0.2)'
        : '0 10px 40px rgba(0, 0, 0, 0.15)',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    transform: isSelected 
      ? 'translateY(-8px) scale(1.02)' 
      : isHovered 
        ? 'translateY(-10px) scale(1.03)' 
        : 'none'
  });

  const cardImageCircleStyle = {
    width: '100px',
    height: '100px',
    background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    borderRadius: '50%',
    margin: '0 auto 1.5rem',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease'
  };

  const iconStyle = {
    fontSize: '2.5rem',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
  };

  const cardLabelStyle = {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#2d3748',
    letterSpacing: '-0.01em',
    position: 'relative',
    zIndex: 1,
    marginTop: 'auto'
  };

  const badgeTopLeftStyle = {
    position: 'absolute',
    top: '15px',
    left: '15px',
    background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
    color: 'white',
    fontSize: '0.7rem',
    padding: '6px 12px',
    borderRadius: '15px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    boxShadow: '0 4px 12px rgba(238, 90, 36, 0.4)',
    zIndex: 2
  };

  const checkmarkStyle = {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'linear-gradient(135deg, #00d4aa, #00b894)',
    color: 'white',
    width: '32px',
    height: '32px',
    fontSize: '1.1rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 15px rgba(0, 212, 170, 0.5)',
    zIndex: 2
  };

  const resultsWrapperStyle = {
    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1))',
    backdropFilter: 'blur(30px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    padding: 0,
    borderRadius: '20px',
    maxWidth: '700px',
    margin: '2rem auto',
    boxShadow: '0 32px 64px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
    position: 'relative',
    overflow: 'hidden'
  };

  const resultsHeadingStyle = {
    textAlign: 'center',
    margin: 0,
    padding: '1.2rem 1rem',
    position: 'relative',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%)',
    backdropFilter: 'blur(20px)',
    borderRadius: '30px 30px 0 0',
    marginTop: '35px'
  };

  const resultsH2Style = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontSize: '1.5rem',
    fontWeight: '900',
    marginBottom: '1rem',
    textShadow: 'none',
    letterSpacing: '-0.03em',
    position: 'relative'
  };

  const summaryContainerStyle = {
    fontSize: 0,
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  const getSummaryItemStyle = (index) => {
    const colors = [
      { bg: 'linear-gradient(135deg, rgba(255, 107, 107, 0.08), rgba(255, 255, 255, 0.95))', border: '#ff6b6b', icon: '🌍' },
      { bg: 'linear-gradient(135deg, rgba(78, 205, 196, 0.08), rgba(255, 255, 255, 0.95))', border: '#4ecdc4', icon: '⏰' },
      { bg: 'linear-gradient(135deg, rgba(69, 183, 209, 0.08), rgba(255, 255, 255, 0.95))', border: '#45b7d1', icon: '👥' }
    ];
    const color = colors[index];
    
    return {
      fontSize: '0.95rem',
      color: '#1e293b',
      fontWeight: '600',
      background: color.bg,
      padding: '0.7rem 1rem 0.7rem 2rem',
      borderRadius: '10px',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
      borderLeft: `4px solid ${color.border}`,
      position: 'relative',
      transition: 'all 0.3s ease',
      display: 'block',
      textAlign: 'left',
      backdropFilter: 'blur(10px)'
    };
  };

  const getIconBeforeStyle = (index) => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1'];
    const icons = ['🌍', '⏰', '👥'];
    
    return {
      content: `'${icons[index]}'`,
      position: 'absolute',
      left: '-12px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: colors[index],
      padding: '6px',
      borderRadius: '50%',
      fontSize: '0.9rem',
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };
  };

  const resultsSectionStyle = {
    padding: '2rem'
  };

  const resultsSectionH3Style = {
    color: '#1e293b',
    fontSize: '1.6rem',
    fontWeight: '700',
    marginBottom: '2rem',
    textShadow: 'none',
    textAlign: 'center'
  };

  const cardListStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
    gap: '2rem',
    marginBottom: '2rem'
  };

  const infoCardStyle = {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    borderRadius: '20px',
    padding: '2rem',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden'
  };

  const cardIconStyle = {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    display: 'block'
  };

  const cardContentH4Style = {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '0.8rem',
    letterSpacing: '-0.01em'
  };

  const cardContentPStyle = {
    color: '#64748b',
    fontSize: '1rem',
    lineHeight: '1.6',
    marginBottom: '1.5rem'
  };

  const tagsContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.8rem',
    marginBottom: '1.5rem'
  };

  const getTagStyle = (type) => {
    const styles = {
      duration: {
        background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
        color: '#1e40af'
      },
      price: {
        background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
        color: '#15803d'
      },
      group: {
        background: 'linear-gradient(135deg, #f3e8ff, #e9d5ff)',
        color: '#7c3aed'
      }
    };
    
    return {
      fontSize: '0.9rem',
      fontWeight: '600',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      letterSpacing: '0.02em',
      ...styles[type]
    };
  };

  const bookButtonStyle = {
    width: 'auto',
    display: 'block',
    margin: '1.5rem auto 0 auto',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '1rem 2rem',
    border: 'none',
    borderRadius: '16px',
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
    position: 'relative',
    overflow: 'hidden'
  };

  const loadingErrorStyle = {
    textAlign: 'center',
    paddingTop: '3rem',
    paddingBottom: '3rem'
  };

  const errorMessageStyle = {
    color: '#ef4444',
    fontWeight: '600',
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '2rem 3rem',
    borderRadius: '20px',
    display: 'inline-block',
    boxShadow: '0 8px 25px rgba(239, 68, 68, 0.2)',
    border: '2px solid rgba(239, 68, 68, 0.2)',
    fontSize: '1.1rem',
    position: 'relative'
  };

  const noResultsStyle = {
    color: '#6b7280',
    fontWeight: '500',
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '2rem 3rem',
    borderRadius: '20px',
    display: 'inline-block',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    border: '2px solid rgba(107, 114, 128, 0.2)',
    fontSize: '1.1rem',
    position: 'relative'
  };

  // State for hover effects
  const [hoveredCard, setHoveredCard] = useState(null);

  // Styles
  const backBtnStyle = {
    position: 'absolute',
    top: '24px',
    left: '24px',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '999px',
    padding: '0.6rem 1.2rem',
    fontWeight: 600,
    fontSize: '1rem',
    boxShadow: '0 4px 16px rgba(102,126,234,0.15)',
    cursor: 'pointer',
    transition: 'background 0.2s, box-shadow 0.2s',
  };

  return (
    <div className="planner-page" style={{ position: 'relative' }}>
      <button
        style={backBtnStyle}
        onClick={() => navigate('/')}
        className="planner-back-btn"
      >
        <FaArrowLeft style={{ marginRight: '0.5rem' }} />
        Back
      </button>
      <div style={plannerPageStyle}>
        <h2 style={h2Style}>Now planning your holiday to {formattedLocation}</h2>

        {step === 1 && (
          <>
            <h3 style={h3Style}>What's the duration of your holiday?</h3>
            <div style={cardOptionsStyle}>
              {[
                { label: '1-2 Days', icon: '🌗' },
                { label: '3-4 Days', icon: '🌖' },
                { label: '5-6 Days', icon: '🌕' },
                { label: '7+ Days', icon: '🌞', ourPick: true },
              ].map(({ label, icon, ourPick }, index) => {
                const isSelected = currentSelection.duration === label;
                const isHovered = hoveredCard === `duration-${index}`;
                return (
                  <div
                    key={index}
                    style={getCardOptionStyle(isSelected, isHovered)}
                    onClick={() => handleDurationClick(label)}
                    onMouseEnter={() => setHoveredCard(`duration-${index}`)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {ourPick && <div style={badgeTopLeftStyle}>OUR PICK</div>}
                    {isSelected && <div style={checkmarkStyle}>✔</div>}
                    <div style={cardImageCircleStyle}>
                      <span style={iconStyle}>{icon}</span>
                    </div>
                    <div style={cardLabelStyle}>{label}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h3 style={h3Style}>Who is travelling with you?</h3>
            <div style={cardOptionsStyle}>
              {[
                { label: 'Couple', icon: '❤️' },
                { label: 'Family', icon: '👨‍👩‍👧‍👦' },
                { label: 'Friends', icon: '🧑‍🤝‍🧑' },
                { label: 'Solo', icon: '🧍‍♂️' },
              ].map(({ label, icon }, i) => {
                const isSelected = currentSelection.groupType === label;
                const isHovered = hoveredCard === `group-${i}`;
                return (
                  <div
                    key={i}
                    style={getCardOptionStyle(isSelected, isHovered)}
                    onClick={() => handleGroupClick(label)}
                    onMouseEnter={() => setHoveredCard(`group-${i}`)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {isSelected && <div style={checkmarkStyle}>✔</div>}
                    <div style={cardImageCircleStyle}>
                      <span style={iconStyle}>{icon}</span>
                    </div>
                    <div style={cardLabelStyle}>{label}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {step === 3 && (
          <div style={resultsWrapperStyle}>
            <div style={resultsHeadingStyle}>
              <h2 style={resultsH2Style}>Holiday Plan Summary</h2>
              <div style={summaryContainerStyle}>
                <div style={getSummaryItemStyle(0)}>
                  <span style={{...getIconBeforeStyle(0), position: 'absolute', left: '-12px', top: '50%', transform: 'translateY(-50%)', background: '#ff6b6b', padding: '6px', borderRadius: '50%', fontSize: '0.9rem', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>🌍</span>
                  Destination: {latestTrip.destination}
                </div>
                <div style={getSummaryItemStyle(1)}>
                  <span style={{...getIconBeforeStyle(1), position: 'absolute', left: '-12px', top: '50%', transform: 'translateY(-50%)', background: '#4ecdc4', padding: '6px', borderRadius: '50%', fontSize: '0.9rem', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>⏰</span>
                  Duration: {latestTrip.duration}
                </div>
                <div style={getSummaryItemStyle(2)}>
                  <span style={{...getIconBeforeStyle(2), position: 'absolute', left: '-12px', top: '50%', transform: 'translateY(-50%)', background: '#45b7d1', padding: '6px', borderRadius: '50%', fontSize: '0.9rem', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>👥</span>
                  Group: {latestTrip.groupType}
                </div>
              </div>
            </div>

            {loading ? (
              <div style={loadingErrorStyle}>Loading packages...</div>
            ) : error ? (
              <div style={loadingErrorStyle}>
                <div style={errorMessageStyle}>
                  <div style={{fontSize: '2rem', marginBottom: '1rem'}}>⚠️</div>
                  {error}
                </div>
              </div>
            ) : filteredPackages.length === 0 ? (
              <div style={loadingErrorStyle}>
                <div style={noResultsStyle}>
                  <div style={{fontSize: '2rem', marginBottom: '1rem'}}>🔍</div>
                  No packages found matching your criteria. Please try different duration or group type.
                </div>
              </div>
            ) : (
              <div style={resultsSectionStyle}>
                <h3 style={resultsSectionH3Style}>Available Packages for {latestTrip.destination}</h3>
                <div style={cardListStyle}>
                  {filteredPackages.map((pkg) => (
                    <div 
                      style={infoCardStyle} 
                      key={pkg._id}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px)';
                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12)';
                        e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.8)';
                      }}
                    >
                      {/* Top gradient line */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #667eea, #764ba2)'
                      }}></div>
                      
                      <div style={cardIconStyle}>🎒</div>
                      <div>
                        <h4 style={cardContentH4Style}>{pkg.name}</h4>
                        <p style={cardContentPStyle}>{pkg.description}</p>
                        <div style={tagsContainerStyle}>
                          <span style={getTagStyle('duration')}>
                            {pkg.duration} Days
                          </span>
                          <span style={getTagStyle('price')}>
                            ₹{pkg.price.toLocaleString()}
                          </span>
                          <span style={getTagStyle('group')}>
                            Max {pkg.maxGroupSize} People
                          </span>
                        </div>
                        <button
                          onClick={() => handleBookNow(pkg._id)}
                          style={bookButtonStyle}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                          }}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlannerPage;