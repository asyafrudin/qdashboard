    <div class="container-fluid">
        <div class="row">
            <div id="chart-filter" class="col-md-12">
                <form class="form-inline">
                    <div class="form-group">
                        <label>Project Types</label>
                        <select class="form-control input-sm" id="project-type">
                        <?php foreach ($project_types as $project_type) {
                            echo '<option value="'.$project_type['id'].'">'.$project_type['name'].'</option>';
                        }?>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-default btn-sm">Set Filter</button>
                </form>
            </div>
        </div>
        <div class="row spacer"></div>
        <div class="row">
            <div class="col-md-9 chartcontainer" style="overflow-y:auto;">
                <div id="ongoingstatus"></div>
            </div>
            <div class="col-md-3 chartcontainer">
                <div id="population"></div>
            </div>
        </div>
    </div>
</body>
</html>