import type { PreviewTemplate } from "./types";

const border = `1px solid color-mix(in srgb, currentColor 12%, transparent)`;
const borderLight = `1px solid color-mix(in srgb, currentColor 8%, transparent)`;
const cardBg = `color-mix(in srgb, currentColor 3%, transparent)`;
const card = `border: ${border}; border-radius: 12px; background: ${cardBg}; overflow: hidden;`;
const cardHeader = `padding: 1.25rem 1.5rem 0.75rem;`;
const cardTitle = `margin: 0 0 0.25rem; font-size: 1.1em; font-weight: 600; line-height: 1.3;`;
const cardDesc = `margin: 0; font-size: 0.8em; opacity: 0.5;`;
const cardContent = `padding: 0 1.5rem 1.25rem;`;
const cardFooter = `padding: 0.75rem 1.5rem; border-top: ${borderLight};`;
const btn = `display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; font-size: 0.82em; font-weight: 500; padding: 0.5em 1em; cursor: pointer; border: none; font-family: inherit;`;
const btnOutline = `${btn} background: transparent; border: ${border}; color: inherit;`;
const btnPrimary = `${btn} background: color-mix(in srgb, currentColor 80%, transparent); color: var(--bg-color);`;
const btnSecondary = `${btn} background: color-mix(in srgb, currentColor 8%, transparent); color: inherit;`;
const btnGhost = `${btn} background: transparent; opacity: 0.7; color: inherit;`;
const input = `width: 100%; padding: 0.5em 0.75em; border: ${border}; border-radius: 8px; background: transparent; font-size: 0.85em; font-family: inherit; color: inherit; box-sizing: border-box;`;
const textarea = `${input} min-height: 5em; resize: vertical;`;
const label = `font-size: 0.82em; font-weight: 500;`;
const avatarBase = `width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.72em; background: color-mix(in srgb, currentColor 10%, transparent);`;
const badge = `display: inline-block; font-size: 0.7em; padding: 0.2em 0.6em; border-radius: 999px; background: color-mix(in srgb, currentColor 8%, transparent); font-weight: 500;`;
const separator = `border: none; border-top: ${borderLight}; margin: 1rem 0;`;
const chatBubbleAgent = `max-width: 75%; padding: 0.55em 0.85em; border-radius: 10px; font-size: 0.85em; background: color-mix(in srgb, currentColor 7%, transparent);`;
const chatBubbleUser = `max-width: 75%; padding: 0.55em 0.85em; border-radius: 10px; font-size: 0.85em; margin-left: auto; background: color-mix(in srgb, currentColor 14%, transparent);`;
const toggle = `position: relative; width: 36px; height: 20px; border-radius: 999px; border: none; cursor: pointer; flex-shrink: 0;`;
const toggleOn = `${toggle} background: color-mix(in srgb, currentColor 75%, transparent);`;
const toggleOff = `${toggle} background: color-mix(in srgb, currentColor 15%, transparent);`;
const selectBox = `${input} appearance: none; padding-right: 2em; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='gray' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 0.6em center;`;
export const dashboardTemplate: PreviewTemplate = {
  id: "dashboard",
  name: "Dashboard",
  html: `
<style>
  @media (max-width: 900px) {
    #stats-row { grid-template-columns: 1fr 1fr !important; }
    #cards-grid { grid-template-columns: 1fr 1fr !important; }
    .card-col { display: contents !important; }
  }
  @media (max-width: 560px) {
    #stats-row { grid-template-columns: 1fr !important; }
    #cards-grid { grid-template-columns: 1fr !important; }
    .inner-2col { grid-template-columns: 1fr !important; }
    .card-number-row { grid-template-columns: 1fr !important; }
    .card-number-row input { width: 100% !important; }
  }
</style>

<div style="margin: 0 auto; padding: 1.25rem;">

  <!-- Stats Row -->
  <div id="stats-row" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1rem;">

    <!-- Revenue Card -->
    <div style="${card}">
      <div style="${cardHeader}">
        <p style="${cardDesc} margin-bottom: 0.35rem;">Total Revenue</p>
        <h3 style="margin: 0 0 0.2rem; font-size: 1.6em; font-weight: 700;">$15,231.89</h3>
        <p style="${cardDesc}">+20.1% from last month</p>
      </div>
      <div style="padding: 0.25rem 1.5rem 0.75rem;">
        <svg viewBox="0 0 300 50" style="width: 100%; height: 50px;">
          <polyline points="0,40 40,33 80,42 120,25 160,44 200,16 240,12 280,4 300,8" fill="none" stroke="currentColor" stroke-width="2" stroke-opacity="0.45" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>

    <!-- Subscriptions Card -->
    <div style="${card}">
      <div style="${cardHeader}">
        <p style="${cardDesc} margin-bottom: 0.35rem;">Subscriptions</p>
        <h3 style="margin: 0 0 0.2rem; font-size: 1.6em; font-weight: 700;">+2,350</h3>
        <p style="${cardDesc}">+180.1% from last month</p>
      </div>
      <div style="padding: 0.25rem 1.5rem 0.75rem;">
        <svg viewBox="0 0 300 50" style="width: 100%; height: 50px;">
          <path d="M0,44 Q40,40 80,36 T160,30 T240,16 T300,4 L300,50 L0,50 Z" fill="currentColor" fill-opacity="0.06" stroke="currentColor" stroke-width="2" stroke-opacity="0.35"/>
        </svg>
      </div>
    </div>

    <!-- Calendar Card -->
    <div style="${card}">
      <div style="padding: 1rem 1.25rem 0.75rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <span style="font-size: 0.6em; opacity: 0.4; cursor: pointer;">&#x25C0;</span>
          <span style="font-size: 0.85em; font-weight: 600;">June 2025</span>
          <span style="font-size: 0.6em; opacity: 0.4; cursor: pointer;">&#x25B6;</span>
        </div>
        <table style="width: 100%; border-collapse: collapse; text-align: center; font-size: 0.72em;">
          <thead><tr style="opacity: 0.4;">
            <th style="padding: 0.25em; font-weight: 500;">Su</th><th style="padding: 0.25em; font-weight: 500;">Mo</th><th style="padding: 0.25em; font-weight: 500;">Tu</th><th style="padding: 0.25em; font-weight: 500;">We</th><th style="padding: 0.25em; font-weight: 500;">Th</th><th style="padding: 0.25em; font-weight: 500;">Fr</th><th style="padding: 0.25em; font-weight: 500;">Sa</th>
          </tr></thead>
          <tbody>
            <tr><td style="padding: 0.35em;"></td><td style="padding: 0.35em;"></td><td style="padding: 0.35em;"></td><td style="padding: 0.35em;"></td><td style="padding: 0.35em;"></td><td style="padding: 0.35em;"></td><td style="padding: 0.35em;">1</td></tr>
            <tr><td style="padding: 0.35em;">2</td><td style="padding: 0.35em;">3</td><td style="padding: 0.35em;">4</td><td style="padding: 0.35em; border-radius: 6px; background: color-mix(in srgb, currentColor 80%, transparent);"><span style="color: var(--bg-color);">5</span></td><td style="padding: 0.35em;">6</td><td style="padding: 0.35em;">7</td><td style="padding: 0.35em;">8</td></tr>
            <tr style="background: color-mix(in srgb, currentColor 8%, transparent); border-radius: 6px;"><td style="padding: 0.35em; font-weight: 600;">9</td><td style="padding: 0.35em; font-weight: 600;">10</td><td style="padding: 0.35em; font-weight: 600;">11</td><td style="padding: 0.35em; font-weight: 600;">12</td><td style="padding: 0.35em; font-weight: 600;">13</td><td style="padding: 0.35em; font-weight: 600;">14</td><td style="padding: 0.35em; font-weight: 600;">15</td></tr>
            <tr><td style="padding: 0.35em;">16</td><td style="padding: 0.35em;">17</td><td style="padding: 0.35em;">18</td><td style="padding: 0.35em;">19</td><td style="padding: 0.35em;">20</td><td style="padding: 0.35em;">21</td><td style="padding: 0.35em;">22</td></tr>
            <tr><td style="padding: 0.35em;">23</td><td style="padding: 0.35em;">24</td><td style="padding: 0.35em;">25</td><td style="padding: 0.35em;">26</td><td style="padding: 0.35em;">27</td><td style="padding: 0.35em;">28</td><td style="padding: 0.35em;">29</td></tr>
            <tr><td style="padding: 0.35em;">30</td><td style="padding: 0.35em; opacity: 0.3;">1</td><td style="padding: 0.35em; opacity: 0.3;">2</td><td style="padding: 0.35em; opacity: 0.3;">3</td><td style="padding: 0.35em; opacity: 0.3;">4</td><td style="padding: 0.35em; opacity: 0.3;">5</td><td style="padding: 0.35em; opacity: 0.3;">6</td></tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>

  <!-- Main Cards Grid — 3 columns -->
  <div id="cards-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; align-items: start;">

    <!-- Col 1: Upgrade Subscription + Exercise -->
    <div class="card-col" style="display: flex; flex-direction: column; gap: 1rem;">

      <div style="${card}">
        <div style="${cardHeader}">
          <h4 style="${cardTitle}">Upgrade your subscription</h4>
          <p style="${cardDesc}">You are currently on the free plan. Upgrade to pro for full access.</p>
        </div>
        <div style="${cardContent}">
          <div class="inner-2col" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; margin-bottom: 0.85rem;">
            <div>
              <label style="${label}; display: block; margin-bottom: 0.35em;">Name</label>
              <input value="Evil Rabbit" style="${input}" />
            </div>
            <div>
              <label style="${label}; display: block; margin-bottom: 0.35em;">Email</label>
              <input value="example@acme.co" style="${input}" />
            </div>
          </div>
          <div style="margin-bottom: 0.85rem;">
            <label style="${label}; display: block; margin-bottom: 0.35em;">Card Number</label>
            <div class="card-number-row" style="display: grid; grid-template-columns: 1fr auto auto; gap: 0.5rem;">
              <input value="1234 1234 1234 12" style="${input}" />
              <input value="MM/YY" style="${input} width: 70px;" />
              <input value="CVC" style="${input} width: 56px;" />
            </div>
          </div>
          <div style="margin-bottom: 0.85rem;">
            <label style="${label}; display: block; margin-bottom: 0.5em;">Plan</label>
            <p style="${cardDesc} margin-bottom: 0.5em;">Select the plan that best fits your needs.</p>
            <div class="inner-2col" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
              <div style="border: ${border}; border-radius: 8px; padding: 0.65rem; cursor: pointer; background: color-mix(in srgb, currentColor 5%, transparent);">
                <div style="display: flex; align-items: center; gap: 0.4em; margin-bottom: 0.25em;">
                  <span style="width: 10px; height: 10px; border-radius: 50%; background: color-mix(in srgb, currentColor 80%, transparent); display: inline-block;"></span>
                  <span style="font-size: 0.82em; font-weight: 600;">Starter Plan</span>
                </div>
                <small style="opacity: 0.45; font-size: 0.72em;">Perfect for small businesses.</small>
              </div>
              <div style="border: ${border}; border-radius: 8px; padding: 0.65rem; cursor: pointer;">
                <div style="display: flex; align-items: center; gap: 0.4em; margin-bottom: 0.25em;">
                  <span style="width: 10px; height: 10px; border-radius: 50%; border: ${border}; display: inline-block;"></span>
                  <span style="font-size: 0.82em; font-weight: 600;">Pro Plan</span>
                </div>
                <small style="opacity: 0.45; font-size: 0.72em;">More features and storage.</small>
              </div>
            </div>
          </div>
          <div style="margin-bottom: 0.85rem;">
            <label style="${label}; display: block; margin-bottom: 0.35em;">Notes</label>
            <textarea placeholder="Enter notes" style="${textarea} min-height: 3.5em;"></textarea>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 0.5rem;">
            <label style="display: flex; align-items: center; gap: 0.5em; font-size: 0.82em; cursor: pointer;">
              <span style="width: 16px; height: 16px; border: ${border}; border-radius: 4px; display: inline-block; flex-shrink: 0;"></span>
              I agree to the terms and conditions
            </label>
            <label style="display: flex; align-items: center; gap: 0.5em; font-size: 0.82em; cursor: pointer;">
              <span style="width: 16px; height: 16px; border: ${border}; border-radius: 4px; display: inline-block; flex-shrink: 0; background: color-mix(in srgb, currentColor 80%, transparent);"></span>
              Allow us to send you emails
            </label>
          </div>
        </div>
        <div style="${cardFooter} display: flex; justify-content: space-between; gap: 0.5rem;">
          <button style="${btnOutline}">Cancel</button>
          <button style="${btnPrimary}">Upgrade Plan</button>
        </div>
      </div>

      <!-- Exercise Minutes Card -->
      <div style="${card}">
        <div style="${cardHeader}">
          <h4 style="${cardTitle}">Exercise Minutes</h4>
          <p style="${cardDesc}">Your exercise minutes are ahead of where you normally are.</p>
        </div>
        <div style="${cardContent}">
          <svg viewBox="0 0 300 120" style="width: 100%; height: 100px;">
            <polyline points="0,90 45,75 90,85 135,50 180,60 225,40 270,55" fill="none" stroke="currentColor" stroke-width="2" stroke-opacity="0.45" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="0,100 45,95 90,90 135,80 180,85 225,78 270,82" fill="none" stroke="currentColor" stroke-width="2" stroke-opacity="0.15" stroke-dasharray="4 4" stroke-linecap="round"/>
          </svg>
          <div style="display: flex; justify-content: space-between; font-size: 0.7em; opacity: 0.4; margin-top: 0.25rem;">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Col 2: Create Account + Chat + GitHub -->
    <div class="card-col" style="display: flex; flex-direction: column; gap: 1rem;">
      <!-- Create Account Card -->
      <div style="${card}">
        <div style="${cardHeader}">
          <h4 style="${cardTitle} font-size: 1.2em;">Create an account</h4>
          <p style="${cardDesc}">Enter your email below to create your account</p>
        </div>
        <div style="${cardContent}">
          <div class="inner-2col" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; margin-bottom: 0.85rem;">
            <button style="${btnOutline} width: 100%; gap: 0.4em;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              GitHub
            </button>
            <button style="${btnOutline} width: 100%; gap: 0.4em;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
              Google
            </button>
          </div>
          <div style="position: relative; text-align: center; margin: 1rem 0;">
            <hr style="${separator}" />
            <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: inherit; padding: 0 0.75em; font-size: 0.7em; opacity: 0.45; text-transform: uppercase; letter-spacing: 0.03em;">Or continue with</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div>
              <label style="${label}; display: block; margin-bottom: 0.3em;">Email</label>
              <input type="email" placeholder="m@example.com" style="${input}" />
            </div>
            <div>
              <label style="${label}; display: block; margin-bottom: 0.3em;">Password</label>
              <input type="password" value="password123" style="${input}" />
            </div>
          </div>
        </div>
        <div style="${cardFooter}">
          <button style="${btnPrimary} width: 100%;">Create account</button>
        </div>
      </div>

      <!-- Chat Card -->
      <div style="${card} display: flex; flex-direction: column;">
        <div style="${cardHeader} display: flex; align-items: center; gap: 0.75rem;">
          <div style="${avatarBase}">S</div>
          <div style="flex: 1;">
            <p style="margin: 0; font-weight: 500; font-size: 0.85em;">Sofia Davis</p>
            <small style="opacity: 0.4; font-size: 0.75em;">m@example.com</small>
          </div>
          <div style="width: 26px; height: 26px; border-radius: 50%; background: color-mix(in srgb, currentColor 8%, transparent); display: flex; align-items: center; justify-content: center;">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>
        </div>
        <div style="${cardContent}">
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <div style="${chatBubbleAgent}">Hi, how can I help you today?</div>
            <div style="${chatBubbleUser}">Hey, I'm having trouble with my account.</div>
            <div style="${chatBubbleAgent}">What seems to be the problem?</div>
            <div style="${chatBubbleUser}">I can't log in.</div>
          </div>
        </div>
        <div style="${cardFooter} display: flex; gap: 0.5rem;">
          <input placeholder="Type your message..." style="${input}" />
          <button style="${btnPrimary} flex-shrink: 0; padding: 0.5em 0.6em; border-radius: 50%;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg></button>
        </div>
      </div>

      <!-- GitHub Card -->
      <div style="${card}">
        <div style="${cardHeader}">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem;">
            <div>
              <h4 style="${cardTitle}">tweakcn</h4>
              <p style="${cardDesc}">A visual editor for shadcn/ui components with beautiful themes.</p>
            </div>
            <button style="${btnSecondary} flex-shrink: 0; gap: 0.3em; font-size: 0.78em;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 19.771l-7.416 3.642 1.48-8.279L0 9.306l8.332-1.151z"/></svg>
              Star
            </button>
          </div>
        </div>
        <div style="${cardContent}">
          <div style="display: flex; gap: 1rem; font-size: 0.78em; opacity: 0.5;">
            <div style="display: flex; align-items: center; gap: 0.3em;"><span style="width: 9px; height: 9px; border-radius: 50%; background: #3178c6; display: inline-block;"></span>TypeScript</div>
            <div style="display: flex; align-items: center; gap: 0.3em;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 19.771l-7.416 3.642 1.48-8.279L0 9.306l8.332-1.151z"/></svg>20k</div>
            <span>Updated April 2023</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Col 3: Team + Cookie + Payments + Report -->
    <div class="card-col" style="display: flex; flex-direction: column; gap: 1rem;">

      <!-- Team Members Card -->
      <div style="${card}">
        <div style="${cardHeader}">
          <h4 style="${cardTitle}">Team Members</h4>
          <p style="${cardDesc}">Invite your team members to collaborate.</p>
        </div>
        <div style="${cardContent}">
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
              <div style="display: flex; align-items: center; gap: 0.65rem;">
                <div style="${avatarBase}">S</div>
                <div><p style="margin: 0; font-weight: 500; font-size: 0.85em;">Sofia Davis</p><small style="opacity: 0.4; font-size: 0.72em;">m@example.com</small></div>
              </div>
              <select style="${selectBox} width: auto; padding: 0.3em 1.8em 0.3em 0.5em; font-size: 0.78em;"><option>Owner</option><option>Developer</option></select>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
              <div style="display: flex; align-items: center; gap: 0.65rem;">
                <div style="${avatarBase}">J</div>
                <div><p style="margin: 0; font-weight: 500; font-size: 0.85em;">Jackson Lee</p><small style="opacity: 0.4; font-size: 0.72em;">p@example.com</small></div>
              </div>
              <select style="${selectBox} width: auto; padding: 0.3em 1.8em 0.3em 0.5em; font-size: 0.78em;"><option>Developer</option><option>Viewer</option></select>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
              <div style="display: flex; align-items: center; gap: 0.65rem;">
                <div style="${avatarBase}">I</div>
                <div><p style="margin: 0; font-weight: 500; font-size: 0.85em;">Isabella Nguyen</p><small style="opacity: 0.4; font-size: 0.72em;">i@example.com</small></div>
              </div>
              <select style="${selectBox} width: auto; padding: 0.3em 1.8em 0.3em 0.5em; font-size: 0.78em;"><option>Billing</option><option>Viewer</option></select>
            </div>
          </div>
        </div>
      </div>

      <!-- Cookie Settings Card -->
      <div style="${card}">
        <div style="${cardHeader}">
          <h4 style="${cardTitle}">Cookie Settings</h4>
          <p style="${cardDesc}">Manage your cookie settings here.</p>
        </div>
        <div style="${cardContent}">
          <div style="display: flex; flex-direction: column; gap: 1.1rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;">
              <div><p style="margin: 0; font-weight: 500; font-size: 0.85em;">Strictly Necessary</p><small style="opacity: 0.4; font-size: 0.75em; line-height: 1.4;">These cookies are essential in order to use the website and its features.</small></div>
              <div style="${toggleOn}"><div style="position: absolute; top: 2px; right: 2px; width: 16px; height: 16px; border-radius: 50%; background: var(--bg-color);"></div></div>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;">
              <div><p style="margin: 0; font-weight: 500; font-size: 0.85em;">Functional Cookies</p><small style="opacity: 0.4; font-size: 0.75em; line-height: 1.4;">These cookies allow the website to provide personalized functionality.</small></div>
              <div style="${toggleOff}"><div style="position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: var(--bg-color);"></div></div>
            </div>
          </div>
        </div>
        <div style="${cardFooter}">
          <button style="${btnOutline} width: 100%;">Save preferences</button>
        </div>
      </div>

      <!-- Payments Card -->
      <div style="${card}">
        <div style="${cardHeader}">
          <h4 style="${cardTitle}">Payments</h4>
          <p style="${cardDesc}">Manage your payments.</p>
        </div>
        <div style="padding: 0; overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.8em;">
            <thead>
              <tr style="border-bottom: ${borderLight};">
                <th style="padding: 0.55rem 1rem; text-align: left; opacity: 0.45; font-weight: 500; font-size: 0.85em;">Status</th>
                <th style="padding: 0.55rem 0.75rem; text-align: left; opacity: 0.45; font-weight: 500; font-size: 0.85em;">Email</th>
                <th style="padding: 0.55rem 1rem; text-align: right; opacity: 0.45; font-weight: 500; font-size: 0.85em;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: ${borderLight};">
                <td style="padding: 0.6rem 1rem;"><span style="${badge}">Success</span></td>
                <td style="padding: 0.6rem 0.75rem; opacity: 0.65;">ken99@example.com</td>
                <td style="padding: 0.6rem 1rem; text-align: right; font-weight: 600;">$316.00</td>
              </tr>
              <tr style="border-bottom: ${borderLight};">
                <td style="padding: 0.6rem 1rem;"><span style="${badge}">Success</span></td>
                <td style="padding: 0.6rem 0.75rem; opacity: 0.65;">abe45@example.com</td>
                <td style="padding: 0.6rem 1rem; text-align: right; font-weight: 600;">$242.00</td>
              </tr>
              <tr style="border-bottom: ${borderLight};">
                <td style="padding: 0.6rem 1rem;"><span style="${badge}">Processing</span></td>
                <td style="padding: 0.6rem 0.75rem; opacity: 0.65;">monserrat44@example.com</td>
                <td style="padding: 0.6rem 1rem; text-align: right; font-weight: 600;">$837.00</td>
              </tr>
              <tr>
                <td style="padding: 0.6rem 1rem;"><span style="${badge}">Failed</span></td>
                <td style="padding: 0.6rem 0.75rem; opacity: 0.65;">carmella@example.com</td>
                <td style="padding: 0.6rem 1rem; text-align: right; font-weight: 600;">$721.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Report Issue Card -->
      <div style="${card}">
        <div style="${cardHeader}">
          <h4 style="${cardTitle}">Report an issue</h4>
          <p style="${cardDesc}">What area are you having problems with?</p>
        </div>
        <div style="${cardContent}">
          <div class="inner-2col" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; margin-bottom: 0.75rem;">
            <div>
              <label style="${label}; display: block; margin-bottom: 0.3em;">Area</label>
              <select style="${selectBox}"><option>Team</option><option selected>Billing</option><option>Account</option></select>
            </div>
            <div>
              <label style="${label}; display: block; margin-bottom: 0.3em;">Security Level</label>
              <select style="${selectBox}"><option>Severity 1</option><option selected>Severity 2</option><option>Severity 3</option></select>
            </div>
          </div>
          <div style="margin-bottom: 0.75rem;">
            <label style="${label}; display: block; margin-bottom: 0.3em;">Subject</label>
            <input placeholder="I need help with..." style="${input}" />
          </div>
          <div>
            <label style="${label}; display: block; margin-bottom: 0.3em;">Description</label>
            <textarea placeholder="Please include all information relevant to your issue." style="${textarea}"></textarea>
          </div>
        </div>
        <div style="${cardFooter} display: flex; justify-content: flex-end; gap: 0.4rem;">
          <button style="${btnGhost}">Cancel</button>
          <button style="${btnPrimary}">Submit</button>
        </div>
      </div>

    </div>

  </div>

</div>
`,
};
