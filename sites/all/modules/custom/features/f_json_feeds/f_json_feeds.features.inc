<?php
/**
 * @file
 * f_json_feeds.features.inc
 */

/**
 * Implements hook_ctools_plugin_api().
 */
function f_json_feeds_ctools_plugin_api() {
  list($module, $api) = func_get_args();
  if ($module == "services" && $api == "services") {
    return array("version" => "3");
  }
}

/**
 * Implements hook_views_api().
 */
function f_json_feeds_views_api() {
  return array("api" => "3.0");
}
