import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";

// Load environment variables from .env.local or .env without external dotenv dependency
function loadEnv() {
  const envFiles = [".env.local", ".env"];
  for (const file of envFiles) {
    const fullPath = path.resolve(process.cwd(), file);
    if (!fs.existsSync(fullPath)) continue;
    const lines = fs.readFileSync(fullPath, "utf-8").split("\n");
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const eqIdx = line.indexOf("=");
      if (eqIdx === -1) continue;
      const key = line.slice(0, eqIdx).trim();
      let val = line.slice(eqIdx + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !secretKey) {
  console.error("Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY.");
  process.exit(1);
}

// Print host only for security
try {
  const host = new URL(supabaseUrl).host;
  console.log(`Supabase target host: ${host}`);
} catch {
  console.error("Error: Invalid Supabase URL format.");
  process.exit(1);
}

// Safety check: Exit unless --yes is passed
const args = process.argv.slice(2);
const hasYes = args.includes("--yes");
const hasReset = args.includes("--reset");

if (!hasYes) {
  console.log(
    "\nSafety check: You must pass --yes to execute seeding.\n" +
      "Usage:\n" +
      "  npm run seed -- --yes          (Idempotent seed)\n" +
      "  npm run seed -- --yes --reset  (Delete demo accounts & re-seed)\n"
  );
  process.exit(0);
}

// Create dedicated Supabase admin client (no server-only imports)
const supabase = createClient(supabaseUrl, secretKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

interface DemoAccount {
  email: string;
  password?: string;
  fullName: string;
  role: "ADMIN" | "USER";
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: "admin444@example.com",
    password: "admin12345",
    fullName: "Demo Admin",
    role: "ADMIN",
  },
  {
    email: "user1@example.com",
    password: "user12345",
    fullName: "Demo User",
    role: "USER",
  },
  {
    email: "maya.demo@example.com",
    fullName: "Maya Lin",
    role: "USER",
  },
  {
    email: "liam.demo@example.com",
    fullName: "Liam Patel",
    role: "USER",
  },
  {
    email: "sophia.demo@example.com",
    fullName: "Sophia Davis",
    role: "USER",
  },
  {
    email: "lucas.demo@example.com",
    fullName: "Lucas Silva",
    role: "USER",
  },
  {
    email: "emma.demo@example.com",
    fullName: "Emma Wilson",
    role: "USER",
  },
  {
    email: "noah.demo@example.com",
    fullName: "Noah Becker",
    role: "USER",
  },
];

const DEMO_EMAILS = new Set(DEMO_ACCOUNTS.map((a) => a.email.toLowerCase()));

// Helper to generate date spread over past 30 days
function pastDate(daysAgo: number, hoursOffset = 0): string {
  const d = new Date(Date.now() - (daysAgo * 24 + hoursOffset) * 60 * 60 * 1000);
  return d.toISOString();
}

interface PostDefinition {
  title: string;
  description: string;
  category: "FEATURE" | "BUG" | "UI";
  status: "UNDER_REVIEW" | "PLANNED" | "IN_PROGRESS" | "COMPLETED";
  authorEmail: string;
  daysAgo: number;
  tags?: string[];
  aiFlagged?: boolean;
  aiFlagReason?: string;
  isDeleted?: boolean;
  deletedByAdmin?: boolean;
  votesFrom: string[]; // list of author emails who upvote
  comments: {
    authorEmail: string;
    content: string;
    daysAgo: number;
    isDeleted?: boolean;
    deletedByAdmin?: boolean;
  }[];
}

const POSTS: PostDefinition[] = [
  // Pair 1: CSV Export
  {
    title: "Export feedback to CSV",
    description:
      "Allow workspace managers to export feedback items, votes, and roadmap statuses to a CSV spreadsheet for sprint planning and reporting.",
    category: "FEATURE",
    status: "UNDER_REVIEW",
    authorEmail: "maya.demo@example.com",
    daysAgo: 28,
    tags: ["export", "csv", "reporting"],
    votesFrom: [
      "admin444@example.com",
      "user1@example.com",
      "maya.demo@example.com",
      "liam.demo@example.com",
      "sophia.demo@example.com",
      "lucas.demo@example.com",
      "emma.demo@example.com",
      "noah.demo@example.com",
    ],
    comments: [
      {
        authorEmail: "user1@example.com",
        content: "This would save our product team hours every Monday morning when building stakeholder updates.",
        daysAgo: 27,
      },
      {
        authorEmail: "admin444@example.com",
        content: "Great suggestion. We are considering including filters so you can export by status.",
        daysAgo: 26,
      },
      {
        authorEmail: "liam.demo@example.com",
        content: "Please make sure dates in the CSV are formatted in ISO-8601 so spreadsheets parse them cleanly.",
        daysAgo: 25,
      },
    ],
  },
  {
    title: "Export feedbacks and roadmap data to CSV or JSON",
    description:
      "Project managers need an easy way to export approved feature requests and customer feedback into spreadsheets or roadmap tools like Linear or Jira.",
    category: "FEATURE",
    status: "PLANNED",
    authorEmail: "liam.demo@example.com",
    daysAgo: 24,
    tags: ["export", "json", "roadmap"],
    votesFrom: [
      "user1@example.com",
      "liam.demo@example.com",
      "sophia.demo@example.com",
      "emma.demo@example.com",
      "noah.demo@example.com",
    ],
    comments: [
      {
        authorEmail: "sophia.demo@example.com",
        content: "JSON export would be awesome for automating sync with our custom internal dashboard.",
        daysAgo: 23,
      },
      {
        authorEmail: "maya.demo@example.com",
        content: "Looks very similar to the CSV export request, maybe both formats can share the same export modal.",
        daysAgo: 22,
      },
    ],
  },

  // Pair 2: Dark mode
  {
    title: "Dark mode toggle with system preference detection",
    description:
      "Please consider adding a sleek dark theme. Many developers use the platform in low-light environments, and bright white backgrounds cause eye strain.",
    category: "UI",
    status: "COMPLETED",
    authorEmail: "sophia.demo@example.com",
    daysAgo: 29,
    tags: ["theme", "dark-mode", "ui"],
    votesFrom: [
      "admin444@example.com",
      "user1@example.com",
      "maya.demo@example.com",
      "sophia.demo@example.com",
      "lucas.demo@example.com",
      "emma.demo@example.com",
      "noah.demo@example.com",
    ],
    comments: [
      {
        authorEmail: "lucas.demo@example.com",
        content: "Yes please! With next-themes and Tailwind CSS, this should integrate cleanly.",
        daysAgo: 28,
      },
      {
        authorEmail: "admin444@example.com",
        content: "This is now implemented and live in the latest release! Enjoy dark mode.",
        daysAgo: 20,
      },
      {
        authorEmail: "noah.demo@example.com",
        content: "The contrast ratios look fantastic on OLED screens, thank you!",
        daysAgo: 19,
      },
    ],
  },
  {
    title: "Add dark theme option to reduce eye strain",
    description:
      "A dark mode theme switch would make working late at night much more comfortable and prevent excessive screen brightness.",
    category: "UI",
    status: "IN_PROGRESS",
    authorEmail: "lucas.demo@example.com",
    daysAgo: 26,
    tags: ["dark-mode", "accessibility"],
    votesFrom: [
      "user1@example.com",
      "lucas.demo@example.com",
      "emma.demo@example.com",
      "noah.demo@example.com",
    ],
    comments: [
      {
        authorEmail: "sophia.demo@example.com",
        content: "Totally agree, we have a related proposal that just shipped system preference matching.",
        daysAgo: 25,
      },
      {
        authorEmail: "admin444@example.com",
        content: "We are currently tuning dark mode palette borders for higher contrast.",
        daysAgo: 21,
      },
    ],
  },

  // Pair 3: Keyboard shortcuts
  {
    title: "Keyboard shortcuts for quick navigation and triage",
    description:
      "Power users would benefit greatly from global hotkeys such as pressing J/K to move between cards and E to edit status.",
    category: "FEATURE",
    status: "PLANNED",
    authorEmail: "emma.demo@example.com",
    daysAgo: 25,
    tags: ["hotkeys", "productivity"],
    votesFrom: [
      "admin444@example.com",
      "user1@example.com",
      "maya.demo@example.com",
      "liam.demo@example.com",
      "emma.demo@example.com",
      "noah.demo@example.com",
    ],
    comments: [
      {
        authorEmail: "admin444@example.com",
        content: "Vim-style navigation keys (J and K) would make reviewing backlogs super fast.",
        daysAgo: 24,
      },
      {
        authorEmail: "noah.demo@example.com",
        content: "Please include a shortcut overlay helper (like pressing ? to view cheat sheet).",
        daysAgo: 23,
      },
    ],
  },
  {
    title: "Add hotkeys and keyboard navigation across boards",
    description:
      "Provide keyboard shortcuts to quickly navigate through tickets, search items, and toggle filters without using the mouse.",
    category: "FEATURE",
    status: "UNDER_REVIEW",
    authorEmail: "noah.demo@example.com",
    daysAgo: 22,
    tags: ["keyboard", "accessibility"],
    votesFrom: [
      "maya.demo@example.com",
      "sophia.demo@example.com",
      "noah.demo@example.com",
    ],
    comments: [
      {
        authorEmail: "emma.demo@example.com",
        content: "Adding hotkeys will be a game changer for triaging fifty requests at a time.",
        daysAgo: 21,
      },
      {
        authorEmail: "liam.demo@example.com",
        content: "Make sure pressing Escape cancels open dialogs or search modals reliably.",
        daysAgo: 20,
      },
    ],
  },

  // Additional realistic task app posts
  {
    title: "Upvote count does not update instantly without page refresh",
    description:
      "When clicking the upvote button on the homepage feedback card, the count does not increment optimistically. You have to refresh the whole page to see the updated number.",
    category: "BUG",
    status: "IN_PROGRESS",
    authorEmail: "user1@example.com",
    daysAgo: 27,
    tags: ["voting", "cache", "bug"],
    votesFrom: [
      "admin444@example.com",
      "user1@example.com",
      "maya.demo@example.com",
      "liam.demo@example.com",
      "lucas.demo@example.com",
      "emma.demo@example.com",
    ],
    comments: [
      {
        authorEmail: "admin444@example.com",
        content: "We are adding React useOptimistic hook so clicks immediately increment visually.",
        daysAgo: 26,
      },
      {
        authorEmail: "lucas.demo@example.com",
        content: "Verified that server actions revalidatePath properly, just needs the client optimism.",
        daysAgo: 24,
      },
    ],
  },
  {
    title: "Comment input does not clear after successful submission",
    description:
      "After typing a comment and clicking post, the message appears in the list but the textarea still retains the previous text. This can lead to duplicate comments if clicked again.",
    category: "BUG",
    status: "UNDER_REVIEW",
    authorEmail: "maya.demo@example.com",
    daysAgo: 23,
    tags: ["comments", "ux-bug"],
    votesFrom: [
      "user1@example.com",
      "maya.demo@example.com",
      "liam.demo@example.com",
      "sophia.demo@example.com",
      "noah.demo@example.com",
    ],
    comments: [
      {
        authorEmail: "user1@example.com",
        content: "I accidentally posted duplicate comments yesterday due to this exact behavior.",
        daysAgo: 22,
      },
      {
        authorEmail: "emma.demo@example.com",
        content: "Resetting formRef.current?.reset() on action completion will solve it.",
        daysAgo: 21,
      },
    ],
  },
  {
    title: "Improve mobile responsiveness of navigation bar and filter tabs",
    description:
      "On smaller screen widths (below 380px), the navbar links overlap with the user avatar, and the category filter pills wrap awkwardly onto multiple lines.",
    category: "UI",
    status: "IN_PROGRESS",
    authorEmail: "liam.demo@example.com",
    daysAgo: 21,
    tags: ["mobile", "responsive", "navbar"],
    votesFrom: [
      "user1@example.com",
      "liam.demo@example.com",
      "lucas.demo@example.com",
    ],
    comments: [
      {
        authorEmail: "sophia.demo@example.com",
        content: "Tested on iPhone SE and the profile picture gets squished against the screen edge.",
        daysAgo: 20,
      },
      {
        authorEmail: "admin444@example.com",
        content: "A mobile sheet drawer for navigation links is already being styled.",
        daysAgo: 19,
      },
    ],
  },
  {
    title: "Add GitHub and Google OAuth sign-in options",
    description:
      "It would be great to have social login integrations such as GitHub and Google. This will speed up the onboarding process and reduce the friction of creating a password manually.",
    category: "FEATURE",
    status: "COMPLETED",
    authorEmail: "sophia.demo@example.com",
    daysAgo: 30,
    tags: ["auth", "oauth", "security"],
    votesFrom: [
      "admin444@example.com",
      "user1@example.com",
      "maya.demo@example.com",
      "liam.demo@example.com",
      "sophia.demo@example.com",
      "lucas.demo@example.com",
      "emma.demo@example.com",
    ],
    comments: [
      {
        authorEmail: "user1@example.com",
        content: "Google login is super convenient for team members on Google Workspace.",
        daysAgo: 29,
      },
      {
        authorEmail: "admin444@example.com",
        content: "Google OAuth is now wired up with Supabase Auth providers!",
        daysAgo: 18,
      },
    ],
  },
  {
    title: "Session expired error shown prematurely on tab switch",
    description:
      "Leaving the browser tab inactive for more than twenty minutes triggers an unhandled session expiration error dialog instead of silently refreshing the token.",
    category: "BUG",
    status: "COMPLETED",
    authorEmail: "lucas.demo@example.com",
    daysAgo: 19,
    tags: ["auth", "session", "bug"],
    votesFrom: [
      "admin444@example.com",
      "user1@example.com",
      "lucas.demo@example.com",
      "noah.demo@example.com",
    ],
    comments: [
      {
        authorEmail: "admin444@example.com",
        content: "Fixed in middleware with supabase.auth.getUser() automatic token refresh cookies.",
        daysAgo: 17,
      },
      {
        authorEmail: "maya.demo@example.com",
        content: "Can confirm no unexpected logouts today when leaving tabs backgrounded.",
        daysAgo: 16,
      },
    ],
  },
  {
    title: "Roadmap kanban board column drag and drop reordering",
    description:
      "Allow product administrators to drag and drop feature request cards directly between Planned, In Progress, and Completed columns on the roadmap view.",
    category: "FEATURE",
    status: "PLANNED",
    authorEmail: "emma.demo@example.com",
    daysAgo: 18,
    tags: ["roadmap", "kanban"],
    votesFrom: [
      "admin444@example.com",
      "user1@example.com",
      "maya.demo@example.com",
      "emma.demo@example.com",
      "noah.demo@example.com",
    ],
    comments: [
      {
        authorEmail: "liam.demo@example.com",
        content: "Using @hello-pangea/dnd or standard HTML Drag and Drop API would make this feel very natural.",
        daysAgo: 16,
      },
      {
        authorEmail: "admin444@example.com",
        content: "We will ensure only admins have permission to execute the status update mutation.",
        daysAgo: 15,
      },
    ],
  },
  {
    title: "Email notifications for status changes on upvoted ideas",
    description:
      "Users should receive an automated email digest whenever a feedback item they voted on or commented on moves to In Progress or Completed.",
    category: "FEATURE",
    status: "UNDER_REVIEW",
    authorEmail: "noah.demo@example.com",
    daysAgo: 17,
    tags: ["notifications", "email"],
    votesFrom: [
      "user1@example.com",
      "maya.demo@example.com",
      "sophia.demo@example.com",
      "noah.demo@example.com",
    ],
    comments: [
      {
        authorEmail: "user1@example.com",
        content: "Would love a weekly digest option so our inbox does not get flooded with individual pings.",
        daysAgo: 15,
      },
      {
        authorEmail: "emma.demo@example.com",
        content: "An unsubscribe one-click link at the bottom of each email will be essential.",
        daysAgo: 14,
      },
    ],
  },
  {
    title: "Sticky filter header hides top comment on mobile devices",
    description:
      "On mobile viewports with sticky navigation enabled, the top of the comments thread gets obscured by the fixed header bar when navigating via anchor links.",
    category: "BUG",
    status: "IN_PROGRESS",
    authorEmail: "user1@example.com",
    daysAgo: 16,
    tags: ["mobile", "layout", "bug"],
    votesFrom: [
      "admin444@example.com",
      "user1@example.com",
      "lucas.demo@example.com",
    ],
    comments: [
      {
        authorEmail: "lucas.demo@example.com",
        content: "Adding scroll-margin-top: 5rem or scroll-padding on the parent container solves this.",
        daysAgo: 14,
      },
      {
        authorEmail: "admin444@example.com",
        content: "Applying the scroll-mt utility to the comment container now.",
        daysAgo: 12,
      },
    ],
  },
  {
    title: "Allow users to upload screenshots and attachments in feedback",
    description:
      "Adding image upload or paste support for PNG and JPEG screenshots would make bug reports much easier to understand and reproduce.",
    category: "FEATURE",
    status: "PLANNED",
    authorEmail: "maya.demo@example.com",
    daysAgo: 15,
    tags: ["attachments", "uploads"],
    votesFrom: [
      "admin444@example.com",
      "user1@example.com",
      "maya.demo@example.com",
      "liam.demo@example.com",
      "sophia.demo@example.com",
    ],
    comments: [
      {
        authorEmail: "liam.demo@example.com",
        content: "Supabase Storage bucket with 5MB max upload limits would fit this perfectly.",
        daysAgo: 13,
      },
      {
        authorEmail: "sophia.demo@example.com",
        content: "Pasting from clipboard directly with Cmd+V would make submitting bugs effortless.",
        daysAgo: 11,
      },
    ],
  },
  {
    title: "Card hover states flicker during rapid scrolling on Safari",
    description:
      "In Safari desktop and iOS WebKit, transition styles on card hover cause noticeable micro-stuttering and repaint flicker during fast scroll gestures.",
    category: "BUG",
    status: "IN_PROGRESS",
    authorEmail: "liam.demo@example.com",
    daysAgo: 14,
    tags: [],
    votesFrom: [
      "liam.demo@example.com",
      "noah.demo@example.com",
    ],
    comments: [
      {
        authorEmail: "lucas.demo@example.com",
        content: "We can add will-change: transform or remove backdrop-blur on high refresh monitors.",
        daysAgo: 12,
      },
    ],
  },
  {
    title: "Add search bar to filter feedback items by keyword in real time",
    description:
      "A lightweight search input in the header that filters displayed cards by title or author name instantly without requiring a full reload.",
    category: "UI",
    status: "COMPLETED",
    authorEmail: "sophia.demo@example.com",
    daysAgo: 13,
    tags: [],
    votesFrom: [
      "admin444@example.com",
      "user1@example.com",
      "maya.demo@example.com",
      "liam.demo@example.com",
      "sophia.demo@example.com",
      "emma.demo@example.com",
    ],
    comments: [
      {
        authorEmail: "user1@example.com",
        content: "Real-time client filtering feels snappy and makes finding existing items quick.",
        daysAgo: 10,
      },
    ],
  },
  {
    title: "Custom brand accent color selector in team workspace settings",
    description:
      "Workspace owners should be able to customize the primary brand color so the public feedback portal matches company design guidelines.",
    category: "UI",
    status: "PLANNED",
    authorEmail: "lucas.demo@example.com",
    daysAgo: 12,
    tags: [],
    votesFrom: ["lucas.demo@example.com"],
    comments: [
      {
        authorEmail: "admin444@example.com",
        content: "We could store primary HSL color values in workspace settings and apply them via CSS variables.",
        daysAgo: 9,
      },
    ],
  },
  {
    title: "Markdown formatting toolbar for feedback descriptions and comments",
    description:
      "Provide simple formatting controls for bold, italics, inline code, and bullet lists inside the feedback description and comment editors.",
    category: "UI",
    status: "COMPLETED",
    authorEmail: "emma.demo@example.com",
    daysAgo: 11,
    tags: [],
    votesFrom: [
      "user1@example.com",
      "maya.demo@example.com",
      "emma.demo@example.com",
      "noah.demo@example.com",
    ],
    comments: [
      {
        authorEmail: "maya.demo@example.com",
        content: "Code block formatting makes reading error traces ten times easier.",
        daysAgo: 8,
      },
      {
        authorEmail: "sophia.demo@example.com",
        content: "Love this! The live preview tab prevents formatting mistakes.",
        daysAgo: 7,
      },
    ],
  },
  {
    title: "Pagination fails to load previous page results when filtering",
    description:
      "When switching category filters while on page two or higher, the pagination offset does not reset to zero, displaying an empty result set.",
    category: "BUG",
    status: "PLANNED",
    authorEmail: "noah.demo@example.com",
    daysAgo: 10,
    tags: ["pagination", "filtering"],
    votesFrom: [
      "user1@example.com",
      "emma.demo@example.com",
      "noah.demo@example.com",
    ],
    comments: [
      {
        authorEmail: "admin444@example.com",
        content: "Good catch. Changing query filter params should always push page=1 to the router.",
        daysAgo: 6,
      },
    ],
  },

  // Soft-deleted post 1 (author deleted)
  {
    title: "Accidental test post please delete this submission",
    description:
      "I was testing the character counter on the feedback submission form and created this entry by mistake.",
    category: "UI",
    status: "UNDER_REVIEW",
    authorEmail: "user1@example.com",
    daysAgo: 8,
    tags: [],
    isDeleted: true,
    deletedByAdmin: false,
    votesFrom: [],
    comments: [],
  },

  // Soft-deleted post 2 (admin deleted, with 1 soft-deleted comment)
  {
    title: "Discontinued legacy API integration request",
    description:
      "Please fix connection issues with the v1 XML webhook endpoint which was decommissioned last month.",
    category: "BUG",
    status: "COMPLETED",
    authorEmail: "maya.demo@example.com",
    daysAgo: 7,
    tags: [],
    isDeleted: true,
    deletedByAdmin: true,
    votesFrom: ["maya.demo@example.com"],
    comments: [
      {
        authorEmail: "admin444@example.com",
        content: "Notice: The v1 XML webhook API has been retired in favor of the v2 REST webhook standard.",
        daysAgo: 5,
        isDeleted: true,
        deletedByAdmin: true,
      },
    ],
  },

  // AI-flagged post 1 (Spam)
  {
    title: "Earn $5000 weekly working from home on crypto task platform",
    description:
      "Sign up today at our high yield investment platform and earn guaranteed passive income every week with zero risk. Visit instant-crypto-yield-hub.fake to get started.",
    category: "FEATURE",
    status: "UNDER_REVIEW",
    authorEmail: "liam.demo@example.com",
    daysAgo: 5,
    tags: [],
    aiFlagged: true,
    aiFlagReason:
      "Promotional spam / cryptocurrency solicitation unrelated to software feedback.",
    votesFrom: [],
    comments: [],
  },

  // AI-flagged post 2 (Spam)
  {
    title: "Cheap backlinks and automated SEO ranking packages",
    description:
      "Boost your website authority and search engine ranking fast with our guaranteed bulk backlink generation service. Reach out on Telegram for discount packages.",
    category: "FEATURE",
    status: "IN_PROGRESS",
    authorEmail: "sophia.demo@example.com",
    daysAgo: 4,
    tags: [],
    aiFlagged: true,
    aiFlagReason:
      "Automated marketing advertisement and commercial link spam solicitation.",
    votesFrom: [],
    comments: [],
  },
];

async function main() {
  console.log("Starting seed process...");

  // Handle --reset flag: Delete ONLY demo users (which cascades to their profiles, posts, comments, votes)
  if (hasReset) {
    console.log("Flag --reset detected. Fetching existing demo accounts to remove...");
    const { data: usersData, error: listErr } = await supabase.auth.admin.listUsers({
      perPage: 1000,
    });
    if (listErr) {
      console.error("Failed to list users:", listErr.message);
      process.exit(1);
    }

    const demoUsersToDelete = usersData.users.filter((u) =>
      u.email ? DEMO_EMAILS.has(u.email.toLowerCase()) : false
    );

    console.log(`Found ${demoUsersToDelete.length} demo accounts to clean up.`);
    for (const u of demoUsersToDelete) {
      const { error: delErr } = await supabase.auth.admin.deleteUser(u.id);
      if (delErr) {
        console.error(`Failed to delete demo user ${u.email}:`, delErr.message);
      } else {
        console.log(`Deleted demo user: ${u.email}`);
      }
    }
    console.log("Reset cleanup completed.\n");
  }

  // 1. Ensure all 8 demo accounts exist and profiles are synced
  const userMap = new Map<string, string>(); // email -> auth user id
  console.log("Syncing demo user accounts and profiles...");

  const { data: currentUsers, error: fetchErr } = await supabase.auth.admin.listUsers({
    perPage: 1000,
  });
  if (fetchErr) {
    console.error("Failed to fetch users:", fetchErr.message);
    process.exit(1);
  }

  const existingByEmail = new Map<string, string>();
  for (const u of currentUsers.users) {
    if (u.email) {
      existingByEmail.set(u.email.toLowerCase(), u.id);
    }
  }

  for (const acc of DEMO_ACCOUNTS) {
    const emailLower = acc.email.toLowerCase();
    const existingId = existingByEmail.get(emailLower);
    const passwordToUse = acc.password || crypto.randomBytes(16).toString("hex") + "A1!";

    let userId = existingId;
    if (existingId) {
      // Account exists: update password and metadata
      const { error: updateErr } = await supabase.auth.admin.updateUserById(existingId, {
        password: passwordToUse,
        user_metadata: { full_name: acc.fullName },
      });
      if (updateErr) {
        console.warn(`Warning updating user ${acc.email}:`, updateErr.message);
      }
    } else {
      // Create user
      const { data: createData, error: createErr } = await supabase.auth.admin.createUser({
        email: acc.email,
        password: passwordToUse,
        email_confirm: true,
        user_metadata: { full_name: acc.fullName },
      });
      if (createErr || !createData.user) {
        console.error(`Failed to create user ${acc.email}:`, createErr?.message);
        process.exit(1);
      }
      userId = createData.user.id;
    }

    if (!userId) {
      console.error(`User ID missing for ${acc.email}`);
      process.exit(1);
    }

    userMap.set(emailLower, userId);

    // Upsert profile row
    const { error: profileErr } = await supabase.from("profile").upsert({
      id: userId,
      full_name: acc.fullName,
      role: acc.role,
      avatar_url: null,
    });
    if (profileErr) {
      console.error(`Failed to upsert profile for ${acc.email}:`, profileErr.message);
      process.exit(1);
    }
  }

  console.log("All 8 demo accounts verified and profiles updated.\n");

  // 2. Fetch existing posts to maintain idempotency without duplicates
  const { data: existingFeedbackRows, error: fbFetchErr } = await supabase
    .from("feedback")
    .select("id, title, user_id");
  if (fbFetchErr) {
    console.error("Failed to read existing feedback:", fbFetchErr.message);
    process.exit(1);
  }

  const existingPostMap = new Map<string, string>(); // title -> feedback id
  for (const row of existingFeedbackRows ?? []) {
    existingPostMap.set(row.title, row.id);
  }

  console.log("Seeding feedback items, comments, and votes...");
  let postsInserted = 0;
  let commentsInserted = 0;
  let votesInserted = 0;

  for (const postDef of POSTS) {
    const authorId = userMap.get(postDef.authorEmail.toLowerCase());
    if (!authorId) {
      console.error(`Author ID not found for email: ${postDef.authorEmail}`);
      continue;
    }

    let feedbackId = existingPostMap.get(postDef.title);

    if (!feedbackId) {
      const created_at = pastDate(postDef.daysAgo, 2);
      const is_deleted = Boolean(postDef.isDeleted);
      const deleted_by_admin = Boolean(postDef.deletedByAdmin);
      const deleted_at = is_deleted ? pastDate(postDef.daysAgo - 2, 1) : null;

      const { data: newPost, error: postErr } = await supabase
        .from("feedback")
        .insert({
          user_id: authorId,
          title: postDef.title,
          description: postDef.description,
          category: postDef.category,
          status: postDef.status,
          tags: postDef.tags || [],
          ai_flagged: Boolean(postDef.aiFlagged),
          ai_flag_reason: postDef.aiFlagReason || null,
          is_deleted,
          deleted_by_admin,
          deleted_at,
          created_at,
        })
        .select("id")
        .single();

      if (postErr || !newPost) {
        console.error(`Failed to insert post "${postDef.title}":`, postErr?.message);
        continue;
      }
      feedbackId = newPost.id as string;
      existingPostMap.set(postDef.title, feedbackId);
      postsInserted++;
    }

    if (!feedbackId) {
      continue;
    }

    // Insert comments (check idempotency)
    for (const c of postDef.comments) {
      const cAuthorId = userMap.get(c.authorEmail.toLowerCase());
      if (!cAuthorId) continue;

      const { data: existingComment } = await supabase
        .from("comment")
        .select("id")
        .eq("feedback_id", feedbackId)
        .eq("user_id", cAuthorId)
        .eq("content", c.content)
        .maybeSingle();

      if (!existingComment) {
        const is_deleted = Boolean(c.isDeleted);
        const deleted_by_admin = Boolean(c.deletedByAdmin);
        const deleted_at = is_deleted ? pastDate(c.daysAgo - 1) : null;

        const { error: cErr } = await supabase.from("comment").insert({
          feedback_id: feedbackId,
          user_id: cAuthorId,
          content: c.content,
          is_deleted,
          deleted_by_admin,
          deleted_at,
          created_at: pastDate(c.daysAgo),
        });
        if (cErr) {
          console.warn(`Warning inserting comment for post "${postDef.title}":`, cErr.message);
        } else {
          commentsInserted++;
        }
      }
    }

    // Insert votes (check idempotency)
    for (const voterEmail of postDef.votesFrom) {
      const voterId = userMap.get(voterEmail.toLowerCase());
      if (!voterId) continue;

      const { error: vErr } = await supabase.from("vote").upsert(
        {
          feedback_id: feedbackId,
          user_id: voterId,
          created_at: pastDate(postDef.daysAgo, 5),
        },
        { onConflict: "feedback_id,user_id" }
      );
      if (!vErr) {
        votesInserted++;
      }
    }
  }

  console.log("\n--- Seed Execution Summary ---");
  console.log(`Feedbacks processed: ${POSTS.length} (Newly inserted: ${postsInserted})`);
  console.log(`Comments newly added: ${commentsInserted}`);
  console.log(`Votes synced: ${votesInserted}`);
  console.log("------------------------------\n");
  console.log("Next: log in as the demo admin and open /api/admin/embed-existing so embeddings are created.");
}

main().catch((err) => {
  console.error("Unhandled error in seed script:", err);
  process.exit(1);
});
