import type { PreviewTemplate } from "./types";

const border = `1px solid color-mix(in srgb, currentColor 12%, transparent)`;
const borderLight = `1px solid color-mix(in srgb, currentColor 8%, transparent)`;
const cardBg = `color-mix(in srgb, currentColor 3%, transparent)`;
const subtleBg = `color-mix(in srgb, currentColor 5%, transparent)`;
const barTrack = `height: 6px; border-radius: 3px; background: color-mix(in srgb, currentColor 10%, transparent); overflow: hidden;`;
const badge = `display: inline-block; font-size: 0.7em; padding: 0.2em 0.6em; border-radius: 999px; background: color-mix(in srgb, currentColor 8%, transparent); font-weight: 500;`;
const thStyle = `padding: 0.7rem 0.75rem; text-align: left; border-bottom: 2px solid color-mix(in srgb, currentColor 12%, transparent);`;
const tdStyle = `padding: 0.75rem 0.75rem; border-bottom: ${borderLight};`;
const avatarBase = `width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.75em;`;

export const dashboardTemplate: PreviewTemplate = {
  id: "dashboard",
  name: "Dashboard",
  html: `
<style>
  @media (max-width: 768px) {
    #stat-cards { grid-template-columns: repeat(2, 1fr) !important; }
    #mid-row { grid-template-columns: 1fr !important; }
    #bottom-row { grid-template-columns: 1fr !important; }
  }
  @media (max-width: 480px) {
    #stat-cards { grid-template-columns: 1fr !important; }
  }
  @media (max-width: 640px) {
    #txn-table { overflow-x: auto; }
    #txn-table table { min-width: 560px; }
  }
</style>

<div style="max-width: 1000px; margin: 0 auto; padding: 2.5rem 1.5rem;">

  <!-- Header -->
  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2.25rem; flex-wrap: wrap; gap: 0.75rem;">
    <div>
      <h2 style="margin: 0 0 0.35rem; letter-spacing: -0.025em;">Dashboard</h2>
      <p style="opacity: 0.5; margin: 0; font-size: 0.9em;">Welcome back. Here's what's happening with your projects today.</p>
    </div>
    <div style="${badge} font-size: 0.8em; padding: 0.35em 0.85em;">Mar 3, 2026</div>
  </div>

  <!-- Stat Cards -->
  <div id="stat-cards" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.75rem;">

    <div style="border: ${border}; border-radius: 12px; padding: 1.5rem; background: ${cardBg};">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
        <small style="opacity: 0.6; font-weight: 500;">Total Revenue</small>
        <div style="width: 16px; height: 16px; border-radius: 50%; background: color-mix(in srgb, currentColor 15%, transparent);"></div>
      </div>
      <h3 style="margin: 0 0 0.25rem; letter-spacing: -0.02em;">$4,521</h3>
      <small style="opacity: 0.5;">+20.1% from last month</small>
    </div>

    <div style="border: ${border}; border-radius: 12px; padding: 1.5rem; background: ${cardBg};">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
        <small style="opacity: 0.6; font-weight: 500;">Subscriptions</small>
        <div style="width: 16px; height: 16px; border-radius: 50%; background: color-mix(in srgb, currentColor 15%, transparent);"></div>
      </div>
      <h3 style="margin: 0 0 0.25rem; letter-spacing: -0.02em;">+2,350</h3>
      <small style="opacity: 0.5;">+180.1% from last month</small>
    </div>

    <div style="border: ${border}; border-radius: 12px; padding: 1.5rem; background: ${cardBg};">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
        <small style="opacity: 0.6; font-weight: 500;">Active Now</small>
        <div style="width: 16px; height: 16px; border-radius: 50%; background: color-mix(in srgb, currentColor 15%, transparent);"></div>
      </div>
      <h3 style="margin: 0 0 0.25rem; letter-spacing: -0.02em;">+573</h3>
      <small style="opacity: 0.5;">+201 since last hour</small>
    </div>

    <div style="border: ${border}; border-radius: 12px; padding: 1.5rem; background: ${cardBg};">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
        <small style="opacity: 0.6; font-weight: 500;">Bounce Rate</small>
        <div style="width: 16px; height: 16px; border-radius: 50%; background: color-mix(in srgb, currentColor 15%, transparent);"></div>
      </div>
      <h3 style="margin: 0 0 0.25rem; letter-spacing: -0.02em;">24.5%</h3>
      <small style="opacity: 0.5;">-4.3% from last month</small>
    </div>

  </div>

  <!-- Mid Row: Overview + Recent Sales -->
  <div id="mid-row" style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 1rem; margin-bottom: 1.75rem;">

    <!-- Overview Chart Card -->
    <div style="border: ${border}; border-radius: 12px; overflow: hidden;">
      <div style="padding: 1.25rem 1.5rem; border-bottom: ${borderLight};">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h4 style="margin: 0;">Overview</h4>
          <small style="opacity: 0.5;">Last 7 days</small>
        </div>
      </div>
      <div style="padding: 1.5rem;">
        <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; height: 200px; align-items: end;">
          <div style="text-align: center;"><div style="background: color-mix(in srgb, currentColor 35%, transparent); border-radius: 4px 4px 0 0; height: 60px;"></div><small style="font-size:0.6em; opacity:0.4; display:block; margin-top:4px;">Mon</small></div>
          <div style="text-align: center;"><div style="background: color-mix(in srgb, currentColor 35%, transparent); border-radius: 4px 4px 0 0; height: 100px;"></div><small style="font-size:0.6em; opacity:0.4; display:block; margin-top:4px;">Tue</small></div>
          <div style="text-align: center;"><div style="background: color-mix(in srgb, currentColor 35%, transparent); border-radius: 4px 4px 0 0; height: 78px;"></div><small style="font-size:0.6em; opacity:0.4; display:block; margin-top:4px;">Wed</small></div>
          <div style="text-align: center;"><div style="background: color-mix(in srgb, currentColor 60%, transparent); border-radius: 4px 4px 0 0; height: 150px;"></div><small style="font-size:0.6em; opacity:0.4; display:block; margin-top:4px;">Thu</small></div>
          <div style="text-align: center;"><div style="background: color-mix(in srgb, currentColor 35%, transparent); border-radius: 4px 4px 0 0; height: 115px;"></div><small style="font-size:0.6em; opacity:0.4; display:block; margin-top:4px;">Fri</small></div>
          <div style="text-align: center;"><div style="background: color-mix(in srgb, currentColor 20%, transparent); border-radius: 4px 4px 0 0; height: 45px;"></div><small style="font-size:0.6em; opacity:0.4; display:block; margin-top:4px;">Sat</small></div>
          <div style="text-align: center;"><div style="background: color-mix(in srgb, currentColor 20%, transparent); border-radius: 4px 4px 0 0; height: 32px;"></div><small style="font-size:0.6em; opacity:0.4; display:block; margin-top:4px;">Sun</small></div>
        </div>
      </div>
    </div>

    <!-- Recent Sales Card -->
    <div style="border: ${border}; border-radius: 12px; overflow: hidden;">
      <div style="padding: 1.25rem 1.5rem; border-bottom: ${borderLight};">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h4 style="margin: 0;">Recent Sales</h4>
            <small style="opacity: 0.45; font-size: 0.8em;">You made 265 sales this month.</small>
          </div>
        </div>
      </div>
      <div style="padding: 1rem 1.5rem;">
        <div style="display: flex; flex-direction: column; gap: 0;">

          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: ${borderLight};">
            <div style="display: flex; gap: 0.75rem; align-items: center;">
              <div style="${avatarBase} background: color-mix(in srgb, currentColor 10%, transparent);">OM</div>
              <div>
                <p style="margin: 0; font-weight: 500; font-size: 0.9em;">Olivia Martin</p>
                <small style="opacity: 0.45;">olivia.martin@email.com</small>
              </div>
            </div>
            <p style="margin: 0; font-weight: 600; font-size: 0.95em;">+$1,999.00</p>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: ${borderLight};">
            <div style="display: flex; gap: 0.75rem; align-items: center;">
              <div style="${avatarBase} background: color-mix(in srgb, currentColor 10%, transparent);">JL</div>
              <div>
                <p style="margin: 0; font-weight: 500; font-size: 0.9em;">Jackson Lee</p>
                <small style="opacity: 0.45;">jackson.lee@email.com</small>
              </div>
            </div>
            <p style="margin: 0; font-weight: 600; font-size: 0.95em;">+$39.00</p>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0;">
            <div style="display: flex; gap: 0.75rem; align-items: center;">
              <div style="${avatarBase} background: color-mix(in srgb, currentColor 10%, transparent);">IN</div>
              <div>
                <p style="margin: 0; font-weight: 500; font-size: 0.9em;">Isabella Nguyen</p>
                <small style="opacity: 0.45;">isabella.nguyen@email.com</small>
              </div>
            </div>
            <p style="margin: 0; font-weight: 600; font-size: 0.95em;">+$299.00</p>
          </div>

        </div>
      </div>
    </div>
  </div>

  <!-- Transactions Table Card -->
  <div style="border: ${border}; border-radius: 12px; overflow: hidden; margin-bottom: 1.75rem;">
    <div style="padding: 1.25rem 1.5rem; border-bottom: ${borderLight};">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h4 style="margin: 0;">Recent Transactions</h4>
        <small style="opacity: 0.5; cursor: pointer;">View all</small>
      </div>
    </div>
    <div id="txn-table" style="padding: 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: ${subtleBg};">
            <th style="${thStyle}"><small style="font-weight: 600; opacity: 0.55; text-transform: uppercase; letter-spacing: 0.04em; font-size: 0.7em;">Customer</small></th>
            <th style="${thStyle}"><small style="font-weight: 600; opacity: 0.55; text-transform: uppercase; letter-spacing: 0.04em; font-size: 0.7em;">Email</small></th>
            <th style="${thStyle}"><small style="font-weight: 600; opacity: 0.55; text-transform: uppercase; letter-spacing: 0.04em; font-size: 0.7em;">Type</small></th>
            <th style="${thStyle}"><small style="font-weight: 600; opacity: 0.55; text-transform: uppercase; letter-spacing: 0.04em; font-size: 0.7em;">Status</small></th>
            <th style="${thStyle} text-align: right;"><small style="font-weight: 600; opacity: 0.55; text-transform: uppercase; letter-spacing: 0.04em; font-size: 0.7em;">Amount</small></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="${tdStyle}"><p style="margin:0; font-weight: 500; font-size: 0.9em;">Olivia Martin</p></td>
            <td style="${tdStyle}"><small style="opacity: 0.6;">olivia.martin@email.com</small></td>
            <td style="${tdStyle}"><small style="opacity: 0.6;">Sale</small></td>
            <td style="${tdStyle}"><span style="${badge}">Completed</span></td>
            <td style="${tdStyle} text-align: right;"><p style="margin:0; font-weight: 600; font-size: 0.9em;">$1,999.00</p></td>
          </tr>
          <tr>
            <td style="${tdStyle}"><p style="margin:0; font-weight: 500; font-size: 0.9em;">Jackson Lee</p></td>
            <td style="${tdStyle}"><small style="opacity: 0.6;">jackson.lee@email.com</small></td>
            <td style="${tdStyle}"><small style="opacity: 0.6;">Subscription</small></td>
            <td style="${tdStyle}"><span style="${badge}">Processing</span></td>
            <td style="${tdStyle} text-align: right;"><p style="margin:0; font-weight: 600; font-size: 0.9em;">$39.00</p></td>
          </tr>
          <tr>
            <td style="${tdStyle}"><p style="margin:0; font-weight: 500; font-size: 0.9em;">Isabella Nguyen</p></td>
            <td style="${tdStyle}"><small style="opacity: 0.6;">isabella.nguyen@email.com</small></td>
            <td style="${tdStyle}"><small style="opacity: 0.6;">Sale</small></td>
            <td style="${tdStyle}"><span style="${badge}">Completed</span></td>
            <td style="${tdStyle} text-align: right;"><p style="margin:0; font-weight: 600; font-size: 0.9em;">$299.00</p></td>
          </tr>
          <tr>
            <td style="${tdStyle}"><p style="margin:0; font-weight: 500; font-size: 0.9em;">William Kim</p></td>
            <td style="${tdStyle}"><small style="opacity: 0.6;">will@email.com</small></td>
            <td style="${tdStyle}"><small style="opacity: 0.6;">Sale</small></td>
            <td style="${tdStyle}"><span style="${badge}">Completed</span></td>
            <td style="${tdStyle} text-align: right;"><p style="margin:0; font-weight: 600; font-size: 0.9em;">$99.00</p></td>
          </tr>
          <tr>
            <td style="padding: 0.75rem 0.75rem;"><p style="margin:0; font-weight: 500; font-size: 0.9em;">Sofia Davis</p></td>
            <td style="padding: 0.75rem 0.75rem;"><small style="opacity: 0.6;">sofia.davis@email.com</small></td>
            <td style="padding: 0.75rem 0.75rem;"><small style="opacity: 0.6;">Refund</small></td>
            <td style="padding: 0.75rem 0.75rem;"><span style="${badge}">Failed</span></td>
            <td style="padding: 0.75rem 0.75rem; text-align: right;"><p style="margin:0; font-weight: 600; font-size: 0.9em;">$499.00</p></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Bottom Row: Team Members + Storage -->
  <div id="bottom-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.75rem;">

    <!-- Team Members Card -->
    <div style="border: ${border}; border-radius: 12px; overflow: hidden;">
      <div style="padding: 1.25rem 1.5rem; border-bottom: ${borderLight};">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h4 style="margin: 0;">Team Members</h4>
          <small style="opacity: 0.5;">3 active</small>
        </div>
      </div>
      <div style="padding: 0.5rem 1.5rem;">

        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 0; border-bottom: ${borderLight};">
          <div style="display: flex; gap: 0.75rem; align-items: center;">
            <div style="${avatarBase} background: color-mix(in srgb, currentColor 12%, transparent);">SD</div>
            <div>
              <p style="margin: 0; font-weight: 500; font-size: 0.9em;">Sofia Davis</p>
              <small style="opacity: 0.45;">Lead Designer</small>
            </div>
          </div>
          <span style="${badge}">12 tasks</span>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 0; border-bottom: ${borderLight};">
          <div style="display: flex; gap: 0.75rem; align-items: center;">
            <div style="${avatarBase} background: color-mix(in srgb, currentColor 12%, transparent);">AJ</div>
            <div>
              <p style="margin: 0; font-weight: 500; font-size: 0.9em;">Alex Johnson</p>
              <small style="opacity: 0.45;">Frontend Dev</small>
            </div>
          </div>
          <span style="${badge}">8 tasks</span>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 0;">
          <div style="display: flex; gap: 0.75rem; align-items: center;">
            <div style="${avatarBase} background: color-mix(in srgb, currentColor 12%, transparent);">MP</div>
            <div>
              <p style="margin: 0; font-weight: 500; font-size: 0.9em;">Maya Patel</p>
              <small style="opacity: 0.45;">Backend Dev</small>
            </div>
          </div>
          <span style="${badge}">15 tasks</span>
        </div>

      </div>
    </div>

    <!-- Storage Card -->
    <div style="border: ${border}; border-radius: 12px; overflow: hidden;">
      <div style="padding: 1.25rem 1.5rem; border-bottom: ${borderLight};">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h4 style="margin: 0;">Storage</h4>
          <small style="opacity: 0.5;">Manage</small>
        </div>
      </div>
      <div style="padding: 1.5rem;">
        <div style="margin-bottom: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
            <h5 style="margin: 0; letter-spacing: -0.01em;">64.8 GB</h5>
            <small style="opacity: 0.5;">of 100 GB used</small>
          </div>
          <div style="${barTrack} height: 8px;">
            <div style="height: 100%; width: 64.8%; background: color-mix(in srgb, currentColor 50%, transparent); border-radius: 3px;"></div>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div style="border: ${borderLight}; border-radius: 8px; padding: 0.85rem;">
            <small style="opacity: 0.45; font-size: 0.75em; text-transform: uppercase; letter-spacing: 0.03em;">Documents</small>
            <p style="margin: 0.2rem 0 0; font-weight: 600; font-size: 0.95em;">24.5 GB</p>
          </div>
          <div style="border: ${borderLight}; border-radius: 8px; padding: 0.85rem;">
            <small style="opacity: 0.45; font-size: 0.75em; text-transform: uppercase; letter-spacing: 0.03em;">Media</small>
            <p style="margin: 0.2rem 0 0; font-weight: 600; font-size: 0.95em;">18.2 GB</p>
          </div>
          <div style="border: ${borderLight}; border-radius: 8px; padding: 0.85rem;">
            <small style="opacity: 0.45; font-size: 0.75em; text-transform: uppercase; letter-spacing: 0.03em;">Backups</small>
            <p style="margin: 0.2rem 0 0; font-weight: 600; font-size: 0.95em;">14.8 GB</p>
          </div>
          <div style="border: ${borderLight}; border-radius: 8px; padding: 0.85rem;">
            <small style="opacity: 0.45; font-size: 0.75em; text-transform: uppercase; letter-spacing: 0.03em;">Other</small>
            <p style="margin: 0.2rem 0 0; font-weight: 600; font-size: 0.95em;">7.3 GB</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Project Progress Card -->
  <div style="border: ${border}; border-radius: 12px; overflow: hidden;">
    <div style="padding: 1.25rem 1.5rem; border-bottom: ${borderLight};">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h4 style="margin: 0;">Project Progress</h4>
        <small style="opacity: 0.5;">Q1 2026</small>
      </div>
    </div>
    <div style="padding: 1.5rem;">
      <div style="display: flex; flex-direction: column; gap: 1.35rem;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.4rem;">
            <p style="margin: 0; font-weight: 500; font-size: 0.9em;">Website Redesign</p>
            <small style="font-weight: 600; opacity: 0.7;">85%</small>
          </div>
          <div style="${barTrack}"><div style="height: 100%; width: 85%; background: color-mix(in srgb, currentColor 60%, transparent); border-radius: 3px;"></div></div>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.4rem;">
            <p style="margin: 0; font-weight: 500; font-size: 0.9em;">Mobile App</p>
            <small style="font-weight: 600; opacity: 0.7;">62%</small>
          </div>
          <div style="${barTrack}"><div style="height: 100%; width: 62%; background: color-mix(in srgb, currentColor 50%, transparent); border-radius: 3px;"></div></div>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.4rem;">
            <p style="margin: 0; font-weight: 500; font-size: 0.9em;">Design System</p>
            <small style="font-weight: 600; opacity: 0.7;">45%</small>
          </div>
          <div style="${barTrack}"><div style="height: 100%; width: 45%; background: color-mix(in srgb, currentColor 40%, transparent); border-radius: 3px;"></div></div>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.4rem;">
            <p style="margin: 0; font-weight: 500; font-size: 0.9em;">API Integration</p>
            <small style="font-weight: 600; opacity: 0.7;">28%</small>
          </div>
          <div style="${barTrack}"><div style="height: 100%; width: 28%; background: color-mix(in srgb, currentColor 30%, transparent); border-radius: 3px;"></div></div>
        </div>
      </div>
    </div>
  </div>

</div>
`,
};
