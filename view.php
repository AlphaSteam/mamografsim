<?php
// This file is part of Moodle - https://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Prints an instance of mod_mamografsim.
 *
 * @package     mod_mamografsim
 * @copyright   2020 cc5402-Mamografías
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require(__DIR__.'/../../config.php');
require_once(__DIR__.'/lib.php');


// Course_module ID, or
$id = optional_param('id', 0, PARAM_INT);

// ... module instance id.
$m  = optional_param('m', 0, PARAM_INT);

if ($id) {
    $cm             = get_coursemodule_from_id('mamografsim', $id, 0, false, MUST_EXIST);
    $course         = $DB->get_record('course', array('id' => $cm->course), '*', MUST_EXIST);
    $moduleinstance = $DB->get_record('mamografsim', array('id' => $cm->instance), '*', MUST_EXIST);
} else if ($m) {
    $moduleinstance = $DB->get_record('mamografsim', array('id' => $n), '*', MUST_EXIST);
    $course         = $DB->get_record('course', array('id' => $moduleinstance->course), '*', MUST_EXIST);
    $cm             = get_coursemodule_from_instance('mamografsim', $moduleinstance->id, $course->id, false, MUST_EXIST);
} else {
    print_error(get_string('missingidandcmid', 'mod_mamografsim'));
}

require_login($course, true, $cm);

$modulecontext = context_module::instance($cm->id);

/*$event = \mod_mamografsim\event\course_module_viewed::create(array(
    'objectid' => $moduleinstance->id,
    'context' => $modulecontext
));
$event->add_record_snapshot('course', $course);
$event->add_record_snapshot('mamografsim', $moduleinstance);
$event->trigger();
*/

$PAGE->set_url('/mod/mamografsim/view.php', array('id' => $cm->id));
$PAGE->set_title(format_string($moduleinstance->name));
$PAGE->set_heading(format_string($course->fullname));
$PAGE->set_context($modulecontext);

/*
foreach ($moduleinstance as $key=>$value){
    echo("key:" . $key . " value:" . $value . "\n");

}
unset($value);
*/
$errorvis = $moduleinstance->errorvis;
$errorkv = $moduleinstance->errorkv;
$errorma = $moduleinstance->errorma;
$errorf = $moduleinstance->errorf;
$erroralt = $moduleinstance->erroralt;

//Agregar una nueva prueba 
$compresion = $moduleinstance->compresion;
$rendimiento = $moduleinstance->rendimiento;
$imagen = $moduleinstance->imagen;

//Agregar una nueva prueba
$PAGE->requires->js_call_amd('mod_mamografsim/main','init',array(array(array('errorkv',$errorkv),array('errorma',$errorma),array('errorf',$errorf),array('erroralt',$erroralt),array('errorvis',$errorvis)),array($compresion,$rendimiento,$imagen)) );
$PAGE->requires->js_call_amd('mod_mamografsim/control-panel','init');




echo $OUTPUT->header();

// Carga css para el archivo html
// echo '<link href="styles.css" rel="stylesheet">';

readfile("interfaces.html");

/*echo
'<div style="width:950px;height:600px;padding:50px;position:relative">'.
    '<canvas id="canv" width="400" height="600" style="border:1px solid #000000;position:absolute;top:0;left:301px;"></canvas>'.
    '<canvas id="canvRes" width="300" height="300" style="border:1px solid #000000;position:absolute;top:300px;left:0;"></canvas>'.

    '<div style="position:absolute;top:0;left:700px;width:250px;height:600px;text-align:center;">'.
        '<h2 style="width:100%;">Herramientas</h2>'.
        '<div style="width:100%;height:100%;overflow-y:auto;">';
for($i = 0; $i < 6; $i++) {
    echo '<button class="herram_button" style="margin:20px;width:60%;"><img src="https://static.reol.cl/reol.png" width=64><br>Herramienta '.$i.'</button>';
}
echo '</div></div></div>';*/

echo $OUTPUT->footer();
