# qdashboard
Visual Dashboard for qdPM

This is a visual dashboard created for qdPM. It contains charts showing status of projects and tasks in qdPM to complement existing dashboard already provided by qdPM. The charts are created using Highcharts with data supplied from qdPM database.

## Setup
Follow these steps to setup qdashboard:

1. Install qdPM.
2. Modify CodeIgniter's **database.php** config file in **application/config/** to suit your qdPM database configuration.
3. Change the 'qdpm_url' config item in **application/config/qdpm_dashboard.php** to suit your qdPM URL configuration.
4. Off you go!

## Frameworks & Libraries
Frameworks and libraries used for development:

* qdPM (of course) 8.3
* Highcharts 5.0.6
* jQuery 1.11.2
* CodeIgniter 2.2.2

## Screenshots
**Project Dashboard**: shows (left chart) the work/time progress of ongoing tasks per project and (right chart) the amount of projects per project type.

![Projects](/backup/screenshot-projects.png?raw=true "Project Dashboard")

**Employee Dashboard**: shows (left chart) the work/time progress of ongoing tasks per employee and (right chart) the amount of ongoing tasks per employee separated by progress.

![Employees](/backup/screenshot-employees.png?raw=true "Employee Dashboard")
