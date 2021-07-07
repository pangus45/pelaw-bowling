<?php

$SCRIPT_DIR = dirname(__FILE__);

$CONFIG_FILE_PATH = $SCRIPT_DIR . '../../app/config/siteConfig.yml';
$DATA_FILE_PATH = $SCRIPT_DIR . '/version';

if (!file_exists($DATA_FILE_PATH)) {

    $oldVersion = 1;

} else {

    $oldVersion = file_get_contents($DATA_FILE_PATH);
}

$file = file_get_contents($CONFIG_FILE_PATH);

if (!$file) {
    echo $CONFIG_FILE_PATH . ' not found';
    return;
}

$needle = "version: '";

$versionPos = strpos($file, "version: ");

if (!is_numeric($versionPos)) {
    return;
}

$firstCharIndex = $versionPos + strlen($needle);
$charIndex = $firstCharIndex;

do {

    $char = substr($file, $charIndex, 1);

    $charIndex++;

} while (is_numeric($char));

$numberDigits = $charIndex - $firstCharIndex - 1;

$newVersion = intval($oldVersion) + 1;

$file = substr_replace($file, $newVersion, $firstCharIndex, $numberDigits);

echo $CONFIG_FILE_PATH . " updated\n";
echo 'New Version: ' . $newVersion . "\n";

file_put_contents($CONFIG_FILE_PATH, $file);
file_put_contents($DATA_FILE_PATH, $newVersion);