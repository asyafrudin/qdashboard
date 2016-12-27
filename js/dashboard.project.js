var ongoingStatusChart; // Status of Ongoing Projects chart
var populationChart; // Project Population chart
var chartColors = []; // Global colors for project status
chartColors['overdue'] = '#BB0000';
chartColors['delayed'] = '#FFCC00';
chartColors['ontrack'] = '#009900';
chartColors['onhold'] = '#888888';
chartColors['cancelled'] = '#444444';

$(document).ready(function() {    
    // Set chart options
    Highcharts.setOptions({
        legend: {
            itemHoverStyle: {
                cursor: 'default'
            }
        },
        plotOptions: {
            series: {
                events: {
                    legendItemClick: function() {
                        return false; // Disable clicking on chart legends
                    }
                }
            }
        }
    });

    // Load chart for the first time
    var selectedProjectType = $('#project-type').val(); // Get selected project type
    refreshChart(selectedProjectType);

    // Submit event handler for filter
    $('#chart-filter form').submit(function(e) {
        e.preventDefault();
        selectedProjectType = $('#project-type').val();
        refreshChart(selectedProjectType);
    });

    // Function to load or refresh charts
    function refreshChart(projectType) {
        var ontrackProject = 0; // Number of On Track projects
        var delayedProject = 0; // Number of Delayed projects
        var overdueProject = 0; // Number of Overdue projects

        $.getJSON(baseUrl + 'index.php/project/get_ongoing_status/' + projectType, function(json) {
            if (json.length == 0) {
                alert('No projects available!');
                return false;
            }
            var projectData = [];
            var projectColors = []; // Status colors for each project
            $.each(json, function(key, value) {
                projectData.push({
                    name: value[0],
                    y: value[1],
                    myID: value[2]
                });
                if (value[1] >= 0.5) { // On Track projects
                    projectColors.push(chartColors['ontrack']);
                    ontrackProject++;
                } else if (value[1] >= 0) { // Delayed projects
                    projectColors.push(chartColors['delayed']);
                    delayedProject++;
                } else { // Overdue projects
                    projectColors.push(chartColors['overdue']);
                    overdueProject++;
                }
            });

            // Set default chart height to fit the viewport
            $('.chartcontainer').height($(window).height() - $('#ongoingstatus').offset().top - 10);

            // Set height for ongoingStatusChart (Uses default height)
            $('#ongoingstatus').height(json.length * 20 > $('.chartcontainer').height() ? json.length * 20 : $('.chartcontainer').height());

            // Load ongoingStatusChart
            ongoingStatusChart = new Highcharts.Chart({
                chart: {
                    renderTo: 'ongoingstatus',
                    type: 'bar'
                },
                title: {
                    text: 'Work/Time Score of Ongoing Projects'
                },
                legend: {
                    enabled: false
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    title: {
                        text: 'Work/Time Score'
                    },
                    tickInterval: 0.5
                },
                plotOptions: {
                    series: {
                        colorByPoint: true,
                        colors: projectColors,
                        dataLabels: {
                            enabled: true,
                            allowOverlap: true
                        },
                        cursor: 'pointer', // Added click handler for each bar/column in series
                        point: {
                            events: {
                                click: function() {
                                    window.open(qdpmUrl + 'index.php/tasks?projects_id=' + this.myID, '_blank');
                                }
                            }
                        }
                    }
                },
                tooltip: {
                    useHTML: true,
                    formatter: function() { // Added link to open project information
                        return '<a href="' + qdpmUrl + 'index.php/tasks?projects_id=' + this.point.myID + '" target="_blank">' +
                            '<b>' + this.point.name + '</b> ' +                             
                            '<span class="glyphicon glyphicon-new-window" aria-hidden="true"></span></a><br/>' +
                            'Work/Time Score: ' + this.point.y;
                    }
                },
                series: [{
                    name: 'Ongoing Project Status',
                    data: projectData
                }],
            });

            $.getJSON(baseUrl + 'index.php/project/get_population/' + projectType, function(json) {
                var closedProject = 
                    (typeof json['Closed'] != "undefined") ? json['Closed']['total'] : 0; // Number of closed projects
                var closedProjectStatusID = 
                    (typeof json['Closed'] != "undefined") ? json['Closed']['id'] : 0; // ID of closed projects
                var onholdProject = 
                    (typeof json['On Hold'] != "undefined") ? json['On Hold']['total'] : 0; // Number of on hold projects
                var onholdProjectStatusID = 
                    (typeof json['On Hold'] != "undefined") ? json['On Hold']['id'] : 0; // ID of on hold projects
                var cancelledProject = 
                    (typeof json['Cancelled'] != "undefined") ? json['Cancelled']['total'] : 0; // Number of cancelled projects
                var cancelledProjectStatusID = 
                    (typeof json['Cancelled'] != "undefined") ? json['Cancelled']['id'] : 0; // ID of cancelled projects
                var maxProject = 
                    Math.ceil(Math.max(ontrackProject + delayedProject + overdueProject + onholdProject, 
                                        closedProject + cancelledProject) / 10) * 10 + 5;
                    // The "+ 5" above was simply to prevent stackLabels from being hidden when maxProject is a multiple of 10

                var populationCategories = ['Projects'];

                // Load populationChart (Must be loaded after ongoingStatusChart)
                populationChart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'population',
                        type: 'column'
                    },
                    title: {
                        text: 'Number of Projects by Status'
                    },
                    legend: {
                        itemWidth: 85,
                        reversed: true
                    },
                    xAxis: [{
                        categories: populationCategories
                    }, { // mirror axis on right side
                        opposite: true,
                        categories: populationCategories,
                        linkedTo: 0
                    }],
                    yAxis: {
                        title: {
                            text: null
                        },                    
                        labels: {
                            formatter: function() {
                                return Math.abs(this.value);
                            }
                        },
                        stackLabels: {
                            enabled: true,
                            formatter: function() {
                                return "Total " + ((this.total < 0) ? "Ongoing" : "Closed") + " Projects: " + Math.abs(this.total);
                            }
                        },
                        max: maxProject,
                        min: -maxProject
                    },
                    plotOptions: {
                        series: {
                            stacking: 'normal',
                            pointWidth: 80,
                            dataLabels: {
                                enabled: true,
                                formatter: function() {
                                    if (this.y == 0 ) return ''; // Don't show dataLabel if value is 0
                                    return Math.abs(this.y);
                                }
                            },
                            point: { // Added click handler for each bar/column in series
                                events: {
                                    click: function() {
                                        if (this.myStatusID > 0)
                                            window.open(qdpmUrl + 'index.php/projects?filter_by[ProjectsStatus]=' + this.myStatusID +
                                                '&filter_by[ProjectsTypes]=' + $('#project-type').val(), 
                                                '_blank');
                                    }
                                }
                            }
                        }
                    },
                    tooltip: {
                        useHTML: true,
                        formatter: function() { // Added link to open list of projects based on project status and project type
                            var tooltipText = '<b>' + this.series.name + ' ' + this.point.category + '</b>: ';
                            if (this.point.myStatusID > 0) {
                                tooltipText = '<a href="' + qdpmUrl + 'index.php/projects?filter_by[ProjectsStatus]=' + this.point.myStatusID + 
                                    '&filter_by[ProjectsTypes]=' + $('#project-type').val() +
                                    '" target="_blank">' + tooltipText +
                                    '<span class="glyphicon glyphicon-new-window" aria-hidden="true"></span></a>:';
                            }
                            tooltipText += Highcharts.numberFormat(Math.abs(this.point.y), 0);
                            return  tooltipText;
                        }
                    },
                    series: [{
                        name: 'Overdue',
                        data: [{y: -overdueProject, myStatusID: 0}],
                        color: chartColors['overdue']
                    }, {
                        name: 'Delayed',
                        data: [{y: -delayedProject, myStatusID: 0}],
                        color: chartColors['delayed']
                    }, {
                        name: 'On Track',
                        data: [{y: -ontrackProject, myStatusID: 0}],
                        color: chartColors['ontrack']
                    }, {
                        name: 'Cancelled',
                        data: [{y: cancelledProject, myStatusID: cancelledProjectStatusID}],
                        color: chartColors['cancelled'],
                        cursor: 'pointer'
                    }, {
                        name: 'On Hold',
                        data: [{y: onholdProject, myStatusID: onholdProjectStatusID}],
                        color: chartColors['onhold'],
                        cursor: 'pointer'
                    }, {
                        name: 'Closed',
                        data: [{y: closedProject, myStatusID: closedProjectStatusID}],
                        cursor: 'pointer'
                    }]
                });
            });
        });
    }
});
