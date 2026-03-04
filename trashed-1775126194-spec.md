# Student Success AI – Smart Career & Study Assistant

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Student input form: branch (CS, IT, Civil, Mechanical, etc.), year (1st–4th), known skills, career interests
- Personalized skill roadmap generation based on inputs
- Internship domain suggestions
- Project ideas list tailored to branch and interests
- Simple study plan output
- Resume improvement tips
- Attendance Risk Predictor: input total classes, attended classes, remaining classes → calculate current %, risk level, classes needed for 75%
- Clean modern dashboard UI with multiple sections/tabs
- Results stored per session in backend

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend (Motoko):
   - Store student profiles: branch, year, skills, interests
   - Store generated roadmap/suggestions per student session
   - Attendance calculator logic (pure math)
   - CRUD for student data

2. Frontend (React + Tailwind):
   - Landing page with clear value proposition
   - Multi-step form: branch, year, skills, interests
   - Results dashboard with tabs: Skill Roadmap, Internships, Projects, Study Plan, Resume Tips
   - Attendance Risk Calculator section with live calculation
   - Responsive, modern dark-themed UI
