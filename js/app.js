// Mock Data Store
const store = {
    user: {
        name: 'Alex Traveler',
        avatar: 'https://i.pravatar.cc/150?img=68'
    },
    trips: [
        {
            id: 't1',
            title: 'Summer in Japan',
            startDate: '2027-06-15',
            endDate: '2027-06-30',
            image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&auto=format&fit=crop',
            status: 'upcoming',
            destinations: ['Tokyo', 'Kyoto', 'Osaka'],
            budget: 3500
        },
        {
            id: 't2',
            title: 'European Backpacking',
            startDate: '2027-09-01',
            endDate: '2027-09-21',
            image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=600&auto=format&fit=crop',
            status: 'planning',
            destinations: ['Paris', 'Rome', 'Barcelona'],
            budget: 2800
        }
    ],
    destinations: [
        { name: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=400&auto=format&fit=crop' },
        { name: 'Santorini, Greece', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=400&auto=format&fit=crop' },
        { name: 'Banff, Canada', image: 'https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?q=80&w=400&auto=format&fit=crop' }
    ]
};

// View Templates
const views = {
    'dashboard': () => `
        <div class="view-enter">
            <header class="page-header">
                <div>
                    <h1 class="page-title">Welcome back, ${store.user.name.split(' ')[0]}! 👋</h1>
                    <p class="page-subtitle">Ready for your next adventure?</p>
                </div>
                <button class="btn btn-primary" onclick="navigate('create-trip')">
                    <i class="fa-solid fa-plus"></i> Plan New Trip
                </button>
            </header>

            <!-- Dashboard Stats -->
            <div class="dashboard-stats" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 40px;">
                <div class="card" style="display: flex; align-items: center; gap: 20px;">
                    <div style="background: var(--primary-light); color: var(--primary); padding: 16px; border-radius: var(--radius-md); font-size: 24px;">
                        <i class="fa-solid fa-plane-departure"></i>
                    </div>
                    <div>
                        <div style="font-size: 24px; font-weight: 700;">${store.trips.filter(t => t.status === 'upcoming').length}</div>
                        <div style="color: var(--text-muted); font-size: 14px;">Upcoming Trips</div>
                    </div>
                </div>
                <div class="card" style="display: flex; align-items: center; gap: 20px;">
                    <div style="background: var(--secondary-light); color: var(--secondary); padding: 16px; border-radius: var(--radius-md); font-size: 24px;">
                        <i class="fa-solid fa-map-location-dot"></i>
                    </div>
                    <div>
                        <div style="font-size: 24px; font-weight: 700;">12</div>
                        <div style="color: var(--text-muted); font-size: 14px;">Cities Visited</div>
                    </div>
                </div>
                <div class="card" style="display: flex; align-items: center; gap: 20px;">
                    <div style="background: rgba(6, 182, 212, 0.1); color: var(--accent); padding: 16px; border-radius: var(--radius-md); font-size: 24px;">
                        <i class="fa-solid fa-camera"></i>
                    </div>
                    <div>
                        <div style="font-size: 24px; font-weight: 700;">1.2k</div>
                        <div style="color: var(--text-muted); font-size: 14px;">Memories Shared</div>
                    </div>
                </div>
            </div>

            <h2 style="margin-bottom: 24px; font-size: 20px;">Your Active Plans</h2>
            <div class="grid-cards" style="margin-bottom: 48px;">
                ${store.trips.map(trip => `
                    <div class="card trip-card" onclick="navigate('itinerary-view', '${trip.id}')" style="cursor:pointer;">
                        <div class="trip-card-badge">${trip.status.toUpperCase()}</div>
                        <div class="trip-card-image" style="background-image: url('${trip.image}')"></div>
                        <div class="trip-card-content">
                            <h3 class="trip-card-title">${trip.title}</h3>
                            <div class="trip-card-dates">
                                <i class="fa-regular fa-calendar"></i>
                                ${new Date(trip.startDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})} - 
                                ${new Date(trip.endDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}
                            </div>
                            <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">
                                <i class="fa-solid fa-location-dot" style="margin-right: 4px;"></i> 
                                ${trip.destinations.join(', ')}
                            </div>
                            <div class="trip-card-footer">
                                <span class="trip-card-cost">Est. $${trip.budget}</span>
                                <button class="btn btn-primary-outline" style="padding: 6px 12px; font-size: 13px;">View</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <h2 style="margin-bottom: 24px; font-size: 20px;">Trending Destinations</h2>
            <div style="display: flex; gap: 20px; overflow-x: auto; padding-bottom: 20px;">
                ${store.destinations.map(dest => `
                    <div style="min-width: 250px; height: 300px; border-radius: var(--radius-lg); background-image: linear-gradient(to top, rgba(0,0,0,0.8), transparent), url('${dest.image}'); background-size: cover; background-position: center; display: flex; align-items: flex-end; padding: 20px; color: white; cursor: pointer; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                        <div>
                            <h3 style="font-size: 18px; font-weight: 600;">${dest.name}</h3>
                            <p style="font-size: 13px; opacity: 0.8; margin-top: 4px;">Explore activities <i class="fa-solid fa-arrow-right" style="font-size:10px; margin-left: 4px;"></i></p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `,
    'create-trip': () => `
        <div class="view-enter" style="max-width: 800px; margin: 0 auto;">
            <header class="page-header">
                <div>
                    <button class="btn btn-icon" onclick="navigate('dashboard')" style="margin-bottom: 16px;">
                        <i class="fa-solid fa-arrow-left"></i>
                    </button>
                    <h1 class="page-title">Design Your Journey</h1>
                    <p class="page-subtitle">Let's start with the basics of your next adventure.</p>
                </div>
            </header>
            
            <div class="card glass-panel" style="padding: 40px;">
                <form id="create-trip-form" onsubmit="event.preventDefault(); navigate('itinerary-builder');">
                    <div class="form-group">
                        <label class="form-label">Trip Name</label>
                        <input type="text" class="form-control" placeholder="e.g., Euro Trip 2027" required style="font-size: 20px; padding: 16px;">
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                        <div class="form-group">
                            <label class="form-label">Start Date</label>
                            <input type="date" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">End Date</label>
                            <input type="date" class="form-control" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Cover Photo (Optional)</label>
                        <div style="border: 2px dashed var(--border-color); border-radius: var(--radius-md); padding: 40px; text-align: center; color: var(--text-muted); cursor: pointer; transition: all 0.3s;" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='var(--border-color)'">
                            <i class="fa-solid fa-cloud-arrow-up" style="font-size: 32px; margin-bottom: 12px; color: var(--primary);"></i>
                            <p>Drag & drop or click to upload</p>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Description / Notes</label>
                        <textarea class="form-control" rows="4" placeholder="What's the vibe of this trip?"></textarea>
                    </div>
                    
                    <div style="display: flex; justify-content: flex-end; gap: 16px; margin-top: 32px;">
                        <button type="button" class="btn" onclick="navigate('dashboard')">Cancel</button>
                        <button type="submit" class="btn btn-primary" style="padding: 14px 32px;">
                            Continue to Itinerary <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `,
    'itinerary-builder': () => `
        <div class="view-enter">
            <header class="page-header" style="align-items: flex-start;">
                <div>
                    <button class="btn btn-icon" onclick="navigate('create-trip')" style="margin-bottom: 16px;">
                        <i class="fa-solid fa-arrow-left"></i>
                    </button>
                    <h1 class="page-title">Build Your Itinerary</h1>
                    <p class="page-subtitle">Euro Trip 2027 • Sep 1 - Sep 21</p>
                </div>
                <div style="display: flex; gap: 12px;">
                    <button class="btn btn-primary-outline" onclick="navigate('budget-view')"><i class="fa-solid fa-wallet"></i> View Budget</button>
                    <button class="btn btn-primary" onclick="navigate('dashboard')"><i class="fa-solid fa-check"></i> Save Trip</button>
                </div>
            </header>

            <div style="display: grid; grid-template-columns: 1fr 350px; gap: 32px; align-items: start;">
                <!-- Builder Timeline -->
                <div class="itinerary-timeline">
                    <!-- Day 1 -->
                    <div class="card" style="margin-bottom: 24px; border-left: 4px solid var(--primary);">
                        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 16px;">
                            <div>
                                <h3 style="font-size: 18px;">Day 1: Arrival in Paris</h3>
                                <div style="color: var(--text-muted); font-size: 14px;">Sep 1, 2027</div>
                            </div>
                            <button class="btn btn-icon"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                        </div>
                        
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <!-- Activity Item -->
                            <div style="display: flex; gap: 16px; align-items: stretch; background: var(--bg-main); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                                <div style="width: 60px; font-weight: 600; color: var(--text-muted); font-size: 14px; padding-top: 4px;">10:00 AM</div>
                                <div style="flex-grow: 1;">
                                    <div style="font-weight: 600;">Check-in at Hotel Lutetia</div>
                                    <div style="font-size: 13px; color: var(--text-muted);">St. Germain des Prés</div>
                                </div>
                                <div style="color: var(--accent); font-weight: 600; font-size: 14px; padding-top: 4px;">$250</div>
                            </div>
                            
                            <div style="display: flex; gap: 16px; align-items: stretch; background: var(--bg-main); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                                <div style="width: 60px; font-weight: 600; color: var(--text-muted); font-size: 14px; padding-top: 4px;">1:00 PM</div>
                                <div style="flex-grow: 1;">
                                    <div style="font-weight: 600;">Eiffel Tower Tour</div>
                                    <div style="font-size: 13px; color: var(--text-muted);">Sightseeing</div>
                                </div>
                                <div style="color: var(--accent); font-weight: 600; font-size: 14px; padding-top: 4px;">$45</div>
                            </div>
                            
                            <button class="btn btn-primary-outline" style="width: 100%; border-style: dashed; margin-top: 8px;">
                                <i class="fa-solid fa-plus"></i> Add Activity
                            </button>
                        </div>
                    </div>

                    <!-- Day 2 -->
                    <div class="card" style="margin-bottom: 24px; border-left: 4px solid var(--secondary);">
                        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 16px;">
                            <div>
                                <h3 style="font-size: 18px;">Day 2: Art & Culture</h3>
                                <div style="color: var(--text-muted); font-size: 14px;">Sep 2, 2027</div>
                            </div>
                        </div>
                        <button class="btn btn-primary-outline" style="width: 100%; border-style: dashed;">
                            <i class="fa-solid fa-plus"></i> Add Activity
                        </button>
                    </div>
                    
                    <button class="btn btn-primary" style="width: 100%; padding: 16px; font-size: 16px;">
                        <i class="fa-solid fa-plus"></i> Add Another Day / Stop
                    </button>
                </div>

                <!-- Explorer Sidebar -->
                <div class="card" style="position: sticky; top: 32px; height: calc(100vh - 100px); display: flex; flex-direction: column; padding: 0;">
                    <div style="padding: 20px; border-bottom: 1px solid var(--border-color);">
                        <h3 style="margin-bottom: 16px;">Discover Paris</h3>
                        <div class="form-group" style="margin: 0;">
                            <div style="position: relative;">
                                <i class="fa-solid fa-search" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
                                <input type="text" class="form-control" placeholder="Search activities..." style="padding-left: 44px; border-radius: var(--radius-full);">
                            </div>
                        </div>
                    </div>
                    <div style="flex-grow: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 16px; background: var(--bg-main);">
                        <!-- Recommendation Item -->
                        <div class="card" style="padding: 12px; display: flex; gap: 12px; box-shadow: var(--shadow-sm);">
                            <img src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=150&auto=format&fit=crop" style="width: 80px; height: 80px; border-radius: var(--radius-md); object-fit: cover;">
                            <div style="display: flex; flex-direction: column; justify-content: center; flex-grow: 1;">
                                <div style="font-weight: 600; font-size: 14px;">Louvre Museum</div>
                                <div style="font-size: 12px; color: var(--text-muted);">Art • 3-4 hours</div>
                                <div style="color: var(--accent); font-weight: 600; font-size: 13px; margin-top: 4px;">$20</div>
                            </div>
                            <button class="btn btn-icon" style="align-self: center; width: 32px; height: 32px;"><i class="fa-solid fa-plus" style="font-size: 12px;"></i></button>
                        </div>
                        <div class="card" style="padding: 12px; display: flex; gap: 12px; box-shadow: var(--shadow-sm);">
                            <img src="https://images.unsplash.com/photo-1550340499-a6c60fc8287c?q=80&w=150&auto=format&fit=crop" style="width: 80px; height: 80px; border-radius: var(--radius-md); object-fit: cover;">
                            <div style="display: flex; flex-direction: column; justify-content: center; flex-grow: 1;">
                                <div style="font-weight: 600; font-size: 14px;">Seine River Cruise</div>
                                <div style="font-size: 12px; color: var(--text-muted);">Tour • 1.5 hours</div>
                                <div style="color: var(--accent); font-weight: 600; font-size: 13px; margin-top: 4px;">$35</div>
                            </div>
                            <button class="btn btn-icon" style="align-self: center; width: 32px; height: 32px;"><i class="fa-solid fa-plus" style="font-size: 12px;"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    'budget-view': () => `
        <div class="view-enter" style="max-width: 900px; margin: 0 auto;">
            <header class="page-header">
                <div>
                    <button class="btn btn-icon" onclick="navigate('itinerary-builder')" style="margin-bottom: 16px;">
                        <i class="fa-solid fa-arrow-left"></i>
                    </button>
                    <h1 class="page-title">Budget Breakdown</h1>
                    <p class="page-subtitle">Euro Trip 2027</p>
                </div>
            </header>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px;">
                <!-- Total Cost Card -->
                <div class="card glass-panel" style="background: var(--gradient-brand); color: white; border: none; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 48px;">
                    <div style="font-size: 16px; opacity: 0.9; margin-bottom: 8px;">Total Estimated Cost</div>
                    <div style="font-size: 56px; font-weight: 700; letter-spacing: -1px;">$2,845</div>
                    <div style="margin-top: 16px; background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: var(--radius-full); font-size: 14px;">
                        <i class="fa-solid fa-arrow-trend-down"></i> $155 under budget goal
                    </div>
                </div>

                <!-- Categories -->
                <div class="card" style="display: flex; flex-direction: column; justify-content: center;">
                    <h3 style="margin-bottom: 24px;">By Category</h3>
                    
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        <!-- Category Item -->
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                                <span><i class="fa-solid fa-bed" style="color: var(--secondary); margin-right: 8px;"></i> Accommodation</span>
                                <span style="font-weight: 600;">$1,200</span>
                            </div>
                            <div style="height: 8px; background: var(--bg-main); border-radius: var(--radius-full); overflow: hidden;">
                                <div style="height: 100%; background: var(--secondary); width: 42%;"></div>
                            </div>
                        </div>
                        
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                                <span><i class="fa-solid fa-plane" style="color: var(--primary); margin-right: 8px;"></i> Flights/Transport</span>
                                <span style="font-weight: 600;">$850</span>
                            </div>
                            <div style="height: 8px; background: var(--bg-main); border-radius: var(--radius-full); overflow: hidden;">
                                <div style="height: 100%; background: var(--primary); width: 30%;"></div>
                            </div>
                        </div>
                        
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                                <span><i class="fa-solid fa-utensils" style="color: var(--accent); margin-right: 8px;"></i> Food & Dining</span>
                                <span style="font-weight: 600;">$500</span>
                            </div>
                            <div style="height: 8px; background: var(--bg-main); border-radius: var(--radius-full); overflow: hidden;">
                                <div style="height: 100%; background: var(--accent); width: 18%;"></div>
                            </div>
                        </div>

                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                                <span><i class="fa-solid fa-ticket" style="color: #10B981; margin-right: 8px;"></i> Activities</span>
                                <span style="font-weight: 600;">$295</span>
                            </div>
                            <div style="height: 8px; background: var(--bg-main); border-radius: var(--radius-full); overflow: hidden;">
                                <div style="height: 100%; background: #10B981; width: 10%;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h3 style="margin-bottom: 16px;">Daily Average</h3>
                <div style="display: flex; align-items: baseline; gap: 12px;">
                    <span style="font-size: 32px; font-weight: 700; color: var(--text-main);">$135</span>
                    <span style="color: var(--text-muted);">per day</span>
                </div>
        </div>
    `,
    'login': () => `
        <div class="view-enter" style="display:flex; height:calc(100vh - 64px); align-items:center; justify-content:center; margin: -32px -48px; background: var(--bg-main);">
            <div class="card glass-panel" style="width: 100%; max-width: 400px; padding: 40px; text-align: center;">
                <div class="brand" style="justify-content: center; margin-bottom: 32px;">
                    <i class="fa-solid fa-earth-americas"></i>
                    <span>GlobeTrotter</span>
                </div>
                <h2 style="margin-bottom: 24px;">Welcome Back</h2>
                <form onsubmit="event.preventDefault(); navigate('dashboard');">
                    <div class="form-group" style="text-align: left;">
                        <label class="form-label">Email Address</label>
                        <input type="email" class="form-control" value="alex@example.com" required>
                    </div>
                    <div class="form-group" style="text-align: left;">
                        <label class="form-label">Password</label>
                        <input type="password" class="form-control" value="password123" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 16px;">Log In</button>
                </form>
                <div style="margin-top: 24px; color: var(--text-muted); font-size: 14px;">
                    Don't have an account? <a href="#" onclick="navigate('dashboard')" style="color: var(--primary); font-weight: 600;">Sign up</a>
                </div>
            </div>
        </div>
    `,
    'profile': () => `
        <div class="view-enter" style="max-width: 600px; margin: 0 auto;">
            <header class="page-header">
                <h1 class="page-title">User Settings</h1>
            </header>
            <div class="card">
                <div style="display:flex; align-items:center; gap: 24px; margin-bottom: 32px;">
                    <img src="${store.user.avatar}" style="width: 100px; height: 100px; border-radius: var(--radius-full);">
                    <div>
                        <button class="btn btn-primary-outline" style="margin-bottom: 8px;">Change Photo</button>
                        <div style="font-size: 13px; color: var(--text-muted);">JPG or PNG, max 2MB</div>
                    </div>
                </div>
                <form onsubmit="event.preventDefault(); alert('Profile Saved!');">
                    <div class="form-group">
                        <label class="form-label">Full Name</label>
                        <input type="text" class="form-control" value="${store.user.name}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email Address</label>
                        <input type="email" class="form-control" value="alex@example.com">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Preferred Currency</label>
                        <select class="form-control">
                            <option>USD ($)</option>
                            <option>EUR (€)</option>
                            <option>GBP (£)</option>
                        </select>
                    </div>
                    <div style="display: flex; justify-content: flex-end; margin-top: 32px;">
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    `,
    'my-trips': () => `
        <div class="view-enter">
            <header class="page-header">
                <div>
                    <h1 class="page-title">My Trips</h1>
                    <p class="page-subtitle">Manage all your past and upcoming adventures.</p>
                </div>
                <button class="btn btn-primary" onclick="navigate('create-trip')">
                    <i class="fa-solid fa-plus"></i> New Trip
                </button>
            </header>
            <div class="grid-cards">
                ${store.trips.map(trip => `
                    <div class="card trip-card">
                        <div class="trip-card-badge">${trip.status.toUpperCase()}</div>
                        <div class="trip-card-image" style="background-image: url('${trip.image}')"></div>
                        <div class="trip-card-content">
                            <h3 class="trip-card-title">${trip.title}</h3>
                            <div class="trip-card-dates">
                                <i class="fa-regular fa-calendar"></i>
                                ${new Date(trip.startDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})} - 
                                ${new Date(trip.endDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}
                            </div>
                            <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">
                                <i class="fa-solid fa-location-dot" style="margin-right: 4px;"></i> 
                                ${trip.destinations.join(', ')}
                            </div>
                            <div class="trip-card-footer">
                                <button class="btn btn-primary-outline" onclick="navigate('itinerary-builder')" style="padding: 6px 12px; font-size: 13px;">Edit</button>
                                <button class="btn" style="padding: 6px 12px; font-size: 13px; color: #EF4444;"><i class="fa-solid fa-trash"></i></button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `,
    'city-search': () => `
        <div class="view-enter">
            <header class="page-header">
                <div>
                    <h1 class="page-title">Explore Cities</h1>
                    <p class="page-subtitle">Find your next destination.</p>
                </div>
            </header>
            <div style="display: flex; gap: 32px;">
                <div class="card" style="width: 300px; height: fit-content;">
                    <h3 style="margin-bottom: 16px;">Filters</h3>
                    <div class="form-group">
                        <label class="form-label">Region</label>
                        <select class="form-control"><option>All Regions</option><option>Europe</option><option>Asia</option></select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Cost Index</label>
                        <select class="form-control"><option>Any</option><option>Budget ($)</option><option>Luxury ($$$)</option></select>
                    </div>
                </div>
                <div style="flex-grow: 1;">
                    <div class="form-group" style="margin-bottom: 32px;">
                        <input type="text" class="form-control" placeholder="Search cities (e.g. Tokyo, Paris)..." style="padding: 16px; font-size: 18px; border-radius: var(--radius-full);">
                    </div>
                    <div class="grid-cards">
                        ${store.destinations.map(dest => `
                            <div class="card" style="padding:0; overflow:hidden;">
                                <img src="${dest.image}" style="width:100%; height:180px; object-fit:cover;">
                                <div style="padding: 20px;">
                                    <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">${dest.name}</h3>
                                    <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 16px;">High popularity • $$ Cost</p>
                                    <button class="btn btn-primary-outline" style="width:100%;"><i class="fa-solid fa-plus"></i> Add to Trip</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `,
    'activity-search': () => `
        <div class="view-enter">
            <header class="page-header">
                <div>
                    <h1 class="page-title">Find Activities</h1>
                    <p class="page-subtitle">Discover things to do at your stops.</p>
                </div>
            </header>
            <div style="display: flex; gap: 32px;">
                <div class="card" style="width: 300px; height: fit-content;">
                    <h3 style="margin-bottom: 16px;">Filters</h3>
                    <div class="form-group">
                        <label class="form-label">Category</label>
                        <select class="form-control"><option>All</option><option>Sightseeing</option><option>Food</option><option>Adventure</option></select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Max Cost</label>
                        <input type="range" class="form-control" style="padding:0; height: 4px;">
                    </div>
                </div>
                <div style="flex-grow: 1;">
                    <div class="grid-cards">
                        <!-- Mock Activity -->
                        <div class="card" style="padding:0; overflow:hidden;">
                            <img src="https://images.unsplash.com/photo-1550340499-a6c60fc8287c?q=80&w=300&auto=format&fit=crop" style="width:100%; height:180px; object-fit:cover;">
                            <div style="padding: 20px;">
                                <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Seine River Cruise</h3>
                                <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 8px;">Tour • 1.5 hours</p>
                                <div style="color: var(--accent); font-weight: 600; margin-bottom: 16px;">$35</div>
                                <button class="btn btn-primary-outline" style="width:100%;"><i class="fa-solid fa-plus"></i> Add to Trip</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    'itinerary-view': () => `
        <div class="view-enter" style="max-width: 800px; margin: 0 auto;">
            <header class="page-header">
                <div>
                    <button class="btn btn-icon" onclick="navigate('my-trips')" style="margin-bottom: 16px;"><i class="fa-solid fa-arrow-left"></i></button>
                    <h1 class="page-title">Summer in Japan</h1>
                    <p class="page-subtitle">Jun 15 - Jun 30, 2027</p>
                </div>
                <div style="display:flex; gap: 12px;">
                    <button class="btn btn-primary-outline" onclick="navigate('calendar-view')"><i class="fa-regular fa-calendar"></i> Calendar</button>
                    <button class="btn btn-primary" onclick="navigate('public-itinerary')"><i class="fa-solid fa-share"></i> Share</button>
                </div>
            </header>
            <div class="card" style="padding: 32px;">
                <h2 style="margin-bottom: 24px;">Trip Timeline</h2>
                <div style="border-left: 2px solid var(--border-color); padding-left: 24px; position: relative;">
                    <!-- Timeline Node -->
                    <div style="position: absolute; width: 16px; height: 16px; background: var(--primary); border-radius: 50%; left: -9px; top: 0;"></div>
                    <h3 style="font-size: 18px; margin-bottom: 16px;">Day 1: Tokyo Arrival</h3>
                    <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px;">
                        <div style="display: flex; gap: 16px; align-items: stretch; background: var(--bg-surface-hover); padding: 12px; border-radius: var(--radius-md);">
                            <div style="width: 60px; font-weight: 600; color: var(--text-muted);">14:00</div>
                            <div>
                                <div style="font-weight: 600;">Check into Shibuya Hotel</div>
                                <div style="font-size: 13px; color: var(--text-muted);">Shibuya City</div>
                            </div>
                        </div>
                    </div>
                    <!-- Timeline Node -->
                    <div style="position: absolute; width: 16px; height: 16px; background: var(--secondary); border-radius: 50%; left: -9px; top: 120px;"></div>
                    <h3 style="font-size: 18px; margin-bottom: 16px;">Day 2: City Exploration</h3>
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <div style="display: flex; gap: 16px; align-items: stretch; background: var(--bg-surface-hover); padding: 12px; border-radius: var(--radius-md);">
                            <div style="width: 60px; font-weight: 600; color: var(--text-muted);">10:00</div>
                            <div>
                                <div style="font-weight: 600;">Meiji Shrine Visit</div>
                                <div style="font-size: 13px; color: var(--text-muted);">Culture</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    'calendar-view': () => `
        <div class="view-enter">
            <header class="page-header">
                <div>
                    <h1 class="page-title">Trip Calendar</h1>
                    <p class="page-subtitle">Visual overview of your dates.</p>
                </div>
                <button class="btn btn-icon" onclick="navigate('itinerary-view')"><i class="fa-solid fa-list"></i></button>
            </header>
            <div class="card" style="overflow-x: auto;">
                <div style="min-width: 800px;">
                    <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: var(--border-color); border: 1px solid var(--border-color);">
                        <div style="background: var(--bg-main); padding: 12px; font-weight: 600; text-align: center;">Sun</div>
                        <div style="background: var(--bg-main); padding: 12px; font-weight: 600; text-align: center;">Mon</div>
                        <div style="background: var(--bg-main); padding: 12px; font-weight: 600; text-align: center;">Tue</div>
                        <div style="background: var(--bg-main); padding: 12px; font-weight: 600; text-align: center;">Wed</div>
                        <div style="background: var(--bg-main); padding: 12px; font-weight: 600; text-align: center;">Thu</div>
                        <div style="background: var(--bg-main); padding: 12px; font-weight: 600; text-align: center;">Fri</div>
                        <div style="background: var(--bg-main); padding: 12px; font-weight: 600; text-align: center;">Sat</div>
                        
                        <!-- Mock Calendar Grid -->
                        <div style="background: var(--bg-surface); padding: 12px; height: 120px; color: var(--text-light);">28</div>
                        <div style="background: var(--bg-surface); padding: 12px; height: 120px; color: var(--text-light);">29</div>
                        <div style="background: var(--bg-surface); padding: 12px; height: 120px; color: var(--text-light);">30</div>
                        <div style="background: var(--bg-surface); padding: 12px; height: 120px;">
                            <div style="font-weight: 600; margin-bottom: 8px;">1</div>
                            <div style="background: var(--primary-light); color: var(--primary-dark); font-size: 12px; padding: 4px; border-radius: 4px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">Paris Arrival</div>
                        </div>
                        <div style="background: var(--bg-surface); padding: 12px; height: 120px;">
                            <div style="font-weight: 600; margin-bottom: 8px;">2</div>
                            <div style="background: var(--primary-light); color: var(--primary-dark); font-size: 12px; padding: 4px; border-radius: 4px;">Louvre Museum</div>
                        </div>
                        <div style="background: var(--bg-surface); padding: 12px; height: 120px;">
                            <div style="font-weight: 600; margin-bottom: 8px;">3</div>
                            <div style="background: var(--primary-light); color: var(--primary-dark); font-size: 12px; padding: 4px; border-radius: 4px;">Train to Rome</div>
                        </div>
                        <div style="background: var(--bg-surface); padding: 12px; height: 120px;"><div style="font-weight: 600;">4</div></div>
                    </div>
                </div>
            </div>
        </div>
    `,
    'public-itinerary': () => `
        <div class="view-enter" style="max-width: 800px; margin: 0 auto;">
            <div style="background: var(--gradient-brand); color: white; padding: 16px; border-radius: var(--radius-md) var(--radius-md) 0 0; text-align: center; font-weight: 600;">
                <i class="fa-solid fa-earth-americas"></i> Shared by Alex Traveler
            </div>
            <div class="card" style="border-top-left-radius: 0; border-top-right-radius: 0; padding: 0;">
                <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop" style="width: 100%; height: 250px; object-fit: cover;">
                <div style="padding: 32px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px;">
                        <div>
                            <h1 style="font-size: 32px; margin-bottom: 8px;">Summer in Japan</h1>
                            <p style="color: var(--text-muted);">15 Days • Tokyo, Kyoto, Osaka</p>
                        </div>
                        <button class="btn btn-primary"><i class="fa-regular fa-copy"></i> Copy Trip</button>
                    </div>
                    
                    <h3 style="margin-bottom: 16px;">Highlights</h3>
                    <div style="display: flex; gap: 16px; margin-bottom: 32px;">
                        <span style="background: var(--bg-surface-hover); padding: 8px 16px; border-radius: var(--radius-full); font-size: 14px;">Culture</span>
                        <span style="background: var(--bg-surface-hover); padding: 8px 16px; border-radius: var(--radius-full); font-size: 14px;">Food</span>
                        <span style="background: var(--bg-surface-hover); padding: 8px 16px; border-radius: var(--radius-full); font-size: 14px;">Sightseeing</span>
                    </div>
                    <h3 style="margin-bottom: 16px;">Day 1</h3>
                    <div style="background: var(--bg-main); padding: 16px; border-radius: var(--radius-md); margin-bottom: 16px;">
                        <strong>Arrive in Tokyo</strong><br>
                        <span style="color: var(--text-muted); font-size: 14px;">Explore Shibuya crossing in the evening.</span>
                    </div>
                </div>
            </div>
            <div style="text-align: center; margin-top: 32px;">
                <button class="btn btn-primary-outline" onclick="navigate('dashboard')">Back to My Dashboard</button>
            </div>
        </div>
    `,
    'admin-dashboard': () => `
        <div class="view-enter">
            <header class="page-header">
                <div>
                    <h1 class="page-title">Platform Analytics</h1>
                    <p class="page-subtitle">Admin Overview</p>
                </div>
            </header>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 32px;">
                <div class="card">
                    <div style="color: var(--text-muted); font-size: 14px; margin-bottom: 8px;">Total Users</div>
                    <div style="font-size: 32px; font-weight: 700;">12,450</div>
                </div>
                <div class="card">
                    <div style="color: var(--text-muted); font-size: 14px; margin-bottom: 8px;">Trips Created</div>
                    <div style="font-size: 32px; font-weight: 700;">45,892</div>
                </div>
                <div class="card">
                    <div style="color: var(--text-muted); font-size: 14px; margin-bottom: 8px;">Active Today</div>
                    <div style="font-size: 32px; font-weight: 700;">1,204</div>
                </div>
                <div class="card">
                    <div style="color: var(--text-muted); font-size: 14px; margin-bottom: 8px;">Revenue</div>
                    <div style="font-size: 32px; font-weight: 700;">$14.2k</div>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px;">
                <div class="card">
                    <h3 style="margin-bottom: 24px;">User Growth</h3>
                    <!-- Mock Chart -->
                    <div style="height: 250px; display: flex; align-items: flex-end; gap: 12px; padding-bottom: 24px; border-bottom: 1px solid var(--border-color);">
                        <div style="flex-grow: 1; background: var(--primary-light); height: 30%; border-radius: 4px 4px 0 0;"></div>
                        <div style="flex-grow: 1; background: var(--primary-light); height: 45%; border-radius: 4px 4px 0 0;"></div>
                        <div style="flex-grow: 1; background: var(--primary-light); height: 40%; border-radius: 4px 4px 0 0;"></div>
                        <div style="flex-grow: 1; background: var(--primary); height: 65%; border-radius: 4px 4px 0 0;"></div>
                        <div style="flex-grow: 1; background: var(--primary); height: 80%; border-radius: 4px 4px 0 0;"></div>
                        <div style="flex-grow: 1; background: var(--primary-dark); height: 100%; border-radius: 4px 4px 0 0;"></div>
                    </div>
                </div>
                <div class="card">
                    <h3 style="margin-bottom: 24px;">Top Destinations</h3>
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 600;">1. Paris</span>
                            <span style="color: var(--text-muted);">4,230 trips</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 600;">2. Tokyo</span>
                            <span style="color: var(--text-muted);">3,890 trips</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 600;">3. Bali</span>
                            <span style="color: var(--text-muted);">2,100 trips</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
};

function navigate(route, params = null) {
    const root = document.getElementById('app-root');
    const sidebar = document.getElementById('main-sidebar');
    
    // Handle Sidebar Visibility
    if (sidebar) {
        if (route === 'login' || route === 'signup') {
            sidebar.style.display = 'none';
        } else {
            sidebar.style.display = 'flex';
        }
    }
    
    // Update active nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if(link.getAttribute('data-route') === route) {
            link.classList.add('active');
        }
    });

    // Render View
    if (views[route]) {
        root.innerHTML = views[route]();
        // Scroll to top
        root.scrollTo(0, 0);
    } else {
        root.innerHTML = `
            <div style="display:flex; height:100%; align-items:center; justify-content:center; flex-direction:column;">
                <h2 style="font-size: 24px; color: var(--text-muted); margin-bottom: 16px;">Under Construction</h2>
                <button class="btn btn-primary" onclick="navigate('dashboard')">Return Home</button>
            </div>
        `;
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Setup Nav Listeners
    document.querySelectorAll('[data-route]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const route = e.currentTarget.getAttribute('data-route');
            navigate(route);
        });
    });

    // Load Initial Route
    navigate('dashboard');
});
