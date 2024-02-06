<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitf6d62b41cec4500ead333abbe91c7c05
{
    public static $prefixLengthsPsr4 = array (
        'I' => 
        array (
            'Intervention\\Image\\' => 19,
            'Intervention\\Gif\\' => 17,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Intervention\\Image\\' => 
        array (
            0 => __DIR__ . '/..' . '/intervention/image/src',
        ),
        'Intervention\\Gif\\' => 
        array (
            0 => __DIR__ . '/..' . '/intervention/gif/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInitf6d62b41cec4500ead333abbe91c7c05::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInitf6d62b41cec4500ead333abbe91c7c05::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInitf6d62b41cec4500ead333abbe91c7c05::$classMap;

        }, null, ClassLoader::class);
    }
}