/**
 * Nexus - Vanilla JS Core Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    lucide.createIcons();

    // 2. Theme Management (Dark/Light mode)
    setupThemeToggle();

    // 3. Simple Router setup
    setupRouter();

    // 4. Initial load
    handleRoute();
});

function setupThemeToggle() {
    const toggleBtn = document.getElementById('themeToggle');
    const icon = toggleBtn.querySelector('i');

    // Check saved local storage or system preference
    const savedTheme = localStorage.getItem('nexus-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.setAttribute('data-theme', 'dark');
        icon.setAttribute('data-lucide', 'sun');
    }

    toggleBtn.addEventListener('click', () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('nexus-theme', 'light');
            icon.setAttribute('data-lucide', 'moon');
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('nexus-theme', 'dark');
            icon.setAttribute('data-lucide', 'sun');
        }
        lucide.createIcons(); // Re-render the icon
    });
}

function setupRouter() {
    // Listen for hash changes
    window.addEventListener('hashchange', handleRoute);

    // Intercept nav links
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-item');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Active state handling is strictly visual here, hashchange triggers the render
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

function handleRoute() {
    const viewContainer = document.getElementById('viewContainer');
    let hash = window.location.hash.substring(1) || 'dashboard';

    // Ensure active state in sidebar on load
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${hash}`) {
            link.classList.add('active');
        }
    });

    // Animate transition out
    viewContainer.classList.remove('fade-in');

    // Very quick reflow
    void viewContainer.offsetWidth;

    // Render corresponding view
    switch (hash) {
        case 'dashboard':
            viewContainer.innerHTML = renderDashboard();
            break;
        case 'finances':
            viewContainer.innerHTML = renderFinances();
            break;
        case 'employees':
            viewContainer.innerHTML = renderEmployees();
            break;
        case 'marketing':
            viewContainer.innerHTML = renderMarketing();
            break;
        case 'legal':
            viewContainer.innerHTML = renderLegal();
            break;
        case 'planning':
            viewContainer.innerHTML = renderPlanning();
            break;
        default:
            viewContainer.innerHTML = renderDashboard();
    }

    // Animate transition in
    viewContainer.classList.add('fade-in');

    // Re-initialize icons in newly injected HTML
    lucide.createIcons();

    // Execute view specific scripts (e.g. mock charts)
    if (hash === 'dashboard') initDashboardScripts();
}

/** 
 * VIEWS TEMPLATES (We would break these into modules in a real build)
 */

function renderDashboard() {
    return `
        <div class="view-header">
            <div class="view-title">
                <h1>Overview</h1>
                <p>Welcome back! Here's what's happening today.</p>
            </div>
            <button class="btn btn-primary"><i data-lucide="download"></i> Download Report</button>
        </div>

        <!-- AI Insights Banner -->
        <div class="card" style="margin-bottom: 24px; background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1)); border-color: var(--primary);">
            <div style="display: flex; gap: 16px; align-items: flex-start;">
                <div style="padding: 12px; background: var(--primary); color: white; border-radius: var(--border-radius-sm);">
                    <i data-lucide="sparkles"></i>
                </div>
                <div>
                    <h3 style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                        Nexus AI Insight
                        <span class="status-badge" style="background: var(--primary); color: white;">Beta</span>
                    </h3>
                    <p style="color: var(--text-muted); font-size: 0.95rem;">Based on your current burn rate, runway has extended to 14 months. Consider allocating surplus to Q3 Marketing budget for higher ROI.</p>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-4" style="margin-bottom: 24px;">
            <div class="card">
                <div class="card-header">
                    <span class="card-title">Total Revenue</span>
                    <i data-lucide="dollar-sign" style="color: var(--success);"></i>
                </div>
                <div class="stat-value">$124,560</div>
                <div class="stat-trend trend-up"><i data-lucide="arrow-up-right"></i> +14.5% vs last month</div>
            </div>
            <div class="card">
                <div class="card-header">
                    <span class="card-title">Monthly Burn Rate</span>
                    <i data-lucide="flame" style="color: var(--danger);"></i>
                </div>
                <div class="stat-value">$42,300</div>
                <div class="stat-trend trend-down"><i data-lucide="arrow-down-right"></i> -5.2% vs last month</div>
            </div>
            <div class="card">
                <div class="card-header">
                    <span class="card-title">Active Employees</span>
                    <i data-lucide="users" style="color: var(--primary);"></i>
                </div>
                <div class="stat-value">24</div>
                <div class="stat-trend trend-up"><i data-lucide="arrow-up-right"></i> +2 hired</div>
            </div>
            <div class="card">
                <div class="card-header">
                    <span class="card-title">Legal Compliance</span>
                    <i data-lucide="shield-check" style="color: var(--accent);"></i>
                </div>
                <div class="stat-value">98%</div>
                <div class="stat-trend trend-neutral"><i data-lucide="minus"></i> 1 pending signature</div>
            </div>
        </div>

        <div class="grid grid-cols-2">
            <div class="card">
                <div class="card-header">
                    <h3 style="font-family: var(--font-heading);">Cashflow Mock Chart</h3>
                </div>
                <div id="chart-mockup" style="height: 250px; display: flex; align-items: flex-end; gap: 12px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
                    <!-- CSS Bars mocked via JS -->
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 12px; color: var(--text-muted); font-size: 0.8rem;">
                    <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3 style="font-family: var(--font-heading);">Recent Activity</h3>
                </div>
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div style="display: flex; gap: 16px; align-items: center;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--success-bg); color: var(--success); display: flex; align-items: center; justify-content: center;">
                            <i data-lucide="file-check" style="width: 20px;"></i>
                        </div>
                        <div>
                            <p style="font-weight: 500;">NDA Signed: Jane Doe</p>
                            <p style="font-size: 0.8rem; color: var(--text-muted);">Legal Module • 2 hours ago</p>
                        </div>
                    </div>
                    <div style="display: flex; gap: 16px; align-items: center;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--info-bg, rgba(59, 130, 246, 0.1)); color: var(--info); display: flex; align-items: center; justify-content: center;">
                            <i data-lucide="credit-card" style="width: 20px;"></i>
                        </div>
                        <div>
                            <p style="font-weight: 500;">Google Ads Payment: $1,200</p>
                            <p style="font-size: 0.8rem; color: var(--text-muted);">Finance Module • Yesterday</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initDashboardScripts() {
    const chartMockup = document.getElementById('chart-mockup');
    if (!chartMockup) return;

    const dataMock = [40, 65, 45, 80, 55, 90];
    let html = '';
    dataMock.forEach(val => {
        html += `<div style="flex: 1; border-radius: 4px 4px 0 0; background: linear-gradient(to top, var(--primary), var(--secondary)); height: ${val}%; opacity: 0.8; transition: opacity 0.3s; cursor: pointer;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.8'"></div>`;
    });
    chartMockup.innerHTML = html;
}

function renderFinances() {
    return `
        <div class="view-header">
            <div class="view-title">
                <h1>Financial Hub</h1>
                <p>Manage revenue, expenses, and runway in real-time.</p>
            </div>
            <div style="display: flex; gap: 12px;">
                <button class="btn btn-outline"><i data-lucide="file-text"></i> Export CSV</button>
                <button class="btn btn-primary"><i data-lucide="plus"></i> New Transaction</button>
            </div>
        </div>

        <div class="grid grid-cols-3" style="margin-bottom: 24px;">
            <div class="card" style="border-top: 4px solid var(--success);">
                <div class="card-header">
                    <span class="card-title">Net Revenue (YTD)</span>
                    <i data-lucide="trending-up" style="color: var(--success);"></i>
                </div>
                <div class="stat-value">$842,500</div>
                <div class="stat-trend trend-up"><i data-lucide="arrow-up-right"></i> +22% YoY</div>
            </div>
            <div class="card" style="border-top: 4px solid var(--danger);">
                <div class="card-header">
                    <span class="card-title">Total Expenses (YTD)</span>
                    <i data-lucide="trending-down" style="color: var(--danger);"></i>
                </div>
                <div class="stat-value">$310,200</div>
                <div class="stat-trend trend-down"><i data-lucide="arrow-down-right"></i> -4% YoY</div>
            </div>
            <div class="card" style="border-top: 4px solid var(--info);">
                <div class="card-header">
                    <span class="card-title">Estimated Runway</span>
                    <i data-lucide="calendar" style="color: var(--info);"></i>
                </div>
                <div class="stat-value">14.2 Mos</div>
                <div class="stat-trend trend-neutral"><i data-lucide="minus"></i> Stable</div>
            </div>
        </div>

        <div class="grid grid-cols-1" style="margin-bottom: 24px;">
            <div class="card">
                <div class="card-header">
                    <h3 style="font-family: var(--font-heading);">Recent Transactions</h3>
                    <button class="btn btn-outline" style="padding: 6px 12px; font-size: 0.8rem;">View All</button>
                </div>
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th style="text-align: right;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Oct 24, 2023</td>
                                <td style="font-weight: 500;">Stripe Payout</td>
                                <td><span class="status-badge" style="background: var(--info-bg, rgba(59, 130, 246, 0.1)); color: var(--info);">Revenue</span></td>
                                <td><span class="status-badge status-active">Completed</span></td>
                                <td style="text-align: right; color: var(--success); font-weight: 600;">+$14,250.00</td>
                            </tr>
                            <tr>
                                <td>Oct 23, 2023</td>
                                <td style="font-weight: 500;">AWS Cloud Services</td>
                                <td><span class="status-badge" style="background: rgba(148, 163, 184, 0.1); color: var(--text-muted);">Infrastructure</span></td>
                                <td><span class="status-badge status-active">Completed</span></td>
                                <td style="text-align: right; font-weight: 600;">-$2,140.50</td>
                            </tr>
                            <tr>
                                <td>Oct 21, 2023</td>
                                <td style="font-weight: 500;">WeWork Office Rent</td>
                                <td><span class="status-badge" style="background: rgba(148, 163, 184, 0.1); color: var(--text-muted);">Operations</span></td>
                                <td><span class="status-badge status-pending">Pending</span></td>
                                <td style="text-align: right; font-weight: 600;">-$4,500.00</td>
                            </tr>
                            <tr>
                                <td>Oct 19, 2023</td>
                                <td style="font-weight: 500;">Annual Legal Retainer</td>
                                <td><span class="status-badge" style="background: rgba(148, 163, 184, 0.1); color: var(--text-muted);">Legal</span></td>
                                <td><span class="status-badge status-active">Completed</span></td>
                                <td style="text-align: right; font-weight: 600;">-$10,000.00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}
function renderEmployees() {
    return `
        <div class="view-header">
            <div class="view-title">
                <h1>Team & Access Control</h1>
                <p>Manage your workforce, roles, and permissions.</p>
            </div>
            <button class="btn btn-primary"><i data-lucide="user-plus"></i> Invite Member</button>
        </div>

        <div class="grid grid-cols-4" style="margin-bottom: 24px;">
            <div class="card" style="grid-column: span 3; display: flex; align-items: center; gap: 24px;">
                <div style="flex: 1;">
                    <h3 style="margin-bottom: 8px;">Role-Based Access Control (RBAC)</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">Securely manage what modules your team can view and edit. 3 Active Roles.</p>
                </div>
                <button class="btn btn-secondary">Manage Roles</button>
            </div>
            <div class="card" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <div class="stat-value" style="margin: 0; color: var(--primary);">24</div>
                <div style="color: var(--text-muted); font-size: 0.9rem;">Total Members</div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3 style="font-family: var(--font-heading);">Team Directory</h3>
                <div class="header-search" style="width: 250px;">
                    <i data-lucide="search"></i>
                    <input type="text" placeholder="Search team...">
                </div>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Role</th>
                            <th>Department</th>
                            <th>Access Level</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <img src="https://ui-avatars.com/api/?name=Sarah+Chen&background=14b8a6&color=fff" alt="" style="width: 32px; height: 32px; border-radius: 50%;">
                                    <div>
                                        <div style="font-weight: 500;">Sarah Chen</div>
                                        <div style="font-size: 0.8rem; color: var(--text-muted);">sarah@nexus.io</div>
                                    </div>
                                </div>
                            </td>
                            <td>CTO</td>
                            <td>Engineering</td>
                            <td><span class="status-badge" style="background: var(--danger-bg); color: var(--danger);">Admin</span></td>
                            <td><button class="icon-btn" style="width: 32px; height: 32px;"><i data-lucide="more-vertical" style="width: 16px;"></i></button></td>
                        </tr>
                        <tr>
                            <td>
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <img src="https://ui-avatars.com/api/?name=Mike+Ross&background=6366f1&color=fff" alt="" style="width: 32px; height: 32px; border-radius: 50%;">
                                    <div>
                                        <div style="font-weight: 500;">Mike Ross</div>
                                        <div style="font-size: 0.8rem; color: var(--text-muted);">mike@nexus.io</div>
                                    </div>
                                </div>
                            </td>
                            <td>Lead Counsel</td>
                            <td>Legal</td>
                            <td><span class="status-badge" style="background: var(--warning-bg); color: var(--warning);">Editor</span></td>
                            <td><button class="icon-btn" style="width: 32px; height: 32px;"><i data-lucide="more-vertical" style="width: 16px;"></i></button></td>
                        </tr>
                        <tr>
                            <td>
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <img src="https://ui-avatars.com/api/?name=Elena+Gomez&background=ec4899&color=fff" alt="" style="width: 32px; height: 32px; border-radius: 50%;">
                                    <div>
                                        <div style="font-weight: 500;">Elena Gomez</div>
                                        <div style="font-size: 0.8rem; color: var(--text-muted);">elena@nexus.io</div>
                                    </div>
                                </div>
                            </td>
                            <td>Growth Manager</td>
                            <td>Marketing</td>
                            <td><span class="status-badge" style="background: var(--success-bg); color: var(--success);">Viewer</span></td>
                            <td><button class="icon-btn" style="width: 32px; height: 32px;"><i data-lucide="more-vertical" style="width: 16px;"></i></button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderMarketing() {
    return `
        <div class="view-header">
            <div class="view-title">
                <h1>Marketing & Growth</h1>
                <p>Track campaigns, ROI, and customer acquisition metrics.</p>
            </div>
            <button class="btn btn-primary"><i data-lucide="megaphone"></i> New Campaign</button>
        </div>

        <div class="grid grid-cols-4" style="margin-bottom: 24px;">
            <div class="card">
                <div class="card-header">
                    <span class="card-title">Active Campaigns</span>
                    <i data-lucide="radio" style="color: var(--primary);"></i>
                </div>
                <div class="stat-value">4</div>
                <div class="stat-trend trend-up"><i data-lucide="arrow-up-right"></i> +1 this week</div>
            </div>
            <div class="card">
                <div class="card-header">
                    <span class="card-title">Total Spend</span>
                    <i data-lucide="dollar-sign" style="color: var(--danger);"></i>
                </div>
                <div class="stat-value">$12,450</div>
                <div class="stat-trend trend-down"><i data-lucide="arrow-down-right"></i> -15% vs last month</div>
            </div>
            <div class="card">
                <div class="card-header">
                    <span class="card-title">Avg. CAC</span>
                    <i data-lucide="target" style="color: var(--accent);"></i>
                </div>
                <div class="stat-value">$42.50</div>
                <div class="stat-trend trend-up"><i data-lucide="arrow-up-right"></i> +$2.10 vs last month</div>
            </div>
            <div class="card">
                <div class="card-header">
                    <span class="card-title">New Leads</span>
                    <i data-lucide="users" style="color: var(--success);"></i>
                </div>
                <div class="stat-value">1,204</div>
                <div class="stat-trend trend-up"><i data-lucide="arrow-up-right"></i> +34% MoM</div>
            </div>
        </div>

        <div class="grid grid-cols-2">
            <div class="card">
                <div class="card-header">
                    <h3 style="font-family: var(--font-heading);">Campaign Performance</h3>
                </div>
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-weight: 500;">Q3 Social Media Blitz</span>
                            <span style="color: var(--success);">68% Conversion</span>
                        </div>
                        <div style="width: 100%; height: 8px; background: var(--bg-elevated); border-radius: 4px; overflow: hidden;">
                            <div style="width: 68%; height: 100%; background: var(--success); border-radius: 4px;"></div>
                        </div>
                    </div>
                    <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-weight: 500;">Google Ads - Technical Keywords</span>
                            <span style="color: var(--warning);">42% Conversion</span>
                        </div>
                        <div style="width: 100%; height: 8px; background: var(--bg-elevated); border-radius: 4px; overflow: hidden;">
                            <div style="width: 42%; height: 100%; background: var(--warning); border-radius: 4px;"></div>
                        </div>
                    </div>
                    <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-weight: 500;">Email Newsletter Spons.</span>
                            <span style="color: var(--danger);">15% Conversion</span>
                        </div>
                        <div style="width: 100%; height: 8px; background: var(--bg-elevated); border-radius: 4px; overflow: hidden;">
                            <div style="width: 15%; height: 100%; background: var(--danger); border-radius: 4px;"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card" style="background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; border: none;">
                <h3 style="margin-bottom: 16px; font-family: var(--font-heading); color: white;">AI Marketing Recommendation</h3>
                <p style="margin-bottom: 24px; opacity: 0.9;">Based on your recent CAC increase, we recommend shifting 15% of your Google Ads budget to LinkedIn Sponsored Content targeting startup founders in the SaaS space. </p>
                <div style="background: rgba(0,0,0,0.2); padding: 16px; border-radius: var(--border-radius-sm); backdrop-filter: blur(4px);">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span>Est. Return on Ad Spend (ROAS)</span>
                        <strong>3.2x</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Projected Lead Increase</span>
                        <strong>+120/mo</strong>
                    </div>
                </div>
                <button class="btn" style="background: white; color: var(--primary); margin-top: 16px; width: 100%;">Apply Strategy</button>
            </div>
        </div>
    `;
}
function renderLegal() {
    return `
        <div class="view-header">
            <div class="view-title">
                <h1>Legal & Compliance</h1>
                <p>Digital agreements, contract management, and compliance status.</p>
            </div>
            <button class="btn btn-primary"><i data-lucide="file-signature"></i> Create Contract</button>
        </div>

        <div class="grid grid-cols-3" style="margin-bottom: 24px;">
            <div class="card" style="border-top: 4px solid var(--primary);">
                <div class="card-header">
                    <span class="card-title">Active Agreements</span>
                    <i data-lucide="file-check-2" style="color: var(--primary);"></i>
                </div>
                <div class="stat-value">128</div>
                <div class="stat-trend trend-neutral"><i data-lucide="minus"></i> 3 pending signatures</div>
            </div>
            <div class="card" style="border-top: 4px solid var(--success);">
                <div class="card-header">
                    <span class="card-title">Compliance Score</span>
                    <i data-lucide="shield-check" style="color: var(--success);"></i>
                </div>
                <div class="stat-value">98<span style="font-size: 1.2rem; margin-left: 4px; color: var(--text-muted);">/ 100</span></div>
                <div class="stat-trend trend-up"><i data-lucide="arrow-up-right"></i> Passed recent SOC2 audit</div>
            </div>
            <div class="card" style="border-top: 4px solid var(--warning);">
                <div class="card-header">
                    <span class="card-title">Expiring Soon</span>
                    <i data-lucide="clock" style="color: var(--warning);"></i>
                </div>
                <div class="stat-value">2</div>
                <div class="stat-trend trend-down"><i data-lucide="alert-circle"></i> Requires attention</div>
            </div>
        </div>

        <div class="grid grid-cols-2">
            <div class="card">
                <div class="card-header">
                   <h3 style="font-family: var(--font-heading);">Agreement Templates</h3>
                </div>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <button class="btn btn-secondary" style="justify-content: space-between; padding: 16px;">
                        <span style="display: flex; align-items: center; gap: 12px;">
                            <i data-lucide="file-text" style="color: var(--primary);"></i> 
                            Standard Non-Disclosure Agreement (NDA)
                        </span>
                        <i data-lucide="chevron-right" style="color: var(--text-muted);"></i>
                    </button>
                    <button class="btn btn-secondary" style="justify-content: space-between; padding: 16px;">
                        <span style="display: flex; align-items: center; gap: 12px;">
                            <i data-lucide="file-text" style="color: var(--primary);"></i> 
                            Independent Contractor Agreement
                        </span>
                        <i data-lucide="chevron-right" style="color: var(--text-muted);"></i>
                    </button>
                    <button class="btn btn-secondary" style="justify-content: space-between; padding: 16px;">
                        <span style="display: flex; align-items: center; gap: 12px;">
                            <i data-lucide="file-text" style="color: var(--primary);"></i> 
                            Employee Offer Letter & Equity Grant
                        </span>
                        <i data-lucide="chevron-right" style="color: var(--text-muted);"></i>
                    </button>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3 style="font-family: var(--font-heading);">Recent Document Activity</h3>
                </div>
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div style="display: flex; align-items: flex-start; gap: 16px; border-left: 2px solid var(--border-color); padding-left: 16px; position: relative;">
                        <div style="position: absolute; left: -7px; top: 0; width: 12px; height: 12px; border-radius: 50%; background: var(--success); border: 2px solid var(--bg-surface);"></div>
                        <div>
                            <p style="font-weight: 500;">Contractor Agreement Signed</p>
                            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px;">David Smith (Design Contractor) completed signature.</p>
                            <span style="font-size: 0.75rem; color: var(--text-muted);">2 hours ago</span>
                        </div>
                    </div>
                    <div style="display: flex; align-items: flex-start; gap: 16px; border-left: 2px solid var(--border-color); padding-left: 16px; position: relative;">
                        <div style="position: absolute; left: -7px; top: 0; width: 12px; height: 12px; border-radius: 50%; background: var(--warning); border: 2px solid var(--bg-surface);"></div>
                        <div>
                            <p style="font-weight: 500;">Sent for Signature: Q3 Audit Prep</p>
                            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px;">Waiting on external CFO review.</p>
                            <span style="font-size: 0.75rem; color: var(--text-muted);">Yesterday, 4:30 PM</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderPlanning() {
    return `
        <div class="view-header">
            <div class="view-title">
                <h1>Strategy & Planning</h1>
                <p>Business model canvas, OKRs, and milestone tracking.</p>
            </div>
            <button class="btn btn-primary"><i data-lucide="target"></i> Add Objective</button>
        </div>

        <div class="card" style="margin-bottom: 24px;">
            <div class="card-header">
                <h3 style="font-family: var(--font-heading);">Current Objective (Q4)</h3>
                <span class="status-badge" style="background: var(--info-bg, rgba(59, 130, 246, 0.1)); color: var(--info);">On Track</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <div>
                    <h2 style="font-size: 1.5rem; margin-bottom: 4px;">Launch Enterprise Tier and Achieve $1M ARR</h2>
                    <p style="color: var(--text-muted);">Expand product offering to upmarket customers while maintaining core SaaS growth.</p>
                </div>
                <div class="stat-value" style="color: var(--success);">78%</div>
            </div>
            <div style="width: 100%; height: 12px; background: var(--bg-elevated); border-radius: 6px; overflow: hidden;">
                <div style="width: 78%; height: 100%; background: linear-gradient(90deg, var(--primary), var(--secondary)); border-radius: 6px;"></div>
            </div>
        </div>

        <div class="grid grid-cols-2">
            <div class="card">
                <div class="card-header">
                    <h3 style="font-family: var(--font-heading);">Key Results</h3>
                </div>
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div style="padding-bottom: 16px; border-bottom: 1px solid var(--border-color);">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-weight: 500;">KR 1: Close 5 pilot enterprise customers</span>
                            <span>4/5</span>
                        </div>
                        <div style="width: 100%; height: 6px; background: var(--bg-elevated); border-radius: 3px; overflow: hidden;">
                            <div style="width: 80%; height: 100%; background: var(--primary); border-radius: 3px;"></div>
                        </div>
                    </div>
                    <div style="padding-bottom: 16px; border-bottom: 1px solid var(--border-color);">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-weight: 500;">KR 2: Launch SSO & Advanced RBAC</span>
                            <span>Done</span>
                        </div>
                        <div style="width: 100%; height: 6px; background: var(--bg-elevated); border-radius: 3px; overflow: hidden;">
                            <div style="width: 100%; height: 100%; background: var(--success); border-radius: 3px;"></div>
                        </div>
                    </div>
                    <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-weight: 500;">KR 3: Hit $83k MRR threshold</span>
                            <span>$75k / $83k</span>
                        </div>
                        <div style="width: 100%; height: 6px; background: var(--bg-elevated); border-radius: 3px; overflow: hidden;">
                            <div style="width: 90%; height: 100%; background: var(--warning); border-radius: 3px;"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3 style="font-family: var(--font-heading);">Business Model Canvas (Summary)</h3>
                    <button class="icon-btn" style="width: 32px; height: 32px;"><i data-lucide="edit-3" style="width: 16px;"></i></button>
                </div>
                <div class="grid grid-cols-2" style="gap: 16px;">
                    <div style="background: var(--bg-elevated); padding: 12px; border-radius: var(--border-radius-sm); border: 1px solid var(--border-color);">
                        <strong style="display: block; font-size: 0.85rem; color: var(--primary); margin-bottom: 4px;">Value Props</strong>
                        <p style="font-size: 0.85rem;">All-in-one OS saving founders 15hrs/week.</p>
                    </div>
                    <div style="background: var(--bg-elevated); padding: 12px; border-radius: var(--border-radius-sm); border: 1px solid var(--border-color);">
                        <strong style="display: block; font-size: 0.85rem; color: var(--secondary); margin-bottom: 4px;">Customer Segments</strong>
                        <p style="font-size: 0.85rem;">Seed to Series B B2B SaaS Startups.</p>
                    </div>
                    <div style="background: var(--bg-elevated); padding: 12px; border-radius: var(--border-radius-sm); border: 1px solid var(--border-color);">
                        <strong style="display: block; font-size: 0.85rem; color: var(--accent); margin-bottom: 4px;">Revenue Streams</strong>
                        <p style="font-size: 0.85rem;">Tiered SaaS ($49-$499/mo) & API Add-ons.</p>
                    </div>
                    <div style="background: var(--bg-elevated); padding: 12px; border-radius: var(--border-radius-sm); border: 1px solid var(--border-color);">
                        <strong style="display: block; font-size: 0.85rem; color: var(--warning); margin-bottom: 4px;">Key Resources</strong>
                        <p style="font-size: 0.85rem;">Engineering Team, Proprietary AI IP.</p>
                    </div>
                </div>
                <button class="btn btn-outline" style="width: 100%; margin-top: 16px;">View Full Canvas</button>
            </div>
        </div>
    `;
}
