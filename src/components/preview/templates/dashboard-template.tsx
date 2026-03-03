import type { PreviewTemplate } from "./types";

const cardStyle = `border: 1px solid color-mix(in srgb, currentColor 20%, transparent); border-radius: 10px; padding: 1.5rem;`;
const cardHeaderSmall = `margin: 0 0 0.25rem; opacity: 0.7;`;
const badgeGreen = `display: inline-block; font-size: 0.75em; padding: 0.15em 0.5em; border-radius: 999px; background: rgba(34,197,94,0.12); color: #16a34a;`;
const badgeRed = `display: inline-block; font-size: 0.75em; padding: 0.15em 0.5em; border-radius: 999px; background: rgba(239,68,68,0.12); color: #dc2626;`;
const badgeYellow = `display: inline-block; font-size: 0.75em; padding: 0.15em 0.5em; border-radius: 999px; background: rgba(234,179,8,0.12); color: #a16207;`;
const barTrack = `height: 6px; border-radius: 3px; background: color-mix(in srgb, currentColor 15%, transparent); overflow: hidden;`;

export const dashboardTemplate: PreviewTemplate = {
  id: "dashboard",
  name: "Dashboard",
  html: `
<div style="max-width: 960px; margin: 0 auto; padding: 2rem 1.5rem;">

  <!-- Header -->
  <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2rem;">
    <div>
      <h2 style="margin: 0 0 0.25rem;">Dashboard</h2>
      <p style="opacity: 0.6; margin: 0;">Welcome back, here's what's happening with your projects today.</p>
    </div>
    <small style="opacity: 0.5;">March 3, 2026</small>
  </div>

  <!-- Stat Cards Row -->
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
    <div style="${cardStyle}">
      <small style="${cardHeaderSmall}">Total Revenue</small>
      <h3 style="margin: 0;">$45,231.89</h3>
      <small><span style="${badgeGreen}">+20.1%</span> from last month</small>
    </div>
    <div style="${cardStyle}">
      <small style="${cardHeaderSmall}">Subscriptions</small>
      <h3 style="margin: 0;">+2,350</h3>
      <small><span style="${badgeGreen}">+180.1%</span> from last month</small>
    </div>
    <div style="${cardStyle}">
      <small style="${cardHeaderSmall}">Active Now</small>
      <h3 style="margin: 0;">+573</h3>
      <small><span style="${badgeRed}">-2.4%</span> from last hour</small>
    </div>
    <div style="${cardStyle}">
      <small style="${cardHeaderSmall}">Bounce Rate</small>
      <h3 style="margin: 0;">24.5%</h3>
      <small><span style="${badgeGreen}">-4.3%</span> from last month</small>
    </div>
  </div>

  <!-- Two-Column Layout: Chart Placeholder + Activity -->
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 2rem;">

    <!-- Overview Card -->
    <div style="${cardStyle}">
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.25rem;">
        <h4 style="margin: 0;">Overview</h4>
        <small style="opacity: 0.5;">Last 7 days</small>
      </div>
      <!-- Mini bar chart representation -->
      <div style="display: flex; align-items: flex-end; gap: 6px; height: 120px; padding-top: 0.5rem;">
        <div style="flex:1; display:flex; flex-direction:column; justify-content:flex-end; align-items:center; gap:4px;">
          <div style="width:100%; background:rgba(99,102,241,0.7); border-radius:4px 4px 0 0; height:45%;"></div>
          <small style="font-size:0.65em; opacity:0.5;">Mon</small>
        </div>
        <div style="flex:1; display:flex; flex-direction:column; justify-content:flex-end; align-items:center; gap:4px;">
          <div style="width:100%; background:rgba(99,102,241,0.7); border-radius:4px 4px 0 0; height:72%;"></div>
          <small style="font-size:0.65em; opacity:0.5;">Tue</small>
        </div>
        <div style="flex:1; display:flex; flex-direction:column; justify-content:flex-end; align-items:center; gap:4px;">
          <div style="width:100%; background:rgba(99,102,241,0.7); border-radius:4px 4px 0 0; height:58%;"></div>
          <small style="font-size:0.65em; opacity:0.5;">Wed</small>
        </div>
        <div style="flex:1; display:flex; flex-direction:column; justify-content:flex-end; align-items:center; gap:4px;">
          <div style="width:100%; background:rgba(99,102,241,0.85); border-radius:4px 4px 0 0; height:92%;"></div>
          <small style="font-size:0.65em; opacity:0.5;">Thu</small>
        </div>
        <div style="flex:1; display:flex; flex-direction:column; justify-content:flex-end; align-items:center; gap:4px;">
          <div style="width:100%; background:rgba(99,102,241,0.7); border-radius:4px 4px 0 0; height:80%;"></div>
          <small style="font-size:0.65em; opacity:0.5;">Fri</small>
        </div>
        <div style="flex:1; display:flex; flex-direction:column; justify-content:flex-end; align-items:center; gap:4px;">
          <div style="width:100%; background:rgba(99,102,241,0.5); border-radius:4px 4px 0 0; height:35%;"></div>
          <small style="font-size:0.65em; opacity:0.5;">Sat</small>
        </div>
        <div style="flex:1; display:flex; flex-direction:column; justify-content:flex-end; align-items:center; gap:4px;">
          <div style="width:100%; background:rgba(99,102,241,0.5); border-radius:4px 4px 0 0; height:28%;"></div>
          <small style="font-size:0.65em; opacity:0.5;">Sun</small>
        </div>
      </div>
    </div>

    <!-- Recent Activity Card -->
    <div style="${cardStyle}">
      <h4 style="margin: 0 0 1rem;">Recent Activity</h4>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(99,102,241,0.15); flex-shrink: 0;"></div>
          <div>
            <p style="margin: 0;"><strong>Olivia Martin</strong> upgraded to Pro</p>
            <small style="opacity: 0.5;">2 minutes ago</small>
          </div>
        </div>
        <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(234,179,8,0.15); flex-shrink: 0;"></div>
          <div>
            <p style="margin: 0;"><strong>Jackson Lee</strong> created a new project</p>
            <small style="opacity: 0.5;">18 minutes ago</small>
          </div>
        </div>
        <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(34,197,94,0.15); flex-shrink: 0;"></div>
          <div>
            <p style="margin: 0;"><strong>Isabella Nguyen</strong> sent an invoice</p>
            <small style="opacity: 0.5;">1 hour ago</small>
          </div>
        </div>
        <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(239,68,68,0.15); flex-shrink: 0;"></div>
          <div>
            <p style="margin: 0;"><strong>William Kim</strong> reported a bug</p>
            <small style="opacity: 0.5;">3 hours ago</small>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Progress / Goals Card -->
  <div style="${cardStyle} margin-bottom: 2rem;">
    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.25rem;">
      <h4 style="margin: 0;">Project Progress</h4>
      <small style="opacity: 0.5;">Q1 2026</small>
    </div>
    <div style="display: flex; flex-direction: column; gap: 1.25rem;">
      <div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
          <p style="margin: 0;">Website Redesign</p>
          <small style="font-weight: 600;">85%</small>
        </div>
        <div style="${barTrack}"><div style="height: 100%; width: 85%; background: #6366f1; border-radius: 3px;"></div></div>
      </div>
      <div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
          <p style="margin: 0;">Mobile App</p>
          <small style="font-weight: 600;">62%</small>
        </div>
        <div style="${barTrack}"><div style="height: 100%; width: 62%; background: #8b5cf6; border-radius: 3px;"></div></div>
      </div>
      <div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
          <p style="margin: 0;">Design System</p>
          <small style="font-weight: 600;">45%</small>
        </div>
        <div style="${barTrack}"><div style="height: 100%; width: 45%; background: #a855f7; border-radius: 3px;"></div></div>
      </div>
      <div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
          <p style="margin: 0;">API Integration</p>
          <small style="font-weight: 600;">28%</small>
        </div>
        <div style="${barTrack}"><div style="height: 100%; width: 28%; background: #c084fc; border-radius: 3px;"></div></div>
      </div>
    </div>
  </div>

  <!-- Transactions Table -->
  <div style="${cardStyle} margin-bottom: 2rem;">
    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1rem;">
      <h4 style="margin: 0;">Recent Transactions</h4>
      <small style="opacity: 0.5;">View all</small>
    </div>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="padding: 0.6rem 0; text-align: left; border-bottom: 2px solid color-mix(in srgb, currentColor 20%, transparent);"><small style="font-weight: 600; opacity: 0.6;">Customer</small></th>
          <th style="padding: 0.6rem 0; text-align: left; border-bottom: 2px solid color-mix(in srgb, currentColor 20%, transparent);"><small style="font-weight: 600; opacity: 0.6;">Email</small></th>
          <th style="padding: 0.6rem 0; text-align: left; border-bottom: 2px solid color-mix(in srgb, currentColor 20%, transparent);"><small style="font-weight: 600; opacity: 0.6;">Status</small></th>
          <th style="padding: 0.6rem 0; text-align: right; border-bottom: 2px solid color-mix(in srgb, currentColor 20%, transparent);"><small style="font-weight: 600; opacity: 0.6;">Amount</small></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 0.75rem 0; border-bottom: 1px solid color-mix(in srgb, currentColor 10%, transparent);"><p style="margin:0; font-weight: 500;">Olivia Martin</p></td>
          <td style="padding: 0.75rem 0; border-bottom: 1px solid color-mix(in srgb, currentColor 10%, transparent);"><small>olivia@email.com</small></td>
          <td style="padding: 0.75rem 0; border-bottom: 1px solid color-mix(in srgb, currentColor 10%, transparent);"><small style="${badgeGreen}">Completed</small></td>
          <td style="padding: 0.75rem 0; border-bottom: 1px solid color-mix(in srgb, currentColor 10%, transparent); text-align: right;"><p style="margin:0; font-weight: 600;">$1,999.00</p></td>
        </tr>
        <tr>
          <td style="padding: 0.75rem 0; border-bottom: 1px solid color-mix(in srgb, currentColor 10%, transparent);"><p style="margin:0; font-weight: 500;">Jackson Lee</p></td>
          <td style="padding: 0.75rem 0; border-bottom: 1px solid color-mix(in srgb, currentColor 10%, transparent);"><small>jackson@email.com</small></td>
          <td style="padding: 0.75rem 0; border-bottom: 1px solid color-mix(in srgb, currentColor 10%, transparent);"><small style="${badgeYellow}">Processing</small></td>
          <td style="padding: 0.75rem 0; border-bottom: 1px solid color-mix(in srgb, currentColor 10%, transparent); text-align: right;"><p style="margin:0; font-weight: 600;">$39.00</p></td>
        </tr>
        <tr>
          <td style="padding: 0.75rem 0; border-bottom: 1px solid color-mix(in srgb, currentColor 10%, transparent);"><p style="margin:0; font-weight: 500;">Isabella Nguyen</p></td>
          <td style="padding: 0.75rem 0; border-bottom: 1px solid color-mix(in srgb, currentColor 10%, transparent);"><small>isabella@email.com</small></td>
          <td style="padding: 0.75rem 0; border-bottom: 1px solid color-mix(in srgb, currentColor 10%, transparent);"><small style="${badgeGreen}">Completed</small></td>
          <td style="padding: 0.75rem 0; border-bottom: 1px solid color-mix(in srgb, currentColor 10%, transparent); text-align: right;"><p style="margin:0; font-weight: 600;">$299.00</p></td>
        </tr>
        <tr>
          <td style="padding: 0.75rem 0; border-bottom: 1px solid color-mix(in srgb, currentColor 10%, transparent);"><p style="margin:0; font-weight: 500;">William Kim</p></td>
          <td style="padding: 0.75rem 0; border-bottom: 1px solid color-mix(in srgb, currentColor 10%, transparent);"><small>will@email.com</small></td>
          <td style="padding: 0.75rem 0; border-bottom: 1px solid color-mix(in srgb, currentColor 10%, transparent);"><small style="${badgeGreen}">Completed</small></td>
          <td style="padding: 0.75rem 0; border-bottom: 1px solid color-mix(in srgb, currentColor 10%, transparent); text-align: right;"><p style="margin:0; font-weight: 600;">$99.00</p></td>
        </tr>
        <tr>
          <td style="padding: 0.75rem 0;"><p style="margin:0; font-weight: 500;">Sofia Davis</p></td>
          <td style="padding: 0.75rem 0;"><small>sofia@email.com</small></td>
          <td style="padding: 0.75rem 0;"><small style="${badgeRed}">Failed</small></td>
          <td style="padding: 0.75rem 0; text-align: right;"><p style="margin:0; font-weight: 600;">$499.00</p></td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Bottom Row: Team + Quick Stats -->
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
    <!-- Team Members Card -->
    <div style="${cardStyle}">
      <h4 style="margin: 0 0 1rem;">Team Members</h4>
      <div style="display: flex; flex-direction: column; gap: 0.85rem;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; gap: 0.65rem; align-items: center;">
            <div style="width:28px; height:28px; border-radius:50%; background: rgba(99,102,241,0.2); flex-shrink:0;"></div>
            <div>
              <p style="margin: 0; font-weight: 500;">Sofia Davis</p>
              <small style="opacity: 0.5;">Lead Designer</small>
            </div>
          </div>
          <small style="font-weight: 500;">12 tasks</small>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; gap: 0.65rem; align-items: center;">
            <div style="width:28px; height:28px; border-radius:50%; background: rgba(234,179,8,0.2); flex-shrink:0;"></div>
            <div>
              <p style="margin: 0; font-weight: 500;">Alex Johnson</p>
              <small style="opacity: 0.5;">Frontend Dev</small>
            </div>
          </div>
          <small style="font-weight: 500;">8 tasks</small>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; gap: 0.65rem; align-items: center;">
            <div style="width:28px; height:28px; border-radius:50%; background: rgba(34,197,94,0.2); flex-shrink:0;"></div>
            <div>
              <p style="margin: 0; font-weight: 500;">Maya Patel</p>
              <small style="opacity: 0.5;">Backend Dev</small>
            </div>
          </div>
          <small style="font-weight: 500;">15 tasks</small>
        </div>
      </div>
    </div>

    <!-- Quick Stats Card -->
    <div style="${cardStyle}">
      <h4 style="margin: 0 0 1rem;">Storage</h4>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <h5 style="margin: 0;">64.8 GB</h5>
            <small style="opacity: 0.5;">of 100 GB used</small>
          </div>
          <div style="${barTrack} height: 10px;">
            <div style="height: 100%; width: 64.8%; background: linear-gradient(90deg, #6366f1, #a855f7); border-radius: 3px;"></div>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.5rem;">
          <div>
            <small style="opacity: 0.5;">Documents</small>
            <h6 style="margin: 0.15rem 0 0;">24.5 GB</h6>
          </div>
          <div>
            <small style="opacity: 0.5;">Media</small>
            <h6 style="margin: 0.15rem 0 0;">18.2 GB</h6>
          </div>
          <div>
            <small style="opacity: 0.5;">Backups</small>
            <h6 style="margin: 0.15rem 0 0;">14.8 GB</h6>
          </div>
          <div>
            <small style="opacity: 0.5;">Other</small>
            <h6 style="margin: 0.15rem 0 0;">7.3 GB</h6>
          </div>
        </div>
      </div>
    </div>
  </div>

</div>
`,
};
