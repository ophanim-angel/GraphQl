# GraphQL Profile Project

A web application that authenticates with the Zone01 Oujda GraphQL API to display personalized user data and journey statistics using custom SVG visualizations.

##  Features
* **Secure Authentication**: JWT-based login supporting both username/email.
* **Data Visualization**: Custom-built SVG graphs (no external libraries) for:
    * **XP Progression**: Cumulative growth over time.
    * **Audit Ratio**: Up/Down comparison of audit interactions.
* **User Dashboard**: Displays basic identification, total XP, and project grades.
* **Session Management**: Secure logout and persistent session via JWT.

##  Technical Stack
* **Language**: JavaScript (Vanilla)
* **API**: GraphQL
* **Graphics**: SVG (Scalable Vector Graphics)
* **Auth**: JWT & Base64 Basic Authentication
* **Hosting**: dashql.netlify.app

##  GraphQL Usage
The project implements diverse query patterns:
* **Basic**: Fetching user profile information.
* **Arguments**: Filtering `transaction` tables for specific `xp` types.
* **Nesting**: Linking `progress` and `result` tables with `object` details.

##  Setup
1. Clone the repository.
2. Open the project in a web server environment.
3. Authenticate using your Zone01 credentials.