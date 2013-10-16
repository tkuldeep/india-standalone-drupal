<?php
/**
 * @file
 * f_tags_cloud.features.inc
 */

/**
 * Implements hook_ctools_plugin_api().
 */
function f_tags_cloud_ctools_plugin_api() {
  list($module, $api) = func_get_args();
  if ($module == "page_manager" && $api == "pages_default") {
    return array("version" => "1");
  }
}
