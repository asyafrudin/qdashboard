var ongoingStatusChart; // Ongoing Tasks Status chart
var populationChart; // Tasks Population chart
var chartColors = []; // Global colors for tasks status
chartColors['bad'] = '#BB0000';
chartColors['good'] = '#FFCC00';
chartColors['great'] = '#009900';

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
    var selectedEmployeeGroup = $('#employee-group').val(); // Get selected project type
    refreshChart(selectedEmployeeGroup);

    // Submit event handler for filter
    $('#chart-filter form').submit(function(e) {
        e.preventDefault();
        selectedEmployeeGroup = $('#employee-group').val();
        refreshChart(selectedEmployeeGroup);
    });

    // Function to load or refresh charts
    function refreshChart(employeeGroup) {
        $.getJSON(baseUrl + 'index.php/employee/get_ongoing_tasks_status/' + employeeGroup, function(json) {
            if (json.length == 0) {
                alert('No tasks available!');
                return false;
            }
            var tasksData = [];
            var taskColors = []; // Status colors for each project
            $.each(json, function(key, value) {
                tasksData.push({
                    name: value[0],
                    y: value[1],
                    myID: value[2]
                });
                if (value[1] >= 0.5) { // On Track tasks
                    taskColors.push(chartColors['great']);
                } else if (value[1] >= 0) { // Delayed tasks
                    taskColors.push(chartColors['good']);
                } else { // Overdue tasks
                    taskColors.push(chartColors['bad']);
                }
            });

            // Set default chart height to fit the viewport
            $('.chartcontainer').height($(window).height() - $('#ongoingstatus').offset().top - 10);

            // Set height for charts (Uses default height)
            $('#ongoingstatus').height(json.length * 20 > $('.chartcontainer').height() ? json.length * 20 : $('.chartcontainer').height());
            $('#population').height(json.length * 20 > $('.chartcontainer').height() ? json.length * 20 : $('.chartcontainer').height());

            // Load ongoingStatusChart
            ongoingStatusChart = new Highcharts.Chart({
                chart: {
                    renderTo: 'ongoingstatus',
                    type: 'bar'
                },
                title: {
                    text: 'Work/Time Score of Ongoing Tasks'
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
                        colors: taskColors,
                        dataLabels: {
                            enabled: true,
                            allowOverlap: true
                        },
                        cursor: 'pointer', // Added click handler for each bar/column in series
                        point: {
                            events: {
                                click: function() {
                                    window.open(qdpmUrl + 'index.php/tasks?filter_by[TasksAssignedTo]=' + this.myID, '_blank');
                                }
                            }
                        }
                    }
                },
                tooltip: {
                    useHTML: true,
                    formatter: function() { // Added link to open task information
                        return '<a href="' + qdpmUrl + 'index.php/tasks?filter_by[TasksAssignedTo]=' + this.point.myID + '" target="_blank">' +
                            '<b>' + this.point.name + '</b> ' +                             
                            '<span class="glyphicon glyphicon-new-window" aria-hidden="true"></span></a><br/>' +
                            'Work/Time Score: ' + this.point.y;
                    }
                },
                series: [{
                    name: 'Ongoing Tasks Status',
                    data: tasksData
                }],
            });

            $.getJSON(baseUrl + 'index.php/employee/get_tasks_population/' + employeeGroup, function(json) {
                if (json.length == 0) {
                    alert('No tasks available!');
                    return false;
                }
                // Get employee names and IDs
                var populationCategories = $.unique(json.map(function(value,index) { return value['user_name']; }));
                var populationID = $.unique(json.map(function(value,index) { return value['user_id']; }));

                // Set progress limit for tasks grouping
                var lowerProgressLimit = 30;
                var upperProgressLimit = 75;
                var badTasks = []; // Tasks with progress lower than lowerProgressLimit
                $.each(populationCategories, function(key, value) {
                    // Initialize badTasks
                    badTasks.push({
                        myName: populationCategories[key],
                        y: 0,
                        myID: populationID[key]
                    });
                });
                var goodTasks = []; // Tasks with progress between lowerProgressLimit and upperProgressLimit
                $.each(populationCategories, function(key, value) {
                    // Initialize goodTasks
                    goodTasks.push({
                        myName: populationCategories[key],
                        y: 0,
                        myID: populationID[key]
                    });
                });
                var greatTasks = []; // Tasks with progress higher than upperProgressLimit
                $.each(populationCategories, function(key, value) {
                    // Initialize greatTasks
                    greatTasks.push({
                        myName: populationCategories[key],
                        y: 0,
                        myID: populationID[key]
                    });
                });

                // Group tasks based on their progress
                $.each(json, function(key, value) {
                    if (value['task_progress'] < lowerProgressLimit) {
                        badTasks[populationCategories.indexOf(value['user_name'])]['y']++;
                    } else if (value['task_progress'] >= lowerProgressLimit && value['task_progress'] < upperProgressLimit) {
                        goodTasks[populationCategories.indexOf(value['user_name'])]['y']++;
                    } else {
                        greatTasks[populationCategories.indexOf(value['user_name'])]['y']++;
                    }
                });

                console.log(badTasks);
                console.log(goodTasks);
                console.log(greatTasks);

                // Load populationChart
                populationChart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'population',
                        type: 'bar'
                    },
                    title: {
                        text: 'Number of Tasks by Progress'
                    },
                    xAxis: {
                        categories: populationCategories
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Tasks'
                        },
                        stackLabels: {
                            enabled: true
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            stacking: 'normal',
                            cursor: 'pointer', // Added click handler for each bar/column in series
                            point: {
                                events: {
                                    click: function() {
                                        window.open(qdpmUrl + 'index.php/tasks?filter_by[TasksAssignedTo]=' + this.myID, '_blank');
                                    }
                                }
                            }
                        }
                    },
                    tooltip: {
                        useHTML: true,
                        formatter: function() { // Added link to open task information
                            return '<a href="' + qdpmUrl + 'index.php/tasks?filter_by[TasksAssignedTo]=' + this.point.myID + '" target="_blank">' +
                                '<b>' + this.point.myName + '</b> ' +                             
                                '<span class="glyphicon glyphicon-new-window" aria-hidden="true"></span></a><br/>' +
                                '<b>' + this.series.name + ':</b> ' + this.point.y;
                        }
                    },
                    series: [{
                        name: 'P >= ' + upperProgressLimit + '%',
                        data: greatTasks,
                        color: chartColors['great']
                    }, {
                        name: 'P >= ' + lowerProgressLimit + '% & P < ' + upperProgressLimit + '%',
                        data: goodTasks,
                        color: chartColors['good']
                    }, {
                        name: 'P < ' + lowerProgressLimit + '%',
                        data: badTasks,
                        color: chartColors['bad']
                    }]
                });
            });
        });
    }
});
