<?php

namespace App\Http\Services;

use Carbon\Carbon;
use Illuminate\Support\Str;

class UploadImage
{
    public static function upload($image, $directory)
    {
        $timestamp = Carbon::now()->format('YmdHs');
        $path = "/storage/$directory";
        $nameImage = Str::random(4) .  $timestamp . '.' . $image->getClientOriginalExtension();
        $image->storeAs(str_replace('storage', 'public', $path), $nameImage);

        return "$path/$nameImage";
    }
}
