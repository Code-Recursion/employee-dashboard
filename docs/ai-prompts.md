# folder structure

init latest next app with tailwind and ts, don't create new root dir use existing root folder

# folder structure

for this next app, suggest me a minimal but scalable folder structure for a small full stack app, I require services, constant, utils, asset, postgres / supabase sql schema, model. I will use shadcn component for ui.

for an employee management system.

Requirements:

Managing Employees -

Add, View, update, and delete employees via UI

The employee must have a full name, job title, country, salary, along with any other meaningful data that you believe should be captured

Salary Insights via UI -

Minimum, maximum, average salary of employees in a country

Average salary for the given Job Title in a country.

Any other meaningful metrics you believe are helpful for the user persona.

---

initiate shadcn ui, components such as modal/dialog, button, input, badge, filter, list/table, toast etc

---

suggest db schema architecture de iska with indexing

- discuss tradeoffs of realtime insignt calculation vs separate schema + caching, for separation of concern.

Managing Employees - Add, View, update, and delete employees via UI The employee must have a full name, job title, country, salary for Salary Insights via UI - Minimum, maximum, average salary of employees in a country Average salary for the given Job Title in a country.

---

create a reusable navbar component with a link to navigate

create sample pages :
/dashboard
/insignts
use simple design.

---

consider reusability and extensibility with SOLID, create search bar component , confirm and dialog, for now consider basic requirements, later will update accordingly.

write types use the this sample employee for the BE - { "id": 1, "full_name": "Wainwright Nono", "email": "wnono0@ucsd.edu", "gender": "Male", "createdAt": "2/13/2026", "updatedAt": "7/29/2025", "jobTitle": "Desktop Support Technician", "country": "Philippines", "joiningDate": "5/15/2026", "department": "Support", "employmentType": "FULL_TIME", "salary": 74634 },

on FE create parser for be response parsing and create another type for emplyee entity in types directory

use form @src/components/ui/dialog.tsx createa reusable compoent for dialog to edit and create employee entries, also do zod validation on employee form.
