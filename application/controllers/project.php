<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Project extends CI_Controller
{
    public function index()
    {
        $this->load->model('project_model');
        $project_types = $this->project_model->get_project_types();

        $content_data['project_types'] = $project_types;
        $header_data['page_title'] = 'Projects';
        $header_data['page_script'] = 'dashboard.project.js';
        $header_data['qdpm_url'] = $this->config->item('qdpm_url');

        $this->load->view('global_header', $header_data);
        $this->load->view('project_view', $content_data);
    }

    public function get_ongoing_status($project_type, $project_year)
    {
        $this->load->model('project_model');
        $ongoing_status = $this->project_model->get_ongoing_status($project_type, $project_year);

        echo json_encode($ongoing_status, JSON_NUMERIC_CHECK);
    }

    public function get_population($project_type, $project_year)
    {
        $this->load->model('project_model');
        $population = $this->project_model->get_population($project_type, $project_year);

        echo json_encode($population, JSON_NUMERIC_CHECK);
    }
}
