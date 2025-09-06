# Simple HRMS Dashboard

A client-side HRMS (Human Resource Management System) dashboard built with vanilla JavaScript, HTML, and Tailwind CSS. All data is stored locally in your browser using `localStorage`.

## Features

- **Client-Side CRUD:** Manage employees, departments, attendance, leaves, and payroll.
- **Role-Based Access:** Simple 'Admin' and 'Viewer' roles.
- Internationalization (English/Arabic) with RTL support.
- **Data Export:** Export data tables to CSV.
- **Audit Trail:** Tracks all actions performed within the application.

## Tech Stack

- HTML5
- Vanilla JavaScript (ES6+)
- TailwindCSS
- No framework, no build step required.

## Getting Started

There are no prerequisites. Simply open the `index.html` or `login.html` file in your web browser.

The default PINs are:
- **Admin:** `0000`
- **Viewer:** `1111`

## Security Notes

This is a demo application and is **not secure for production use**. All data, including access PINs, is stored in `localStorage`. The role-based access control is implemented only on the client side and can be easily bypassed using browser developer tools.

## Deployment

This project can be deployed on any static web hosting service, such as GitHub Pages.

## Contributing

Pull requests are welcome.

## License

MIT
