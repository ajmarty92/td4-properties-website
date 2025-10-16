// Eventbrite API Integration for 321 La Quinta Website
// Automatically fetches and displays events in the Coachella Valley area

const EVENTBRITE_CONFIG = {
    // Eventbrite OAuth token
    token: 'R4FQHUGSKFTFEM6JRP',
    
    // Search parameters for Coachella Valley events
    searchParams: {
        'location.address': 'La Quinta, CA',
        'location.within': '50mi', // 50 mile radius covers entire Coachella Valley
        'expand': 'venue,category',
        'sort_by': 'date',
        'page_size': 20
    },
    
    // Major venues to prioritize
    priorityVenues: [
        'PGA West',
        'Indian Wells Tennis Garden',
        'Empire Polo Club',
        'Acrisure Arena',
        'Desert International Horse Park',
        'McCallum Theatre',
        'La Quinta Arts Foundation'
    ],
    
    // Event categories to include
    categories: [
        'Music',
        'Sports & Fitness',
        'Arts',
        'Food & Drink',
        'Community',
        'Performing & Visual Arts'
    ]
};

// Fallback events if API fails or no events found
const FALLBACK_EVENTS = [
    {
        name: '⛳ American Express PGA Golf Tournament',
        description: 'Watch the pros compete on PGA West\'s Stadium Course - right in your backyard!',
        start: { local: '2026-01-15' },
        url: 'https://theamexgolf.com/',
        venue: { name: 'PGA West Stadium Course' },
        distance: 'Walking Distance',
        image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800'
    },
    {
        name: '🐴 Desert International Horse Park Events',
        description: 'World-class equestrian competitions and shows throughout the season.',
        start: { local: '2026-02-01' },
        url: 'https://deserthorsepark.com/',
        venue: { name: 'Desert International Horse Park' },
        distance: '15 minutes',
        image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800'
    },
    {
        name: '🎾 BNP Paribas Open Tennis',
        description: 'One of tennis\'s premier events with senior-friendly seating and amenities.',
        start: { local: '2026-03-10' },
        url: 'https://bnpparibasopen.com/',
        venue: { name: 'Indian Wells Tennis Garden' },
        distance: '15 minutes',
        image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800'
    },
    {
        name: '🎨 La Quinta Arts Festival',
        description: 'Renowned juried art show featuring 200+ artists in beautiful Old Town.',
        start: { local: '2026-03-20' },
        url: 'https://lqaf.com/',
        venue: { name: 'Old Town La Quinta' },
        distance: '10 minutes',
        image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800'
    },
    {
        name: '🎵 Coachella Music Festival',
        description: 'World-famous music festival drawing top artists and performers.',
        start: { local: '2026-04-10' },
        url: 'https://www.coachella.com/',
        venue: { name: 'Empire Polo Club' },
        distance: '25 minutes',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800'
    },
    {
        name: '🤠 Stagecoach Festival',
        description: 'Premier country music festival with top country artists.',
        start: { local: '2026-04-24' },
        url: 'https://www.stagecoachfestival.com/',
        venue: { name: 'Empire Polo Club' },
        distance: '25 minutes',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'
    },
    {
        name: '🎭 Acrisure Arena Events',
        description: 'State-of-the-art venue hosting major concerts, hockey, and special events.',
        start: { local: '2026-01-01' },
        url: 'https://acrisurearena.com/',
        venue: { name: 'Acrisure Arena' },
        distance: '25 minutes',
        image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800'
    }
];

// Fetch events from Eventbrite API
async function fetchEventbriteEvents() {
    try {
        const params = new URLSearchParams(EVENTBRITE_CONFIG.searchParams);
        const response = await fetch(
            `https://www.eventbriteapi.com/v3/events/search/?${params}`,
            {
                headers: {
                    'Authorization': `Bearer ${EVENTBRITE_CONFIG.token}`
                }
            }
        );
        
        if (!response.ok) {
            throw new Error('Eventbrite API request failed');
        }
        
        const data = await response.json();
        return data.events || [];
    } catch (error) {
        console.error('Error fetching Eventbrite events:', error);
        return null;
    }
}

// Process and filter events
function processEvents(events) {
    if (!events || events.length === 0) {
        return FALLBACK_EVENTS;
    }
    
    // Filter for upcoming events only
    const now = new Date();
    const upcomingEvents = events.filter(event => {
        const eventDate = new Date(event.start.local);
        return eventDate >= now;
    });
    
    // Sort by date
    upcomingEvents.sort((a, b) => {
        return new Date(a.start.local) - new Date(b.start.local);
    });
    
    // Prioritize major venues
    const priorityEvents = upcomingEvents.filter(event => {
        return EVENTBRITE_CONFIG.priorityVenues.some(venue => 
            event.venue?.name?.includes(venue)
        );
    });
    
    const otherEvents = upcomingEvents.filter(event => {
        return !EVENTBRITE_CONFIG.priorityVenues.some(venue => 
            event.venue?.name?.includes(venue)
        );
    });
    
    // Combine priority events first, then others
    const combinedEvents = [...priorityEvents, ...otherEvents];
    
    // Merge with fallback events for major annual events
    const mergedEvents = mergeFallbackEvents(combinedEvents);
    
    // Return top 12 events
    return mergedEvents.slice(0, 12);
}

// Merge fallback events with API events
function mergeFallbackEvents(apiEvents) {
    const merged = [...FALLBACK_EVENTS];
    
    // Add API events that aren't duplicates
    apiEvents.forEach(apiEvent => {
        const isDuplicate = merged.some(fallbackEvent => 
            fallbackEvent.name.toLowerCase().includes(apiEvent.name.toLowerCase().substring(0, 10))
        );
        
        if (!isDuplicate) {
            merged.push(apiEvent);
        }
    });
    
    // Sort by date
    merged.sort((a, b) => {
        return new Date(a.start.local) - new Date(b.start.local);
    });
    
    return merged;
}

// Calculate distance from La Quinta
function calculateDistance(venueName) {
    const distanceMap = {
        'PGA West': 'Walking Distance',
        'Old Town La Quinta': '10 minutes',
        'Indian Wells': '15 minutes',
        'Desert Horse Park': '15 minutes',
        'Palm Desert': '20 minutes',
        'Acrisure Arena': '25 minutes',
        'Empire Polo': '25 minutes',
        'Indio': '25 minutes',
        'Palm Springs': '35 minutes'
    };
    
    for (const [key, distance] of Object.entries(distanceMap)) {
        if (venueName?.includes(key)) {
            return distance;
        }
    }
    
    return '20-30 minutes';
}

// Get Google Maps link
function getGoogleMapsLink(venueName, venueAddress) {
    const query = venueAddress || venueName || 'La Quinta, CA';
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}

// Format date for display
function formatEventDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Get month from date
function getEventMonth(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long' });
}

// Get default image based on event name/category
function getDefaultImage(eventName, category) {
    const name = eventName.toLowerCase();
    
    if (name.includes('golf')) return 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800';
    if (name.includes('horse') || name.includes('equestrian')) return 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800';
    if (name.includes('tennis')) return 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800';
    if (name.includes('art')) return 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800';
    if (name.includes('music') || name.includes('concert') || name.includes('coachella')) return 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800';
    if (name.includes('country') || name.includes('stagecoach')) return 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800';
    if (name.includes('food') || name.includes('wine')) return 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800';
    
    return 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800';
}

// Render events to the page
function renderEvents(events) {
    const eventsGrid = document.querySelector('.events-grid');
    
    if (!eventsGrid) {
        console.error('Events grid not found');
        return;
    }
    
    // Clear existing events
    eventsGrid.innerHTML = '';
    
    // Render each event
    events.forEach(event => {
        const eventCard = createEventCard(event);
        eventsGrid.appendChild(eventCard);
    });
}

// Create event card HTML element
function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    
    const venueName = event.venue?.name || 'Coachella Valley';
    const venueAddress = event.venue?.address?.localized_address_display || '';
    const distance = event.distance || calculateDistance(venueName);
    const imageUrl = event.image || event.logo?.url || getDefaultImage(event.name, event.category?.name);
    const eventUrl = event.url || '#';
    const month = getEventMonth(event.start.local);
    const formattedDate = formatEventDate(event.start.local);
    const mapsLink = getGoogleMapsLink(venueName, venueAddress);
    
    card.innerHTML = `
        <div class="event-image" style="background-image: url('${imageUrl}');">
            <span class="event-date">${month}</span>
        </div>
        <div class="event-content">
            <h3><a href="${eventUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">${event.name}</a></h3>
            <p class="event-full-date" style="font-size: 0.85rem; color: var(--accent-color); margin-bottom: 0.5rem;">${formattedDate}</p>
            <p>${event.description || 'Click to learn more about this event.'}</p>
            <a href="${mapsLink}" target="_blank" class="event-distance">${distance} - Get Directions</a>
        </div>
    `;
    
    return card;
}

// Initialize events
async function initializeEvents() {
    console.log('Initializing Eventbrite events...');
    
    // Don't show loading state - keep static events visible
    const eventsGrid = document.querySelector('.events-grid');
    
    // Fetch events from Eventbrite
    const apiEvents = await fetchEventbriteEvents();
    
    // Only update if we got events from the API
    if (apiEvents && apiEvents.length > 0) {
        // Process events
        const events = processEvents(apiEvents);
        
        // Render events (this will replace static events with API events)
        renderEvents(events);
        
        console.log(`Displayed ${events.length} events from Eventbrite API`);
    } else {
        console.log('No Eventbrite events found, keeping static events');
    }
}

// Auto-refresh events every hour
function startAutoRefresh() {
    // Refresh every hour (3600000 milliseconds)
    setInterval(initializeEvents, 3600000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeEvents();
        startAutoRefresh();
    });
} else {
    initializeEvents();
    startAutoRefresh();
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchEventbriteEvents,
        processEvents,
        renderEvents,
        FALLBACK_EVENTS
    };
}