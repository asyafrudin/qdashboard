# qdashboard
Visual Dashboard for qdPM

This is a visual dashboard created for qdPM. It contains charts showing status of projects and tasks in qdPM to complement existing dashboard already provided by qdPM. The charts are created using Highcharts with data supplied from qdPM database.

## Setup
Follow these steps to setup qdpm-dashboard:

1. Install qdPM.
2. Add a copy of CodeIgniter's **database.php** config file to **application/config/** tailored to suit your qdPM database configuration.
3. Change the 'qdpm_url' config item in **application/config/qdpm_dashboard.php** to suit your qdPM URL configuration.
4. Off you go!

## Frameworks & Libraries
Frameworks and libraries used for development:

* qdPM (of course) 8.3
* Highcharts 4.1.5
* jQuery 1.11.2
* CodeIgniter 2.2.2
