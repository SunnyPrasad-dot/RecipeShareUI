# Recipe Sharing Platform - Design Guidelines

## Design Approach

**Reference-Based Design** inspired by modern food platforms (Tasty, Yummly, Pinterest food boards) with emphasis on visual storytelling and community engagement.

## Typography System

**Primary Font**: Inter or DM Sans (Google Fonts) - clean, modern readability
**Accent Font**: Playfair Display or Merriweather for recipe titles - adds sophistication

**Hierarchy**:
- Recipe titles: 3xl-4xl, accent font, bold
- Section headers: 2xl-3xl, primary font, semibold
- Body text: base-lg, primary font, normal
- Metadata (time, servings): sm, medium, uppercase tracking
- Ingredients/instructions: base, primary font, relaxed line-height for readability

## Layout System

**Spacing Units**: Tailwind units of 2, 4, 6, 8, 12, 16, 24 (p-4, m-8, gap-6, etc.)
**Container Max-widths**: 
- Content sections: max-w-7xl
- Recipe detail: max-w-4xl
- Text-heavy content: max-w-3xl

**Grid Systems**:
- Recipe cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Ingredient/instruction split: grid-cols-1 lg:grid-cols-2
- Meal planner: grid-cols-7 for weekly view

## Core Components

### Navigation
- Sticky header with logo, search bar (prominent), user menu, and "Create Recipe" CTA button
- Bottom padding p-4, subtle shadow for depth
- Mobile: Collapsible menu with search as priority

### Recipe Cards (Browse View)
- Aspect ratio 4:3 for food images
- Image overlay gradient for text readability
- Card structure: Image → Title → Author avatar/name → Quick stats (time, servings, rating stars) → Tags
- Rounded corners (rounded-lg), subtle shadow on hover
- Bookmark icon positioned top-right on image

### Recipe Detail Page
- Hero image: Full-width, h-96, with recipe title overlaid (bottom-left, large, white text with text-shadow)
- Two-column layout below hero: Left (ingredients, sticky), Right (step-by-step instructions)
- Metadata bar below image: Author, rating, time, servings, tags - horizontally arranged with icons
- Comments section: Full-width below recipe content
- Floating "Add to Meal Plan" button (bottom-right, rounded-full, shadow-lg)

### Recipe Creation Form
- Multi-step wizard approach: Basic Info → Ingredients → Instructions → Media → Tags
- Progress indicator at top
- Rich text editor for instructions with formatting toolbar
- Drag-and-drop image upload with preview
- Dynamic ingredient input: Add/remove ingredient fields
- Tag selection: Multi-select chips

### Meal Planner
- Weekly calendar grid (7 columns for days)
- Each day cell: Drop zone for recipes, displays recipe card thumbnails
- Drag-and-drop from saved recipes sidebar
- Mobile: Vertical scrolling list by day

### User Profile
- Header section: Avatar, name, bio, follower count, recipe count
- Tabbed content: "My Recipes" | "Favorites" | "Meal Plans"
- Same recipe card grid layout for each tab

### Community Features
- Comments: Thread-style with avatars, timestamps, nested replies (indent)
- Rating widget: Star display (filled/outlined), click to rate
- User hover cards: Quick preview on avatar hover showing stats

## Component Library

**Buttons**:
- Primary CTA: Larger padding (px-6 py-3), rounded-lg, font-medium
- Secondary: Outlined variant, same sizing
- Icon buttons: rounded-full, p-2

**Forms**:
- Input fields: rounded-lg, p-3, focus ring
- Labels: text-sm, font-medium, mb-2
- Textareas: min-h-32 for instructions

**Cards**:
- Recipe cards: overflow-hidden, rounded-xl, shadow-md
- Info cards (analytics): p-6, rounded-lg, border

**Badges/Tags**:
- Rounded-full, px-3 py-1, text-xs, uppercase, font-medium
- Clickable tags for filtering

**Modals/Overlays**:
- Share modal: Centered, max-w-md, rounded-xl, p-6
- Image lightbox: Full-screen overlay, backdrop blur

## Images

**Hero Image**: Full-width hero on homepage (h-[70vh]) featuring appetizing food photography - multiple dishes arranged beautifully with recipe platform branding overlay. Text overlaid with blurred background buttons.

**Recipe Images**: High-quality food photography throughout:
- Homepage: Grid of featured recipes (12-16 cards) with vibrant food images
- Recipe detail: Primary dish photo as hero
- Recipe cards: Thumbnail images (always include)
- User profiles: Avatar photos
- Meal planner: Small recipe thumbnails

**Placeholder Strategy**: Use food-themed placeholder images (vegetables, kitchen scenes) via Unsplash API for development

## Page Layouts

### Homepage
- Hero section (70vh): Search bar centered, tagline, "Explore Recipes" CTA
- Featured recipes grid (4 columns desktop)
- Category sections: "Popular This Week", "Quick Meals", "Trending Tags"
- Community highlights: Top contributors with avatar grid
- Footer: Newsletter signup, quick links, social media

### Browse/Search Results
- Filter sidebar (left): Tags, categories, cooking time, difficulty
- Main content (right): Recipe grid with sort options (Popular, Recent, Top Rated)
- Infinite scroll or pagination

### Recipe Detail
- Structured as described in Core Components
- Related recipes carousel at bottom

### Dashboard (User Analytics)
- Stats cards: Views, Likes, Comments, Followers (4-column grid)
- Charts: Recipe performance over time
- Recent activity feed

## Interactions & States

- Hover states: Slight scale transform (scale-105) on recipe cards
- Loading states: Skeleton screens for recipe cards
- Empty states: Friendly illustrations with encouraging messages
- Error states: Clear messaging with retry actions
- Toast notifications: Top-right, slide-in animation for actions (saved, deleted, etc.)

## Accessibility

- ARIA labels for all interactive elements
- Keyboard navigation support (tab order, focus indicators)
- Alt text for all food images
- Sufficient contrast ratios (maintain WCAG AA minimum)
- Form validation with clear error messages