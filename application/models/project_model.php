<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Project_model extends CI_Model
{
    function __construct()
    {
        parent::__construct();
    }

    function get_ongoing_status($project_type, $project_year)
    {
        $this->load->database();

        // Set project type
        $project_type_filter = '';
        if ($project_type > 0)
        {
            $project_type_filter = ' and p.projects_types_id = '.$this->db->escape($project_type);
        }

        // Set project year
        $project_year_filter = '';
        if ($project_year > 0)
        {
            $project_year_filter = ' having year(max(t.due_date)) = '.$this->db->escape($project_year);
        }

        $query = $this->db->query(
            'select p.id, p.name, ifnull(ceiling(sum(t.progress) / count(t.id)), 0) as work_progress, 
                ifnull(ceiling((current_date - min(t.start_date)) / (max(t.due_date) - min(t.start_date)) * 100), 0) as time_progress 
            from tasks t right join projects p on t.projects_id = p.id 
            where p.projects_status_id = 1 and t.tasks_status_id = 1'.$project_type_filter.
            ' group by p.id'.
            $project_year_filter.
            ' order by p.name'
            );
        $result = $query->result_array();

        $i = 0;
        $preprocessed = [];
        foreach ($result as $value)
        {
            $preprocessed[$i][0] = $value['name']; // Project name

            // Project status
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

            $preprocessed[$i][2] = $value['id']; // Project ID

            $i++;
        }

        // Sorts by work/time value (descending)
        usort($preprocessed, function($a, $b) {
            if ($a[1] < $b[1]) {
                return 1;
            } else if ($a[1] > $b[1]) {
                return -1;
            } else {
                return 0;
            }
        });

        return $preprocessed;
    }

    function get_population($project_type, $project_year)
    {
        $this->load->database();

        // Set project type
        $project_type_filter = '';
        if ($project_type > 0)
        {
            $project_type_filter = ' where p.projects_types_id = '.$this->db->escape($project_type);
        }

        // Set project year
        $project_year_filter = '';
        if ($project_year > 0)
        {
            $project_year_filter = ' where z.year = '.$this->db->escape($project_year);
        }

        $query = $this->db->query(
            'select z.id, z.name, count(z.name) as total 
            from (select s.id, s.name, p.name as project_name, coalesce(year(max(t.due_date)), year(p.created_at)) as year from projects p inner join projects_status s on p.projects_status_id = s.id left join tasks t on p.id = t.projects_id'.$project_type_filter.' group by p.id) z '.
            $project_year_filter.
            ' group by z.name'
            );
        $result = $query->result_array();

        $preprocessed = [];
        foreach ($result as $value)
        {
            $preprocessed[$value['name']]['total'] = $value['total'];
            $preprocessed[$value['name']]['id'] = $value['id'];
        }

        return $preprocessed;
    }

    function get_project_types()
    {
        $this->load->database();

        $query = $this->db->query(
            'select id, name 
            from projects_types p
            order by p.sort_order asc'
            );
        $result = $query->result_array();

        return $result;
    }
}