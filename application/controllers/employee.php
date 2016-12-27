<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Employee extends CI_Controller
{
    public function index()
    {
        $this->load->model('employee_model');
        $employee_groups = $this->employee_model->get_employee_groups();

        $content_data['employee_groups'] = $employee_groups;
        $header_data['page_title'] = 'Employees';
        $header_data['page_script'] = 'dashboard.employee.js';
        $header_data['qdpm_url'] = $this->config->item('qdpm_url');

        $this->load->view('global_header', $header_data);
        $this->load->view('employee_view', $content_data);
    }

    public function get_ongoing_tasks_status($employee_group)
    {
        $this->load->model('employee_model');
        $get_ongoing_tasks_status = $this->employee_model->get_ongoing_tasks_status($employee_group);

        echo json_encode($get_ongoing_tasks_status, JSON_NUMERIC_CHECK);
    }

    public function get_tasks_population($employee_group)
    {
        $this->load->model('employee_model');
        $tasks_population = $this->employee_model->get_tasks_population($employee_group);

        echo json_encode($tasks_population, JSON_NUMERIC_CHECK);
    }
}
