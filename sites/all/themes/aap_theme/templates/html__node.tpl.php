<?php

define('MOBILE_SITE', 'http://m.aamaadmiparty.org');
## Uncomment the line below to redirect to site specifically for tablets
# define('TABLET_SITE', 'http://m.aamaadmiparty.org?template=tablet');
define('DA_USE_COOKIES', true);
define('DA_USE_CACHE', true);
define('COOKIE_EXPIRY_TIME', 21600);
define('DA_CACHE_DIR', sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'DeviceAtlasCache' . DIRECTORY_SEPARATOR);
define('DA_URI', 'http://detect.deviceatlas.com/query?User-Agent=%s');

$redirect = isset($_REQUEST['redirect'])?$_REQUEST['redirect']:null;

if($redirect!='false') {

  $da_results = array('_source' => 'none');

  $prevent_redirect = false;
  if (DA_USE_COOKIES && isset($_COOKIE['Mobi_Mtld_DA_Prevent_Redirect'])) {
      //Clear the redirect-prevention cookie if we see redirect=true parameter
      if($redirect == 'true') {
            setcookie('Mobi_Mtld_DA_Prevent_Redirect', 'false', time()-3600);
      }
      else {
          $prevent_redirect = isset($_COOKIE['Mobi_Mtld_DA_Prevent_Redirect']);
          if($prevent_redirect) {
              $da_results['_source'] = 'prevent_redirect';
          }
      }
  }

  if (DA_USE_COOKIES && isset($_COOKIE['Mobi_Mtld_DA_Properties'])) {

      $da_results = (array)json_decode($_COOKIE['Mobi_Mtld_DA_Properties'], true);
      $da_results['_source'] = 'cookie';

  }

  if (DA_USE_CACHE && $da_results['_source'] === 'none') {
      $da_cache_file = md5($_SERVER["HTTP_USER_AGENT"]) . '.json';

      if (!file_exists(DA_CACHE_DIR) && !@mkdir(DA_CACHE_DIR)) {
          $da_results['_error'] = "Unable to create cache directory: " . DA_CACHE_DIR . "\n";
      } else {
          $da_json = @file_get_contents(DA_CACHE_DIR . $da_cache_file);

          if ($da_json !== false) {
              $da_results = (array)json_decode($da_json, true);
              $da_results['_source'] = 'cache';

              if (DA_USE_COOKIES) {
                  setcookie('Mobi_Mtld_DA_Properties', $da_json);
              }
          }
      }
  }

  if ($da_results['_source'] === 'none') {
      $url = sprintf(DA_URI, urlencode($_SERVER["HTTP_USER_AGENT"]));

      $ch = curl_init($url);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
      curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
      $da_json = curl_exec($ch);
      curl_close($ch);

      if ($da_json !== false) {
          $da_results = array_merge(json_decode($da_json, true), $da_results);
          $da_results['_source'] = 'webservice';

          if (DA_USE_COOKIES) {
              setcookie('Mobi_Mtld_DA_Properties', $da_json);
          }

          if (DA_USE_CACHE) {
              if (@file_put_contents(DA_CACHE_DIR . $da_cache_file, $da_json) === false) {
                  $da_results['_error'] .= "Unable to write cache file " . DA_CACHE_DIR . $da_cache_file . "\n";
              }
          }
      } else {
          $da_results['_error'] .= "Error fetching DeviceAtlas data from webservice.\n";
      }
  }

  if(!$prevent_redirect) {
    if(defined('TABLET_SITE') && isset($da_results['isTablet']) && $da_results['isTablet']=='true'){
      $redirect_url = TABLET_SITE;
    }
    else if(isset($da_results['mobileDevice']) && $da_results['mobileDevice']=='true'){
      $redirect_url = MOBILE_SITE;
    }

    if(isset($redirect_url)){
      header('Location: ' . $redirect_url);
      die();
    }
  }
}
else {
  //Set a cookie so we remember not to redirect again in the future
  if (DA_USE_COOKIES && !isset($_COOKIE['Mobi_Mtld_DA_Prevent_Redirect'])) {
      setcookie('Mobi_Mtld_DA_Prevent_Redirect', "true", time() + COOKIE_EXPIRY_TIME);
  }
}
?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML+RDFa 1.0//EN"
  "http://www.w3.org/MarkUp/DTD/xhtml-rdfa-1.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php print $language->language; ?>" version="XHTML+RDFa 1.0" dir="<?php print $language->dir; ?>"<?php print $rdf_namespaces; ?>>

<head profile="<?php print $grddl_profile; ?>">
  <?php print $head; ?>
  <title><?php print $head_title; ?></title>
  <?php print $styles; ?>
  <?php print $scripts; ?>
</head>
<body class="<?php print $classes; ?>" <?php print $attributes;?>>
  <div id="skip-link">
    <a href="#main-content" class="element-invisible element-focusable"><?php print t('Skip to main content'); ?></a>
  </div>
  <?php print $page_top; ?>
  <?php print $page; ?>
  <?php print $page_bottom; ?>
</body>
</html>
