    <div class="container-fluid">
       <div class="row">
            <div id="chart-filter" class="col-md-12">
                <form class="form-inline">
                    <div class="form-group">
                        <label>Group</label>
                        <select class="form-control input-sm" id="employee-group">
                        <?php foreach ($employee_groups as $employee_group) {
                            echo '<option value="'.$employee_group['id'].'">'.$employee_group['name'].'</option>';
                        }?>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-default btn-sm">Set Filter</button>
                </form>
            </div>
        </div>
        <div class="row spacer"></div>
        <div class="row">
            <div class="col-md-6 chartcontainer" style="overflow-y:auto;">
                <div id="ongoingstatus"></div>
            </div>
            <div class="col-md-6 chartcontainer" style="overflow-y:auto;">
                <div id="population"></div>
            </div>
        </div>
    </div>
</body>
</html>