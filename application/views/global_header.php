<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta name="description" content="Visual Dashboard for qdPM">
    <meta name="author" content="Amir Syafrudin">
    <link rel="icon" href="<?php echo base_url('favicon.ico') ?>">

    <title>qdPM Dashboard | <?php echo $page_title; ?></title>

    <!-- Bootstrap core CSS -->
    <?php echo link_tag('css/bootstrap.min.css') ?>

    <!-- Global styles -->
    <?php echo link_tag('css/main.css') ?>

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
        <script src="<?php echo base_url('js/html5shiv.min.js') ?>"></script>
        <script src="<?php echo base_url('js/respond.min.js') ?>"></script>
    <![endif]-->
    <script src="<?php echo base_url('js/jquery.min.js') ?>"></script>
    <script src="<?php echo base_url('js/bootstrap.min.js') ?>"></script>
    <script src="<?php echo base_url('js/highcharts.js') ?>"></script>
    <script src="<?php echo base_url('js/no-data-to-display.js') ?>"></script>
    <script src="<?php echo base_url('js/'.$page_script) ?>"></script>
    <script type="text/javascript">
        var qdpmUrl = '<?php echo $qdpm_url; ?>';
        var baseUrl = '<?php echo base_url(); ?>';
    </script>
</head>
<body>
    <nav class="navbar navbar-static-top">
        <div class="container-fluid">
            <div class="navbar-header">
                <span class="navbar-brand">qdPM Visual Dashboard</span>
            </div>
            <ul class="nav navbar-nav">
                <li<?php if ($page_title == "Projects") echo ' class="active"'; ?>>
                    <a href="<?php echo base_url()."index.php/project"; ?>" class="bs-overrides">Projects</a>
                </li>
                <li<?php if ($page_title == "Employees") echo ' class="active"'; ?>>
                    <a href="<?php echo base_url()."index.php/employee"; ?>" class="bs-overrides">Employees</a>
                </li>
            </ul>
        </div>
    </nav>