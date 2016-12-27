<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Employee_model extends CI_Model
{
    function __construct()
    {
        parent::__construct();
    }

    function get_ongoing_tasks_status($employee_group)
    {
        $this->load->database();

        // Set employee group
        $employee_group_filter = '';
        if ($employee_group > 0)
        {
            $employee_group_filter = ' and u.users_group_id = '.$this->db->escape($employee_group);
        }

        $query = $this->db->query(
            'select *
            from (select u.id, u.name, ifnull(ceiling(sum(t.progress) / count(t.id)), 0) as work_progress, ifnull(ceiling((current_date - min(t.start_date)) / (max(t.due_date) - min(t.start_date)) * 100), 0) as time_progress from users u, tasks t where t.tasks_status_id = 1 and find_in_set(u.id, t.assigned_to) > 0'.$employee_group_filter.' group by u.id
            union
            select u.id, u.name, 0, 0 from users u where u.id not in (select u.id from users u, tasks t where t.tasks_status_id = 1 and find_in_set(u.id, t.assigned_to) > 0'.$employee_group_filter.')'.$employee_group_filter.') users_tasks_progress 
            order by name'
            );
        $result = $query->result_array();

        $i = 0;
        $preprocessed = [];
        foreach ($result as $value)
        {
            $preprocessed[$i][0] = $value['name']; // User name

            // User tasks status
            if ($value['time_progress'] > 0) // Calculate only if there are progress in time
            {
                $numeric_status_adjustment = 0;

                if ($value['time_progress'] > 100)  // If current date is bigger than due date
                {
                    // Penalty!
                    $numeric_status_adjustment = 1;
                }

                $preprocessed[$i][1] = round(($value['work_progress'] / $value['time_progress']) - $numeric_status_adjustment, 2);
            }
            else
            {
                $preprocessed[$i][1] = 0; // No progress reported
            }

            $preprocessed[$i][2] = $value['id']; // User ID

            $i++;
        }

        return $preprocessed;
    }

    function get_tasks_population($employee_group)
    {
        $this->load->database();

        // Set employee group
        $employee_group_filter = '';
        if ($employee_group > 0)
        {
            $employee_group_filter = ' and u.users_group_id = '.$this->db->escape($employee_group);
        }

        $query = $this->db->query(
            'select *
            from (select u.id as user_id, u.name as user_name, t.id as task_id, t.name as task_name, ifnull(t.progress, 0) as task_progress from users u, tasks t where t.tasks_status_id = 1 and find_in_set(u.id, t.assigned_to) > 0'.$employee_group_filter.' 
            union select u.id, u.name, 0, "", 0 from users u where u.id not in (select u.id from users u, tasks t where t.tasks_status_id = 1 and find_in_set(u.id, t.assigned_to) > 0'.$employee_group_filter.')'.$employee_group_filter.') users_tasks
            order by user_name'
            );
        $result = $query->result_array();

        return $result;
    }

    function get_employee_groups()
    {
        $this->load->database();

        $query = $this->db->query(
            'select id, name 
            from users_groups g
            where allow_manage_users is null and allow_manage_configuration is null
            order by g.name asc'
            );
        $result = $query->result_array();

        return $result;
    }
}